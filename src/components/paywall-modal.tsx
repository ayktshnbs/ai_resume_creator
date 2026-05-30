"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { PaymentButton } from "@/components/payment-button";
import type { ConsumeFailureReason, QuotaKind } from "@/lib/use-usage-quota";

type PaywallModalProps = {
  open: boolean;
  onClose: () => void;
  reason: ConsumeFailureReason;
  kind: QuotaKind;
  /** Useful so we can deep-link the user back to where they were. */
  returnPath?: string;
};

const KIND_COPY: Record<QuotaKind, { what: string; verb: string }> = {
  resume: { what: "resume", verb: "export" },
  cover_letter: { what: "cover letter", verb: "generate" }
};

export function PaywallModal({ open, onClose, reason, kind, returnPath }: PaywallModalProps) {
  if (!open) return null;
  const copy = KIND_COPY[kind];

  const signInLink = returnPath
    ? `/signin?callbackUrl=${encodeURIComponent(returnPath)}`
    : "/signin";
  const signUpLink = returnPath
    ? `/signup?callbackUrl=${encodeURIComponent(returnPath)}`
    : "/signup";

  const title =
    reason === "needs_signin"
      ? `You've used your free ${copy.what}`
      : reason === "needs_upgrade"
      ? `Upgrade to ${copy.verb} more ${copy.what}s`
      : reason === "template_locked"
      ? "This template is part of Pro"
      : reason === "rate_limited"
      ? "Slow down for a moment"
      : reason === "network_error"
      ? "Couldn't reach the server"
      : "Free limit reached";

  const description =
    reason === "needs_signin"
      ? `Create a free account to keep your draft and unlock the upgrade path.`
      : reason === "needs_upgrade"
      ? `You've used your free ${copy.what} ${copy.verb}. Pro removes the cap and unlocks premium templates.`
      : reason === "template_locked"
      ? `Premium templates (executive and creative tiers) are part of Pro. Pick a free template or upgrade to unlock all 100 designs.`
      : reason === "rate_limited"
      ? `Too many ${copy.verb} attempts in a short window. Wait a minute, then try again.`
      : reason === "network_error"
      ? `We couldn't verify your usage. Check your connection and try again — your draft is saved locally.`
      : `Upgrade to Pro to continue.`;

  const showAuth = reason === "needs_signin";
  const showUpgrade = reason === "needs_upgrade" || reason === "template_locked";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-md overflow-hidden rounded-3xl bg-surface p-8 shadow-2xl page-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
            <Icon name="sparkle" className="text-[28px] text-white" />
          </div>
          <button
            className="rounded-xl p-2 text-muted hover:bg-surface-soft"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h3 id="paywall-title" className="text-2xl font-bold text-ink">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>

        {showUpgrade && (
          <ul className="mt-5 space-y-2.5 text-sm text-muted">
            <li className="flex items-center gap-2">
              <Icon name="check" className="text-success" />
              Unlimited resume &amp; cover letter exports
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" className="text-success" />
              Every premium template unlocked
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" className="text-success" />
              AI optimizer for summaries &amp; bullet points
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" className="text-success" />
              High-resolution PDF export with proper page breaks
            </li>
          </ul>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {showAuth ? (
            <>
              <Link
                href={signInLink}
                className="flex-1 rounded-xl border border-outline/60 bg-surface px-4 py-3 text-center text-sm font-bold text-ink transition hover:bg-surface-soft"
              >
                Sign in
              </Link>
              <Link
                href={signUpLink}
                className="btn-glow primary-gradient flex-1 rounded-xl px-4 py-3 text-center text-sm font-bold text-white shadow-ambient"
              >
                Create free account
              </Link>
            </>
          ) : showUpgrade ? (
            <>
              <button
                className="flex-1 rounded-xl border border-outline/60 bg-surface px-4 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft"
                onClick={onClose}
                type="button"
              >
                Maybe later
              </button>
              <PaymentButton
                price="3"
                className="btn-glow badge-shimmer flex-1 primary-gradient rounded-xl px-4 py-3 text-sm font-bold text-white"
              >
                Upgrade to Pro
              </PaymentButton>
            </>
          ) : (
            <button
              className="flex-1 rounded-xl border border-outline/60 bg-surface px-4 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft"
              onClick={onClose}
              type="button"
            >
              Got it
            </button>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-muted">
          Your draft is saved locally — nothing is lost when you continue.
        </p>
      </div>
    </div>
  );
}
