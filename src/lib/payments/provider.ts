import { CreatePaymentInput, CreatePaymentResult, VerifyPaymentInput, VerifyPaymentResult } from "./types";
import { MockProvider } from "./mock-provider";

export interface PaymentProvider {
  name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;
}

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER || "mock";

  switch (provider) {
    case "mock":
      return new MockProvider();
    // Add real providers here as they are implemented:
    // case "iyzico": return new IyzicoProvider();
    // case "paytr": return new PayTRProvider();
    default:
      return new MockProvider();
  }
}
