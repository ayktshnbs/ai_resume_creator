/**
 * Resolves the request's "actor" — the entity whose usage we count.
 *
 *   • If a valid NextAuth session is present → "user" actor backed by User row.
 *   • Otherwise → "guest" actor backed by GuestSession (keyed by signed cookie).
 *
 * The same shape lets API routes write uniform logic; only the underlying
 * Prisma table differs.
 */

import { cookies, headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { GUEST_COOKIE } from "@/middleware";
import { mintGuestCookie, readGuestCookie, shortHash } from "./crypto";
import { FREE_TIER, type UsageKind } from "./config";

export type Actor =
  | {
      type: "user";
      id: string;
      isPro: boolean;
      resumeExports: number;
      coverLetterExports: number;
      ipHash: string;
      uaHash: string;
    }
  | {
      type: "guest";
      id: string; // GuestSession.cookieId
      isPro: false;
      resumeExports: number;
      coverLetterExports: number;
      ipHash: string;
      uaHash: string;
      /** Set when the middleware-issued cookie was missing — caller must set it on the response. */
      newCookieValue?: string;
    };

/**
 * Best-effort IP extraction. Trusts standard proxy headers in this order:
 * X-Forwarded-For (first), X-Real-IP, then falls back to a placeholder. The
 * value is immediately hashed, so even if it's spoofed, no PII is stored.
 */
function extractIp(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return h.get("x-real-ip") || "0.0.0.0";
}

export async function resolveActor(): Promise<Actor> {
  const h = await headers();
  const ip = extractIp(h);
  const ua = h.get("user-agent") || "";
  const [ipHash, uaHash] = await Promise.all([shortHash(ip), shortHash(ua)]);

  // 1. Logged-in actor takes priority.
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        plan: true,
        planExpiresAt: true,
        resumeExports: true,
        coverLetterExports: true
      }
    });
    if (user) {
      const isPro =
        user.plan === "pro" &&
        (!user.planExpiresAt || new Date(user.planExpiresAt) > new Date());
      return {
        type: "user",
        id: user.id,
        isPro,
        resumeExports: user.resumeExports,
        coverLetterExports: user.coverLetterExports,
        ipHash,
        uaHash
      };
    }
  }

  // 2. Otherwise: resolve guest by signed cookie. If the cookie is missing or
  //    invalid, mint a replacement value (caller sets it on the response).
  const cookieStore = await cookies();
  const cookieRaw = cookieStore.get(GUEST_COOKIE)?.value;
  let cookieId = await readGuestCookie(cookieRaw);
  let newCookieValue: string | undefined;
  if (!cookieId) {
    cookieId = globalThis.crypto.randomUUID();
    newCookieValue = await mintGuestCookie(cookieId);
  }

  // Upsert keeps lastSeenAt fresh and creates the row on first export attempt.
  const guest = await prisma.guestSession.upsert({
    where: { cookieId },
    create: { cookieId, ipHash, uaHash },
    update: { lastSeenAt: new Date(), ipHash, uaHash }
  });

  return {
    type: "guest",
    id: cookieId,
    isPro: false,
    resumeExports: guest.resumeExports,
    coverLetterExports: guest.coverLetterExports,
    ipHash,
    uaHash,
    newCookieValue
  };
}

/* ─── Quota helpers ──────────────────────────────────────────────────── */

export function usedFor(actor: Actor, kind: UsageKind): number {
  return kind === "resume" ? actor.resumeExports : actor.coverLetterExports;
}

export function limitFor(actor: Actor, kind: UsageKind): number {
  if (actor.isPro) return Number.POSITIVE_INFINITY;
  return FREE_TIER[kind];
}

export function remainingFor(actor: Actor, kind: UsageKind): number {
  return Math.max(0, limitFor(actor, kind) - usedFor(actor, kind));
}

export function quotaSnapshot(actor: Actor) {
  return {
    actor: actor.type,
    isPro: actor.isPro,
    resume: {
      limit: limitFor(actor, "resume"),
      used: usedFor(actor, "resume"),
      remaining: remainingFor(actor, "resume")
    },
    cover_letter: {
      limit: limitFor(actor, "cover_letter"),
      used: usedFor(actor, "cover_letter"),
      remaining: remainingFor(actor, "cover_letter")
    }
  };
}
