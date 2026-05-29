/**
 * The atomic consume / refund engine.
 *
 * Every successful consume:
 *   1. Re-checks the actor's current count inside a transaction (prevents
 *      multi-tab and refresh races: even if two requests pass the in-memory
 *      check, the DB increment is serial).
 *   2. Bumps the counter on the User or GuestSession row.
 *   3. Writes a UsageEvent for audit + rate-limiting.
 *   4. Mints a single-use export token bound to actor+kind+nonce+exp.
 *
 * Refunds reverse the counter and mark the matching UsageEvent.refundedAt
 * so it can't be double-refunded.
 */

import { prisma } from "@/lib/prisma";
import {
  mintExportToken,
  readExportToken,
  type ExportTokenPayload
} from "./crypto";
import { EXPORT_TOKEN_TTL_SEC, RATE_LIMITS, REFUND_WINDOW_SEC, type UsageKind } from "./config";
import { limitFor, quotaSnapshot, remainingFor, usedFor, type Actor } from "./actor";

export type ConsumeResult =
  | {
      ok: true;
      token: string;
      quota: ReturnType<typeof quotaSnapshot>;
      refundUntil: number; // unix ms
    }
  | {
      ok: false;
      reason: "limit_reached" | "rate_limited" | "needs_signin" | "needs_upgrade" | "template_locked";
      quota: ReturnType<typeof quotaSnapshot>;
      retryAfterSec?: number;
    };

export async function consume(actor: Actor, kind: UsageKind): Promise<ConsumeResult> {
  // 1. Rate-limit guard: count consume attempts in the last window. Cheap on
  //    indexed (actorType, actorId, createdAt) and (ipHash, createdAt).
  const now = new Date();
  const actorSince = new Date(now.getTime() - RATE_LIMITS.perActorWindowSec * 1000);
  const ipSince = new Date(now.getTime() - RATE_LIMITS.perIpWindowSec * 1000);

  // Scope to export kinds only: non-export throttle rows (ai, pw_reset) live in
  // the same table but must not count against the export rate limit.
  const exportKinds = { in: ["resume", "cover_letter"] };
  const [actorAttempts, ipAttempts] = await Promise.all([
    prisma.usageEvent.count({
      where: {
        actorType: actor.type,
        actorId: actor.id,
        kind: exportKinds,
        createdAt: { gte: actorSince }
      }
    }),
    prisma.usageEvent.count({
      where: { ipHash: actor.ipHash, kind: exportKinds, createdAt: { gte: ipSince } }
    })
  ]);
  if (actorAttempts >= RATE_LIMITS.perActorMaxAttempts) {
    await logAttempt(actor, kind, "rate_limited");
    return { ok: false, reason: "rate_limited", quota: quotaSnapshot(actor), retryAfterSec: RATE_LIMITS.perActorWindowSec };
  }
  if (ipAttempts >= RATE_LIMITS.perIpMaxAttempts) {
    await logAttempt(actor, kind, "rate_limited");
    return { ok: false, reason: "rate_limited", quota: quotaSnapshot(actor), retryAfterSec: RATE_LIMITS.perIpWindowSec };
  }

  // 2. Limit check + atomic increment. Pro users skip the cap.
  if (!actor.isPro && remainingFor(actor, kind) <= 0) {
    await logAttempt(actor, kind, "cap_reached");
    return {
      ok: false,
      // Guests must sign up first; logged-in free users must upgrade.
      reason: actor.type === "guest" ? "needs_signin" : "needs_upgrade",
      quota: quotaSnapshot(actor)
    };
  }

  // Inside a transaction: re-read the row, compare against the limit, then
  // increment. This closes the multi-tab race where two requests both passed
  // the in-memory check above.
  const tokenPayload: Omit<ExportTokenPayload, "n" | "iat" | "exp"> = {
    a: actor.type,
    i: actor.id,
    k: kind
  };
  const token = await mintExportToken(tokenPayload, EXPORT_TOKEN_TTL_SEC);

  try {
    await prisma.$transaction(async (tx) => {
      if (actor.type === "user") {
        const u = await tx.user.findUnique({
          where: { id: actor.id },
          select: { resumeExports: true, coverLetterExports: true, plan: true, planExpiresAt: true }
        });
        if (!u) throw new Error("User vanished mid-transaction");
        const proNow = u.plan === "pro" && (!u.planExpiresAt || u.planExpiresAt > now);
        if (!proNow) {
          const used = kind === "resume" ? u.resumeExports : u.coverLetterExports;
          const limit = limitFor(
            { ...actor, resumeExports: u.resumeExports, coverLetterExports: u.coverLetterExports },
            kind
          );
          if (used >= limit) throw new LimitExceededError();
        }
        await tx.user.update({
          where: { id: actor.id },
          data:
            kind === "resume"
              ? { resumeExports: { increment: 1 } }
              : { coverLetterExports: { increment: 1 } }
        });
      } else {
        const g = await tx.guestSession.findUnique({
          where: { cookieId: actor.id },
          select: { resumeExports: true, coverLetterExports: true }
        });
        if (!g) throw new Error("GuestSession vanished mid-transaction");
        const used = kind === "resume" ? g.resumeExports : g.coverLetterExports;
        const limit = limitFor(actor, kind);
        if (used >= limit) throw new LimitExceededError();
        await tx.guestSession.update({
          where: { cookieId: actor.id },
          data:
            kind === "resume"
              ? { resumeExports: { increment: 1 } }
              : { coverLetterExports: { increment: 1 } }
        });
      }

      await tx.usageEvent.create({
        data: {
          actorType: actor.type,
          actorId: actor.id,
          kind,
          outcome: "consumed",
          delta: 1,
          ipHash: actor.ipHash,
          uaHash: actor.uaHash,
          token
        }
      });
    });
  } catch (err) {
    if (err instanceof LimitExceededError) {
      await logAttempt(actor, kind, "cap_reached");
      return {
        ok: false,
        reason: actor.type === "guest" ? "needs_signin" : "needs_upgrade",
        quota: quotaSnapshot(actor)
      };
    }
    throw err;
  }

  // Build refreshed quota snapshot so the client gets the new "remaining".
  const after: Actor =
    actor.type === "user"
      ? {
          ...actor,
          resumeExports: kind === "resume" ? actor.resumeExports + 1 : actor.resumeExports,
          coverLetterExports:
            kind === "cover_letter" ? actor.coverLetterExports + 1 : actor.coverLetterExports
        }
      : {
          ...actor,
          resumeExports: kind === "resume" ? actor.resumeExports + 1 : actor.resumeExports,
          coverLetterExports:
            kind === "cover_letter" ? actor.coverLetterExports + 1 : actor.coverLetterExports
        };

  return {
    ok: true,
    token,
    quota: quotaSnapshot(after),
    refundUntil: Date.now() + REFUND_WINDOW_SEC * 1000
  };
}

class LimitExceededError extends Error {
  constructor() {
    super("limit_exceeded");
  }
}

/**
 * Append a non-incrementing audit row for a failed consume attempt.
 *
 * We log every attempt — successful or not — so the rate-limit count reflects
 * actual request volume, not just paid debits. This is what catches:
 *   • someone clearing cookies after burning their free credit and retrying
 *   • a script hammering the endpoint when already at cap
 *   • a free user trying to render a premium template
 *
 * `delta: 0` keeps the row counted by rate-limit queries but excluded from
 * any future "what did this actor pay for" reporting that sums delta.
 */
async function logAttempt(
  actor: { type: "user" | "guest"; id: string; ipHash: string; uaHash: string },
  kind: UsageKind,
  outcome: "rate_limited" | "cap_reached" | "template_locked"
) {
  try {
    await prisma.usageEvent.create({
      data: {
        actorType: actor.type,
        actorId: actor.id,
        kind,
        outcome,
        delta: 0,
        ipHash: actor.ipHash,
        uaHash: actor.uaHash
      }
    });
  } catch (err) {
    // Audit logging must never break the API response.
    console.error("[usage] logAttempt failed", err);
  }
}

/**
 * Server-side check used by the consume route when the caller specifies a
 * particular template. Premium templates are only renderable by Pro users.
 * Mirrors the client-side gate so the cap can't be bypassed by tampering with
 * the editor template state.
 */
export async function rejectPremiumTemplate(
  actor: import("./actor").Actor,
  kind: UsageKind,
  isPremium: boolean
): Promise<ConsumeResult | null> {
  if (!isPremium || actor.isPro) return null;
  await logAttempt(actor, kind, "template_locked");
  // Premium templates require Pro for everyone (guest or free user alike), so
  // surface the template-specific paywall copy rather than the generic one.
  return {
    ok: false,
    reason: "template_locked",
    quota: quotaSnapshot(actor)
  };
}

/**
 * Reverse a recent consume. Used when the client-side PDF generation fails
 * after a successful debit, so the user isn't unfairly charged.
 */
export async function refund(actor: Actor, token: string): Promise<{ ok: boolean; reason?: string; quota: ReturnType<typeof quotaSnapshot> }> {
  const payload = await readExportToken(token);
  if (!payload) {
    return { ok: false, reason: "invalid_token", quota: quotaSnapshot(actor) };
  }
  if (payload.a !== actor.type || payload.i !== actor.id) {
    return { ok: false, reason: "actor_mismatch", quota: quotaSnapshot(actor) };
  }

  const event = await prisma.usageEvent.findFirst({
    where: { token, actorType: actor.type, actorId: actor.id }
  });
  if (!event) {
    return { ok: false, reason: "event_not_found", quota: quotaSnapshot(actor) };
  }
  if (event.refundedAt) {
    return { ok: false, reason: "already_refunded", quota: quotaSnapshot(actor) };
  }
  if (event.createdAt.getTime() + REFUND_WINDOW_SEC * 1000 < Date.now()) {
    return { ok: false, reason: "window_expired", quota: quotaSnapshot(actor) };
  }

  await prisma.$transaction(async (tx) => {
    if (actor.type === "user") {
      await tx.user.update({
        where: { id: actor.id },
        data:
          payload.k === "resume"
            ? { resumeExports: { decrement: 1 } }
            : { coverLetterExports: { decrement: 1 } }
      });
    } else {
      await tx.guestSession.update({
        where: { cookieId: actor.id },
        data:
          payload.k === "resume"
            ? { resumeExports: { decrement: 1 } }
            : { coverLetterExports: { decrement: 1 } }
      });
    }
    await tx.usageEvent.update({
      where: { id: event.id },
      data: { refundedAt: new Date() }
    });
  });

  const after: Actor = {
    ...actor,
    resumeExports: payload.k === "resume" ? Math.max(0, actor.resumeExports - 1) : actor.resumeExports,
    coverLetterExports:
      payload.k === "cover_letter" ? Math.max(0, actor.coverLetterExports - 1) : actor.coverLetterExports
  };
  return { ok: true, quota: quotaSnapshot(after) };
}
