import crypto from "crypto";
import type { PaymentProvider } from "./provider";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  VerifyPaymentInput,
  VerifyPaymentResult,
} from "./types";

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getLemonSqueezyConfig() {
  const variantId = requiredEnv("LEMONSQUEEZY_VARIANT_ID");

  return {
    apiKey: requiredEnv("LEMONSQUEEZY_API_KEY"),
    storeId: requiredEnv("LEMONSQUEEZY_STORE_ID"),
    variantId,
    variantIdNumber: Number(variantId),
    webhookSecret: requiredEnv("LEMONSQUEEZY_WEBHOOK_SECRET"),
  };
}

export class LemonSqueezyProvider implements PaymentProvider {
  name = "lemonsqueezy";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    try {
      const config = getLemonSqueezyConfig();

      if (!Number.isInteger(config.variantIdNumber) || config.variantIdNumber <= 0) {
        return {
          success: false,
          error: "Invalid Lemon Squeezy variant id configuration",
        };
      }

      const customData = {
        user_id: input.userId,
        member_id: input.userId,
      };

      const body = {
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: input.email,
              custom: customData,
            },
            checkout_options: {
              embed: false,
              media: false,
              dark: false,
            },
            product_options: {
              enabled_variants: [config.variantIdNumber],
              redirect_url: input.successUrl,
              receipt_link_url: input.successUrl,
              receipt_button_text: "Go to Dashboard",
            },
          },
          relationships: {
            store: {
              data: { type: "stores", id: config.storeId },
            },
            variant: {
              data: { type: "variants", id: config.variantId },
            },
          },
        },
      };

      const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: result.errors?.[0]?.detail || "Checkout creation failed",
        };
      }

      const checkoutUrl = result.data?.attributes?.url;
      if (checkoutUrl) {
        return {
          success: true,
          paymentId: result.data.id,
          paymentPageUrl: checkoutUrl,
        };
      }

      return { success: false, error: "No checkout URL returned" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    const { rawBody, signature } = input.providerRawData;
    const { webhookSecret } = getLemonSqueezyConfig();

    const hmac = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (hmac !== signature) {
      return {
        success: false,
        paymentId: input.paymentId,
        status: "failed",
        error: "Invalid webhook signature",
      };
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;

    if (eventName !== "order_created") {
      return {
        success: false,
        paymentId: input.paymentId,
        status: "failed",
        error: `Unhandled event: ${eventName}`,
      };
    }

    const status = payload.data?.attributes?.status;

    return {
      success: status === "paid",
      paymentId: String(payload.data?.id || input.paymentId),
      status: status === "paid" ? "paid" : "failed",
      userId: payload.meta?.custom_data?.user_id || payload.meta?.custom_data?.member_id,
      error: status === "paid" ? undefined : "Payment not completed",
    };
  }
}
