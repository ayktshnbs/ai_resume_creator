import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ resumeCount: 0, coverLetterCount: 0, plan: "free" });
  }

  const [resumeCount, coverLetterCount, user] = await Promise.all([
    prisma.resume.count({ where: { userId: session.user.id } }),
    prisma.coverLetter.count({ where: { userId: session.user.id } }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, planExpiresAt: true },
    }),
  ]);

  const isPro =
    user?.plan === "pro" &&
    (!user.planExpiresAt || new Date(user.planExpiresAt) > new Date());

  return NextResponse.json({
    resumeCount,
    coverLetterCount,
    plan: isPro ? "pro" : "free",
  });
}
