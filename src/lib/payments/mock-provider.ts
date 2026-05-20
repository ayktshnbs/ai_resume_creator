import { PaymentProvider } from "./provider";
import { CreatePaymentInput, CreatePaymentResult, VerifyPaymentInput, VerifyPaymentResult } from "./types";

export class MockProvider implements PaymentProvider {
  name = "mock";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    console.log("[MockProvider] Creating payment for", input.email);
    
    // In a real 3D Secure flow (like iyzico), you would:
    // 1. Initialize a payment request to the provider's API.
    // 2. Receive a HTML content (for 3DS form) or a redirect URL.
    
    return {
      success: true,
      paymentId: `mock_${Date.now()}`,
      // For testing, we just point to our own success callback or a mock page
      paymentPageUrl: `${input.successUrl}?paymentId=mock_${Date.now()}&status=success`,
    };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    console.log("[MockProvider] Verifying payment", input.paymentId);
    
    // In real integration:
    // Iyzico: Check the callback token/signature and call their 'retrieve payment' API.
    // PayTR: Validate the hash sent in the POST body.
    
    return {
      success: true,
      paymentId: input.paymentId,
      status: "paid",
    };
  }
}

/**
 * TODO: Iyzico Integration Guide
 * 
 * 1. Install 'iyzipay' package.
 * 2. Create IyzicoProvider implementing PaymentProvider.
 * 3. Use 'iyzipay.checkoutFormInitialize.create' for the payment form.
 * 4. In verifyPayment, use 'iyzipay.checkoutForm.retrieve'.
 * 5. Map Iyzico's 'paymentStatus' to our 'paid'/'failed'.
 */

/**
 * TODO: PayTR Integration Guide
 * 
 * 1. Generate hash for payment request (merchant_id, user_ip, merchant_oid, email, etc.).
 * 2. Get iframe token from PayTR API.
 * 3. Return the iframe token to frontend.
 * 4. verifyPayment should handle the POST callback from PayTR (validate hash).
 */
