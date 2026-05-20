export type PaymentStatus = "none" | "pending" | "paid" | "failed";
export type UserPlan = "free" | "pro";

export type UserData = {
  id: string;
  email: string;
  name?: string;
  plan: UserPlan;
  proExpiresAt: string | null; // ISO Date
  paymentProvider: string | null;
  paymentId: string | null;
  paymentStatus: PaymentStatus;
};

export type CreatePaymentInput = {
  userId: string;
  email: string;
  productName: string;
  price: number;
  currency: string;
  callbackUrl: string;
  successUrl: string;
  failUrl: string;
};

export type CreatePaymentResult = {
  success: boolean;
  paymentId?: string;
  paymentPageUrl?: string;
  threeDSHtmlContent?: string;
  error?: string;
};

export type VerifyPaymentInput = {
  paymentId: string;
  providerRawData: any;
};

export type VerifyPaymentResult = {
  success: boolean;
  paymentId: string;
  status: "paid" | "failed";
  error?: string;
};
