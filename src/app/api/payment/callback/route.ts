import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments/provider";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";

    const provider = getPaymentProvider();

    const verification = await provider.verifyPayment({
      paymentId: "",
      providerRawData: { rawBody, signature },
    });

    if (verification.success && verification.status === "paid" && verification.userId) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      await prisma.user.update({
        where: { id: verification.userId },
        data: {
          plan: "pro",
          planExpiresAt: thirtyDaysFromNow,
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Payment Webhook Error]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
