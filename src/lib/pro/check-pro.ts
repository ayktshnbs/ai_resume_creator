import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export type ProStatus = {
  isPro: boolean;
  reason?: "free" | "expired" | "not_logged_in";
};

export async function checkProStatus(): Promise<ProStatus> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { isPro: false, reason: "not_logged_in" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, planExpiresAt: true },
  });

  if (!user || user.plan !== "pro") {
    return { isPro: false, reason: "free" };
  }

  if (user.planExpiresAt && new Date(user.planExpiresAt) <= new Date()) {
    return { isPro: false, reason: "expired" };
  }

  return { isPro: true };
}
