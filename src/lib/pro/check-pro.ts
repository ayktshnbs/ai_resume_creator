import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type ProStatus = {
  isPro: boolean;
  reason?: "free" | "expired" | "not_logged_in";
};

/**
 * Server-side check for Pro status.
 * This should ideally query the database for the most up-to-date plan status.
 */
export async function checkProStatus(): Promise<ProStatus> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { isPro: false, reason: "not_logged_in" };
  }

  // TODO: Replace with real database query:
  // const user = await db.user.findUnique({ where: { id: session.user.id } });
  // if (user?.plan === "pro" && (!user.proExpiresAt || new Date(user.proExpiresAt) > new Date())) {
  //   return { isPro: true };
  // }
  
  // For now, since we have no DB, we'll use a mock check.
  // In a real app, do NOT store pro status in the session token unless it's strictly verified.
  return { isPro: false, reason: "free" };
}
