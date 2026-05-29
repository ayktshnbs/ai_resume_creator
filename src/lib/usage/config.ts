/**
 * Single source of truth for freemium limits.
 * Change these to retune the funnel without touching API logic.
 */

export const FREE_TIER = {
  resume: 1,
  cover_letter: 1
} as const;

export const RATE_LIMITS = {
  /** Per-actor consume attempts within window (catches refresh abuse). */
  perActorWindowSec: 60,
  perActorMaxAttempts: 8,
  /** Per-IP consume attempts within window (catches cookie-clearing abuse). */
  perIpWindowSec: 5 * 60,
  perIpMaxAttempts: 12
} as const;

/** Window during which a successful consume can be reversed via /api/usage/refund. */
export const REFUND_WINDOW_SEC = 60;

/** Single-use export token lifetime. Beyond this, refund is rejected. */
export const EXPORT_TOKEN_TTL_SEC = 90;

export type UsageKind = "resume" | "cover_letter";
export const USAGE_KINDS: readonly UsageKind[] = ["resume", "cover_letter"] as const;
