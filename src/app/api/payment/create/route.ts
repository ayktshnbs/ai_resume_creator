import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPaymentProvider } from "@/lib/payments/provider";
import type { BillingPlan } from "@/lib/payments/types";
import { getPlanAmountEuros } from "@/lib/payments/creem-provider";

const ALLOWED_PLANS: BillingPlan[] = ["monthly", "yearly"];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Plan is the only thing the client can choose. The actual amount comes
    // from the server-side catalog so a tampered request can't lower the price.
    let plan: BillingPlan = "monthly";
    try {
      const body = (await req.json().catch(() => ({}))) as { plan?: unknown };
      if (typeof body.plan === "string" && ALLOWED_PLANS.includes(body.plan as BillingPlan)) {
        plan = body.plan as BillingPlan;
      }
    } catch {
      /* body optional — default to monthly */
    }

    const provider = getPaymentProvider();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const result = await provider.createPayment({
      userId: session.user.id,
      email: session.user.email,
      productName:
        plan === "yearly" ? "CV with AI Pro — Yearly" : "CV with AI Pro — Monthly",
      plan,
      price: getPlanAmountEuros(plan),
      currency: "eur",
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
