import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments/provider";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const rawData = await req.formData();
    const data = Object.fromEntries(rawData.entries());

    const provider = getPaymentProvider();
    const token = data.token as string;

    if (!token) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      return NextResponse.redirect(`${siteUrl}/payment/fail`);
    }

    const verification = await provider.verifyPayment({
      paymentId: token,
      providerRawData: data,
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (verification.success && verification.status === "paid") {
      const conversationId = data.conversationId as string | undefined;

      if (conversationId) {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        await prisma.user.update({
          where: { id: conversationId },
          data: {
            plan: "pro",
            planExpiresAt: thirtyDaysFromNow,
          },
        });
      }

      return NextResponse.redirect(`${siteUrl}/payment/success`);
    }

    return NextResponse.redirect(`${siteUrl}/payment/fail`);
  } catch (error) {
    console.error("[Payment Callback Error]", error);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return NextResponse.redirect(`${siteUrl}/payment/fail`);
  }
}
