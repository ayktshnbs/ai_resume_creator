import Stripe from "stripe";
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

function getStripe() {
  // Intentionally not pinning apiVersion — the SDK's default matches the
  // version it was built against, which avoids drift if the SDK upgrades.
  return new Stripe(requiredEnv("STRIPE_SECRET_KEY"));
}

/**
 * Server-side price catalog. Prices are NEVER taken from the client — the
 * client only sends a plan key ("monthly" or "yearly") and the amount is
 * looked up here so a tampered request can't lower the price.
 *
 * Amounts are in euro cents.
 */
const PLAN_CATALOG: Record<BillingPlan, { amountCents: number; interval: "month" | "year"; intervalCount: number }> = {
  monthly: { amountCents: 300, interval: "month", intervalCount: 1 }, // €3/mo (50% off promo)
  yearly: { amountCents: 2520, interval: "year", intervalCount: 1 },  // €25.20/yr (€2.10/mo equivalent)
};

export function getPlanAmountEuros(plan: BillingPlan): number {
  return PLAN_CATALOG[plan].amountCents / 100;
}

export class StripeProvider implements PaymentProvider {
  name = "stripe";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    try {
      const stripe = getStripe();
      const planSpec = PLAN_CATALOG[input.plan];
      if (!planSpec) {
        return { success: false, error: `Unknown plan: ${input.plan}` };
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        // Pre-fill email; if the email already maps to a Stripe customer
        // Stripe will reuse it, so we don't end up with duplicates.
        customer_email: input.email,
        // client_reference_id is mirrored back on the session — useful as a
        // backup user lookup if metadata is somehow stripped.
        client_reference_id: input.userId,
        line_items: [
          {
            price_data: {
              currency: input.currency || "eur",
              product_data: {
                name: input.productName,
                description:
                  input.plan === "yearly"
                    ? "Unlimited CVs & cover letters, AI rewrite, ATS scoring, high-res PDF — billed yearly"
                    : "Unlimited CVs & cover letters, AI rewrite, ATS scoring, high-res PDF — billed monthly",
              },
              unit_amount: planSpec.amountCents,
              recurring: {
                interval: planSpec.interval,
                interval_count: planSpec.intervalCount,
              },
            },
            quantity: 1,
          },
        ],
        success_url: input.successUrl,
        cancel_url: input.failUrl,
        // Metadata appears on the Session AND we copy it onto the Subscription
        // so the webhook handler can resolve the user from either object.
        metadata: { user_id: input.userId, plan: input.plan },
        subscription_data: {
          metadata: { user_id: input.userId, plan: input.plan },
        },
        // Lets users manage / cancel from the billing portal later.
        allow_promotion_codes: true,
      });

      if (!session.url) {
        return { success: false, error: "Stripe did not return a checkout URL" };
      }

      return {
        success: true,
        paymentId: session.id,
        paymentPageUrl: session.url,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Stripe checkout creation failed",
      };
    }
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    const { rawBody, signature } = input.providerRawData as {
      rawBody: string;
      signature: string;
    };

    const stripe = getStripe();
    const webhookSecret = requiredEnv("STRIPE_WEBHOOK_SECRET");

    let event: Stripe.Event;
    try {
      // constructEvent does HMAC-SHA256 verification + tolerance check against
      // the timestamp in the t= portion of the signature header, so we can't
      // be replayed with an old payload.
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      return {
        success: false,
        paymentId: input.paymentId,
        status: "failed",
        error: `Invalid webhook signature: ${err instanceof Error ? err.message : "unknown"}`,
      };
    }

    // The two events that grant Pro:
    //   • checkout.session.completed — first time the user pays
    //   • invoice.paid              — every renewal cycle
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      // Only treat as success if Stripe says the session was actually paid.
      const paid =
        session.payment_status === "paid" ||
        session.payment_status === "no_payment_required";
      const userId =
        session.metadata?.user_id || session.client_reference_id || undefined;
      return {
        success: paid,
        paymentId: session.id,
        status: paid ? "paid" : "failed",
        userId,
        error: paid ? undefined : `Payment not completed: ${session.payment_status}`,
      };
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      const subId = (invoice as unknown as { subscription?: string }).subscription;
      // metadata.user_id is set on the subscription at checkout time. Fall back
      // to the invoice's own metadata if Stripe didn't propagate it.
      let userId: string | undefined = invoice.metadata?.user_id;
      if (!userId && subId) {
        try {
          const sub = await stripe.subscriptions.retrieve(subId);
          userId = sub.metadata?.user_id;
        } catch {
          /* fall through — we'll return failed below if userId still missing */
        }
      }
      return {
        success: !!userId,
        paymentId: invoice.id || input.paymentId,
        status: "paid",
        userId,
        error: userId ? undefined : "Could not resolve user_id from invoice",
      };
    }

    // Any other event type — acknowledge it (return success with status=paid
    // and no userId) so the webhook endpoint replies 200 and Stripe stops
    // retrying. The callback route checks for userId before granting Pro.
    return {
      success: false,
      paymentId: input.paymentId,
      status: "failed",
      error: `Ignored event type: ${event.type}`,
    };
  }
}
