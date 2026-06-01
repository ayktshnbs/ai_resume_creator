import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { createCustomerPortalLink } from "@/lib/payments/creem-provider";

/**
 * POST /api/payment/portal
 *
 * Authenticated Pro users hit this when they click "Manage subscription".
 * We mint a Creem customer-portal link (where they can cancel, update card,
 * download invoices) and return it for the client to redirect to.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { creemCustomerId: true, plan: true },
    });

    if (!user?.creemCustomerId) {
      // Either the user never subscribed, or their subscription pre-dates
      // the customer-id capture. Either way, point them at /pricing.
      return NextResponse.json(
        { error: "No active subscription found. Subscribe first to manage billing." },
        { status: 404 },
      );
    }

    const result = await createCustomerPortalLink(user.creemCustomerId);
    if (!result.url) {
      return NextResponse.json(
        { error: result.error || "Could not open billing portal" },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error("[Payment Portal Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
