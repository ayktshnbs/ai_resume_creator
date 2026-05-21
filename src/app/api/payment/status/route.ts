import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, planExpiresAt: true },
    });

    if (!user) {
      return NextResponse.json({ plan: "free", paymentStatus: "none" });
    }

    const isPro =
      user.plan === "pro" &&
      (!user.planExpiresAt || new Date(user.planExpiresAt) > new Date());

    return NextResponse.json({
      plan: isPro ? "pro" : "free",
      paymentStatus: isPro ? "paid" : "none",
    });
  } catch (error) {
    console.error("[Payment Status Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
