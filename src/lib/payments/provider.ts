import type { CreatePaymentInput, CreatePaymentResult, VerifyPaymentInput, VerifyPaymentResult } from "./types";
import { LemonSqueezyProvider } from "./lemonsqueezy-provider";

export interface PaymentProvider {
  name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;
}

export function getPaymentProvider(): PaymentProvider {
  return new LemonSqueezyProvider();
}
