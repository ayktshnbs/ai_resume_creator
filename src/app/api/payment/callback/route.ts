import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments/provider";

export async function POST(req: Request) {
  try {
    const rawData = await req.formData();
    const data = Object.fromEntries(rawData.entries());

    console.log("[Payment Callback] Received data:", Object.keys(data));

    const provider = getPaymentProvider();

    // iyzico sends the token back in the callback
    const token = data.token as string;

    if (!token) {
      console.error("[Payment Callback] Missing token");
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      return NextResponse.redirect(`${siteUrl}/payment/fail`);
    }

    const verification = await provider.verifyPayment({
      paymentId: token,
      providerRawData: data,
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (verification.success && verification.status === "paid") {
      // TODO: Update user to PRO in database
      // 1. Find the payment record by token/conversationId.
      // 2. Mark payment as 'paid'.
      // 3. Set user plan = 'pro', proExpiresAt = now + 30 days.

      console.log("[Payment Callback] Payment verified:", verification.paymentId);
      return NextResponse.redirect(`${siteUrl}/payment/success`);
    }

    console.log("[Payment Callback] Payment failed:", verification.error);
    return NextResponse.redirect(`${siteUrl}/payment/fail`);
  } catch (error) {
    console.error("[Payment Callback Error]", error);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return NextResponse.redirect(`${siteUrl}/payment/fail`);
  }
}
