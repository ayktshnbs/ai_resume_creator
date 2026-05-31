import type { CreatePaymentInput, CreatePaymentResult, VerifyPaymentInput, VerifyPaymentResult } from "./types";
import { StripeProvider } from "./stripe-provider";

export interface PaymentProvider {
  name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;
}

export function getPaymentProvider(): PaymentProvider {
  return new StripeProvider();
}
