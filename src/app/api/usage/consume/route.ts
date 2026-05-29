import { NextRequest, NextResponse } from "next/server";
import { GUEST_COOKIE } from "@/middleware";
import { resolveActor } from "@/lib/usage/actor";
import { consume, rejectPremiumTemplate } from "@/lib/usage/service";
import { USAGE_KINDS, type UsageKind } from "@/lib/usage/config";
import { isPremiumTemplateId } from "@/templates/cvTemplates";

/**
 * Atomic debit: client must call this BEFORE running the local PDF export.
 * Returns an export token on success — the client passes that back to
 * /api/usage/refund if generation fails (within 60s).
 *
 * Security:
 *   • Actor is resolved server-side from session+cookie; not from the body.
 *   • Limit and rate-limit checks happen server-side; the request body is
 *     only used to pick which counter to debit.
 *   • All counters live in DB rows the client cannot mutate directly.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const kindRaw = (body as { kind?: unknown })?.kind;
  if (typeof kindRaw !== "string" || !USAGE_KINDS.includes(kindRaw as UsageKind)) {
    return NextResponse.json({ ok: false, error: "invalid_kind" }, { status: 400 });
  }
  const kind = kindRaw as UsageKind;
  const templateIdRaw = (body as { templateId?: unknown })?.templateId;
  const templateId =
    typeof templateIdRaw === "number" || typeof templateIdRaw === "string"
      ? templateIdRaw
      : undefined;

  const actor = await resolveActor();

  // Premium template gate runs BEFORE the cap so a guest hitting a premium
  // template doesn't burn their free credit and then still get blocked.
  if (kind === "resume" && templateId !== undefined) {
    const isPremium = isPremiumTemplateId(templateId);
    const reject = await rejectPremiumTemplate(actor, kind, isPremium);
    if (reject) {
      return NextResponse.json(reject, { status: 402 });
    }
  }

  const result = await consume(actor, kind);

  const failureReason = "reason" in result ? result.reason : null;
  const retryAfterSec = "retryAfterSec" in result ? result.retryAfterSec : undefined;

  let status: number;
  if (result.ok) {
    status = 200;
  } else if (failureReason === "rate_limited") {
    status = 429;
  } else {
    status = 402;
  }

  const res = NextResponse.json(result, { status });

  if (actor.type === "guest" && actor.newCookieValue) {
    res.cookies.set(GUEST_COOKIE, actor.newCookieValue, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 90,
      path: "/"
    });
  }

  if (failureReason === "rate_limited" && retryAfterSec) {
    res.headers.set("Retry-After", String(retryAfterSec));
  }

  return res;
}
