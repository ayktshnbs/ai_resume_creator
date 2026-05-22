import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const fromEmail = () => process.env.RESEND_FROM_EMAIL || "noreply@resend.dev";

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${siteUrl()}/reset-password?token=${token}`;

  await getResend().emails.send({
    from: `CV with AI <${fromEmail()}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #111; font-size: 24px; margin-bottom: 16px;">Reset your password</h2>
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}" style="display: inline-block; margin: 24px 0; padding: 14px 28px; background: #6366f1; color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
