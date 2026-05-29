/**
 * Lightweight DB-backed rate limiter for expensive non-export endpoints.
 *
 * The freemium `consume()` engine handles export quotas. This throttle protects
 * endpoints that cost money or send mail but aren't tied to the export counter:
 *
 *   • "ai"       — OpenAI-backed routes. Without this, an anonymous visitor can
 *                  script /api/ai/* and run up the owner's OpenAI bill.
 *   • "pw_reset" — password-reset emails. Caps reset-mail volume per IP/identity
 *                  so the endpoint can't be used to mailbomb a victim or burn the
 *                  Resend quota.
 *
 * It reuses the UsageEvent table (kind = the throttle kind, delta = 0 so these
 * rows never count as paid usage). The export rate limiter in service.ts is
 * scoped to export kinds, so these rows don't interfere with export quotas.
 *
 * Serverless-safe: counts live in the DB, not in per-instance memory.
 */

import { prisma } from "@/lib/prisma";
import { resolveActor, type Actor } from "./actor";

export type ThrottleKind = "ai" | "pw_reset";

type Limits = { windowSec: number; perIp: number; perActor: number };

const LIMITS: Record<ThrottleKind, Limits> = {
  // ~16-25 calls is a heavy legit resume-building session; thousands is abuse.
  ai: { windowSec: 10 * 60, perIp: 60, perActor: 40 },
  // A real user needs one reset; 5 in 15 min is already generous.
  pw_reset: { windowSec: 15 * 60, perIp: 5, perActor: 5 }
};

export type ThrottleResult = {
  ok: boolean;
  actor: Actor;
  /** Seconds to wait before retrying. 0 when the request was allowed. */
  retryAfterSec: number;
};

/**
 * Check + record an attempt. Returns `ok:false` with a Retry-After hint when
 * either the per-IP or per-actor budget for the window is exhausted.
 *
 * Pass `actor` if you've already resolved it to avoid a duplicate lookup.
 */
export async function throttle(kind: ThrottleKind, actor?: Actor): Promise<ThrottleResult> {
  const who = actor ?? (await resolveActor({ persist: false }));
  const limits = LIMITS[kind];
  const since = new Date(Date.now() - limits.windowSec * 1000);

  const [ipCount, actorCount] = await Promise.all([
    prisma.usageEvent.count({
      where: { ipHash: who.ipHash, kind, createdAt: { gte: since } }
    }),
    prisma.usageEvent.count({
      where: { actorType: who.type, actorId: who.id, kind, createdAt: { gte: since } }
    })
  ]);

  if (ipCount >= limits.perIp || actorCount >= limits.perActor) {
    return { ok: false, actor: who, retryAfterSec: limits.windowSec };
  }

  // Record the (allowed) attempt so the next call sees it. delta:0 keeps these
  // rows out of any paid-usage accounting.
  try {
    await prisma.usageEvent.create({
      data: {
        actorType: who.type,
        actorId: who.id,
        kind,
        outcome: "consumed",
        delta: 0,
        ipHash: who.ipHash,
        uaHash: who.uaHash
      }
    });
  } catch (err) {
    // Never let rate-limit bookkeeping break the underlying request.
    console.error("[throttle] failed to record attempt", err);
  }

  return { ok: true, actor: who, retryAfterSec: 0 };
}
