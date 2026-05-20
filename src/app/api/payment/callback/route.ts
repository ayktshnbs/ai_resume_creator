import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments/provider";

export async function POST(req: Request) {
  try {
    const rawData = await req.formData();
    // Some providers send data as JSON, adjust if needed.
    const data = Object.fromEntries(rawData.entries());
    
    console.log("[Payment Callback] Received data:", data);

    const provider = getPaymentProvider();
    
    // In real flow, you extract paymentId from the provider's data.
    // Iyzico: data.paymentId
    // PayTR: data.merchant_oid
    const paymentId = (data.paymentId || data.merchant_oid) as string;

    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
    }

    const verification = await provider.verifyPayment({
      paymentId,
      providerRawData: data,
    });

    if (verification.success && verification.status === "paid") {
      // TODO: Update user to PRO in database
      // 1. Find the payment record by providerPaymentId.
      // 2. Mark payment as 'paid'.
      // 3. Find user and set plan = 'pro', proExpiresAt = (now + 30 days).
      
      console.log("[Payment Callback] Success for", paymentId);
    } else {
      console.log("[Payment Callback] Failed for", paymentId);
    }

    // Providers usually expect a simple "OK" or specific success string in response.
    // PayTR: return "OK"
    // Iyzico: return redirect to successUrl
    return NextResponse.json({ status: "processed" });
  } catch (error) {
    console.error("[Payment Callback Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
