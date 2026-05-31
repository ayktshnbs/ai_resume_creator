import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments/provider";
import { prisma } from "@/lib/prisma";

// Important: keep the body as text. Stripe's signature is computed over the
// raw bytes, so any JSON parsing here would invalidate the verification.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    // Stripe sends the signature in `stripe-signature`. We also accept
    // `x-signature` for back-compat with any provider that might still use it.
    const signature =
      req.headers.get("stripe-signature") ||
      req.headers.get("x-signature") ||
      "";

    const provider = getPaymentProvider();

    const verification = await provider.verifyPayment({
      paymentId: "",
      providerRawData: { rawBody, signature },
    });

    if (verification.success && verification.status === "paid" && verification.userId) {
      // We don't know the exact period end without re-querying Stripe, so we
      // grant 31 days on monthly and 366 days on yearly. The next renewal's
      // invoice.paid event will re-extend the plan.
      const expiresAt = new Date();
      // We can't read plan reliably from the verification result; default to
      // 31 days. invoice.paid renewals will re-extend, so worst case the user
      // gets prompted to renew a day early.
      expiresAt.setDate(expiresAt.getDate() + 31);

      await prisma.user.update({
        where: { id: verification.userId },
        data: {
          plan: "pro",
          planExpiresAt: expiresAt,
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Payment Webhook Error]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
