"use client";

import { Icon } from "@/components/icon";
import type { Quota, QuotaKind } from "@/lib/use-usage-quota";

type Props = {
  quota: Quota | null;
  kind: QuotaKind;
  className?: string;
};

/**
 * Compact pill that shows the user how many free exports remain.
 * Pro users see "Unlimited" so the upgrade value stays visible after purchase.
 */
export function UsageChip({ quota, kind, className = "" }: Props) {
  if (!quota) return null;
  if (quota.isPro) {
    return (
      <span
        className={`flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-[11px] font-bold text-success ring-1 ring-success/20 ${className}`}
      >
        <Icon name="sparkle" className="text-[12px]" />
        Unlimited
      </span>
    );
  }
  const bucket = kind === "resume" ? quota.resume : quota.cover_letter;
  const remaining = bucket.remaining;
  const tone =
    remaining > 0
      ? "bg-primary/10 text-primary ring-primary/20"
      : "bg-warning/10 text-warning ring-warning/20";
  const label =
    remaining > 0
      ? `${remaining} free ${kind === "resume" ? "resume" : "cover letter"} remaining`
      : `Free limit reached — upgrade to continue`;
  return (
    <span
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${tone} ${className}`}
    >
      <Icon name={remaining > 0 ? "bolt" : "sparkle"} className="text-[12px]" />
      {label}
    </span>
  );
}
