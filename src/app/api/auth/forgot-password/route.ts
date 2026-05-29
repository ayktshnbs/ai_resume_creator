import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/resend";
import { throttle } from "@/lib/usage/throttle";

export async function POST(req: Request) {
  try {
    const { email: rawEmail } = (await req.json()) as { email?: string };
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Throttle by IP so this endpoint can't be used to mailbomb a victim or
    // exhaust the email-sending quota.
    const gate = await throttle("pw_reset");
    if (!gate.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a few minutes." },
        { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { email, token, expires },
    });

    await sendPasswordResetEmail(email, token);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Forgot Password Error]", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
