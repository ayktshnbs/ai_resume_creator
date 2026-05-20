import crypto from "crypto";
import type { PaymentProvider } from "./provider";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  VerifyPaymentInput,
  VerifyPaymentResult,
} from "./types";

const API_KEY = () => process.env.IYZICO_API_KEY!;
const SECRET_KEY = () => process.env.IYZICO_SECRET_KEY!;
const BASE_URL = () =>
  process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";

function generateAuthHeaders(body: string) {
  const randomKey = crypto.randomBytes(8).toString("hex");
  const hashStr = API_KEY() + randomKey + SECRET_KEY() + body;
  const shaSum = crypto.createHash("sha1").update(hashStr, "utf8").digest("base64");
  const authorizationV1 = `IYZWS ${API_KEY()}:${shaSum}`;

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: authorizationV1,
    "x-iyzi-rnd": randomKey,
  };
}

async function iyzicoRequest(path: string, body: Record<string, unknown>) {
  const bodyStr = JSON.stringify(body);
  const headers = generateAuthHeaders(bodyStr);

  const res = await fetch(`${BASE_URL()}${path}`, {
    method: "POST",
    headers,
    body: bodyStr,
  });

  return (await res.json()) as Record<string, unknown>;
}

export class IyzicoProvider implements PaymentProvider {
  name = "iyzico";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const currencyMap: Record<string, string> = {
      TRY: "TRY",
      USD: "USD",
      EUR: "EUR",
      GBP: "GBP",
    };

    const body = {
      locale: "tr",
      conversationId: input.userId,
      price: String(input.price),
      paidPrice: String(input.price),
      currency: currencyMap[input.currency] || "TRY",
      basketId: `basket_${input.userId}_${Date.now()}`,
      paymentGroup: "PRODUCT",
      callbackUrl: input.callbackUrl,
      enabledInstallments: [1],
      buyer: {
        id: input.userId,
        name: input.email.split("@")[0],
        surname: "User",
        gsmNumber: "+905000000000",
        email: input.email,
        identityNumber: "00000000000",
        registrationAddress: "Turkey",
        ip: "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
      },
      shippingAddress: {
        contactName: input.email.split("@")[0],
        city: "Istanbul",
        country: "Turkey",
        address: "Turkey",
      },
      billingAddress: {
        contactName: input.email.split("@")[0],
        city: "Istanbul",
        country: "Turkey",
        address: "Turkey",
      },
      basketItems: [
        {
          id: "pro_plan",
          name: input.productName,
          category1: "Subscription",
          itemType: "VIRTUAL",
          price: String(input.price),
        },
      ],
    };

    const result = await iyzicoRequest(
      "/payment/iyzipos/checkoutform/initialize/auth/ecom",
      body,
    );

    if (result.status === "success" && result.paymentPageUrl) {
      return {
        success: true,
        paymentId: result.token as string,
        paymentPageUrl: result.paymentPageUrl as string,
      };
    }

    if (result.status === "success" && result.checkoutFormContent) {
      return {
        success: true,
        paymentId: result.token as string,
        threeDSHtmlContent: result.checkoutFormContent as string,
      };
    }

    return {
      success: false,
      error:
        (result.errorMessage as string) ||
        "iyzico payment initialization failed",
    };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    const result = await iyzicoRequest(
      "/payment/iyzipos/checkoutform/auth/ecom/detail",
      {
        locale: "tr",
        conversationId: "",
        token: input.paymentId,
      },
    );

    const paid =
      result.status === "success" && result.paymentStatus === "SUCCESS";

    return {
      success: paid,
      paymentId: (result.paymentId as string) || input.paymentId,
      status: paid ? "paid" : "failed",
      error: paid
        ? undefined
        : (result.errorMessage as string) || "Payment verification failed",
    };
  }
}
