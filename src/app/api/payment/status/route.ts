import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Query database for current user plan status.
    // const user = await db.user.findUnique({ where: { id: session.user.id } });
    
    // Mock response
    return NextResponse.json({
      plan: "free", // or "pro"
      paymentStatus: "none", // or "paid", "pending"
    });
  } catch (error) {
    console.error("[Payment Status Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
