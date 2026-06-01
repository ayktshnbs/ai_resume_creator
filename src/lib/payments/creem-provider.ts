import crypto from "crypto";
import type { PaymentProvider } from "./provider";
import type {
  BillingPlan,
  CreatePaymentInput,
  CreatePaymentResult,
  VerifyPaymentInput,
  VerifyPaymentResult,
} from "./types";

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

/**
 * Server-side price catalog. The client only sends a plan key — the product_id
 * and amount come from this catalog so a tampered request can't pick a
 * different product or lower the price.
 *
 * `days` is how long Pro is granted after a successful checkout; the next
 * `subscription.paid` webhook will re-extend the plan on each renewal cycle.
 */
const PLAN_CATALOG: Record<
  BillingPlan,
  { productEnvVar: string; amountCents: number; days: number }
> = {
  monthly: { productEnvVar: "CREEM_PRODUCT_ID_MONTHLY", amountCents: 300, days: 31 },
  yearly: { productEnvVar: "CREEM_PRODUCT_ID_YEARLY", amountCents: 2520, days: 366 },
};

export function getPlanAmountEuros(plan: BillingPlan): number {
  return PLAN_CATALOG[plan].amountCents / 100;
}

export function getPlanGrantDays(plan: BillingPlan): number {
  return PLAN_CATALOG[plan].days;
}

const CREEM_API_URL = "https://api.creem.io/v1/checkouts";

type CreemEventObject = {
  id?: string;
  metadata?: { user_id?: string; plan?: BillingPlan };
};

type CreemEvent = {
  eventType?: string;
  object?: CreemEventObject;
};

export class CreemProvider implements PaymentProvider {
  name = "creem";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    try {
      const planSpec = PLAN_CATALOG[input.plan];
      if (!planSpec) {
        return { success: false, error: `Unknown plan: ${input.plan}` };
      }

      const apiKey = requiredEnv("CREEM_API_KEY");
      const productId = requiredEnv(planSpec.productEnvVar);

      const response = await fetch(CREEM_API_URL, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          // Idempotency: distinct per attempt, but stable enough that a quick
          // double-click won't double-charge. Combines user + plan + minute.
          request_id: `${input.userId}-${input.plan}-${Math.floor(Date.now() / 60000)}`,
          customer: { email: input.email },
          success_url: input.successUrl,
          // Metadata is echoed on every subscription webhook event, so this is
          // how we resolve the user when Creem calls our callback.
          metadata: {
            user_id: input.userId,
            plan: input.plan,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        return {
          success: false,
          error: `Creem checkout failed (${response.status}): ${errorText.slice(0, 240)}`,
        };
      }

      const data = (await response.json()) as { id?: string; checkout_url?: string };

      if (!data.checkout_url) {
        return { success: false, error: "Creem did not return a checkout URL" };
      }

      return {
        success: true,
        paymentId: data.id || "",
        paymentPageUrl: data.checkout_url,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Creem checkout creation failed",
      };
    }
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    const { rawBody, signature } = input.providerRawData as {
      rawBody: string;
      signature: string;
    };

    if (!signature) {
      return {
        success: false,
        paymentId: input.paymentId,
        status: "failed",
        error: "Missing creem-signature header",
      };
    }

    const webhookSecret = requiredEnv("CREEM_WEBHOOK_SECRET");

    // HMAC-SHA256 over the raw body, hex-encoded — matches Creem's signing.
    const computed = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    // Length-check first so timingSafeEqual doesn't throw on size mismatch.
    if (computed.length !== signature.length) {
      return {
        success: false,
        paymentId: input.paymentId,
        status: "failed",
        error: "Invalid webhook signature",
      };
    }

    let valid = false;
    try {
      valid = crypto.timingSafeEqual(
        Buffer.from(computed, "hex"),
        Buffer.from(signature, "hex"),
      );
    } catch {
      valid = false;
    }

    if (!valid) {
      return {
        success: false,
        paymentId: input.paymentId,
        status: "failed",
        error: "Invalid webhook signature",
      };
    }

    let event: CreemEvent;
    try {
      event = JSON.parse(rawBody) as CreemEvent;
    } catch {
      return {
        success: false,
        paymentId: input.paymentId,
        status: "failed",
        error: "Invalid webhook payload",
      };
    }

    const eventType = event.eventType;
    const obj = event.object || {};
    const userId = obj.metadata?.user_id;
    const plan = obj.metadata?.plan;

    // Events that grant or extend Pro:
    //   • checkout.completed     — first payment after checkout
    //   • subscription.active    — subscription created and active
    //   • subscription.paid      — every renewal cycle
    if (
      eventType === "checkout.completed" ||
      eventType === "subscription.active" ||
      eventType === "subscription.paid"
    ) {
      return {
        success: !!userId,
        paymentId: obj.id || input.paymentId,
        status: "paid",
        userId,
        plan,
        error: userId ? undefined : "Could not resolve user_id from event metadata",
      };
    }

    // Anything else (canceled, past_due, expired, etc.) — acknowledge so Creem
    // stops retrying, but don't change the user's plan from the webhook. The
    // existing expiry timestamp will lapse naturally.
    return {
      success: false,
      paymentId: input.paymentId,
      status: "failed",
      error: `Ignored event type: ${eventType ?? "unknown"}`,
    };
  }
}
