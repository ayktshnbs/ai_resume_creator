import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments/provider";
import { getPlanGrantDays } from "@/lib/payments/creem-provider";
import { prisma } from "@/lib/prisma";

// Important: keep the body as text. The HMAC signature is computed over the
// raw bytes, so any JSON parsing here would invalidate the verification.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    // Creem sends the HMAC-SHA256 signature in `creem-signature`. We also
    // accept `x-signature` as a back-compat alias for any provider that
    // might still use it.
    const signature =
      req.headers.get("creem-signature") ||
      req.headers.get("x-signature") ||
      "";

    const provider = getPaymentProvider();

    const verification = await provider.verifyPayment({
      paymentId: "",
      providerRawData: { rawBody, signature },
    });

    if (verification.success && verification.status === "paid" && verification.userId) {
      // Grant the right amount of access for the plan. The next
      // subscription.paid webhook on renewal will re-extend this.
      const plan = verification.plan ?? "monthly";
      const days = getPlanGrantDays(plan);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);

      // Persist the Creem customer id the first time we see it. On renewal
      // webhooks the id might be missing or the same — only write if we
      // have one, and don't overwrite an existing value with null.
      const updateData: {
        plan: string;
        planExpiresAt: Date;
        creemCustomerId?: string;
      } = {
        plan: "pro",
        planExpiresAt: expiresAt,
      };
      if (verification.customerId) {
        updateData.creemCustomerId = verification.customerId;
      }

      await prisma.user.update({
        where: { id: verification.userId },
        data: updateData,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Payment Webhook Error]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
