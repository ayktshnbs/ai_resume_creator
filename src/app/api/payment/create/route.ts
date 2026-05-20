import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPaymentProvider } from "@/lib/payments/provider";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const provider = getPaymentProvider();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // TODO: Create a pending payment record in your database here.
    // const paymentRecord = await db.payment.create({
    //   data: {
    //     userId: session.user.id,
    //     status: "pending",
    //     amount: Number(process.env.PAYMENT_PRICE || 149),
    //   }
    // });

    const result = await provider.createPayment({
      userId: (session.user as any).id,
      email: session.user.email!,
      productName: "CVForge AI Pro Plan",
      price: Number(process.env.PAYMENT_PRICE || 149),
      currency: process.env.PAYMENT_CURRENCY || "TRY",
      callbackUrl: `${siteUrl}/api/payment/callback`,
      successUrl: `${siteUrl}/payment/success`,
      failUrl: `${siteUrl}/payment/fail`,
    });

    if (result.success) {
      // TODO: Update the payment record with the provider's paymentId.
      // await db.payment.update({
      //   where: { id: paymentRecord.id },
      //   data: { providerPaymentId: result.paymentId }
      // });
      
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: result.error || "Payment creation failed" }, { status: 400 });
    }
  } catch (error) {
    console.error("[Payment Create Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
