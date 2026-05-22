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

    const result = await provider.createPayment({
      userId: session.user.id,
      email: session.user.email!,
      productName: "CV with AI Pro Plan",
      price: 0,
      currency: "",
      callbackUrl: `${siteUrl}/api/payment/callback`,
      successUrl: `${siteUrl}/payment/success`,
      failUrl: `${siteUrl}/payment/fail`,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: result.error || "Payment creation failed" }, { status: 400 });
  } catch (error) {
    console.error("[Payment Create Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
