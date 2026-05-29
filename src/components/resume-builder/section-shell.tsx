"use client";

import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icon";

type SectionShellProps = {
  icon: IconName;
  step: number;
  total: number;
  title: string;
  description: string;
  tip?: string;
  aiSlot?: ReactNode;
  children: ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel?: string;
  nextLabel?: string;
};

export function SectionShell({
  icon,
  step,
  total,
  title,
  description,
  tip,
  aiSlot,
  children,
  onPrev,
  onNext,
  prevLabel = "Previous",
  nextLabel = "Next"
}: SectionShellProps) {
  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-outline/30 px-6 pb-5 pt-6 lg:px-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
              Step {String(step).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <h1 className="mt-2 flex items-center gap-3 text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon name={icon} className="text-[22px]" />
              </span>
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>
          </div>
          {aiSlot && <div className="shrink-0">{aiSlot}</div>}
        </div>
        {tip && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-warning/20 bg-warning/5 px-4 py-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
              <Icon name="sparkle" className="text-[14px]" />
            </span>
            <p className="text-[13px] leading-5 text-ink/80">
              <span className="font-bold text-ink">Pro tip · </span>
              {tip}
            </p>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-10">
        <div className="mx-auto max-w-2xl space-y-5 page-enter">{children}</div>
      </div>

      <footer className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-outline/30 bg-surface/95 px-6 py-4 backdrop-blur lg:px-10">
        <button
          type="button"
          onClick={onPrev}
          disabled={!onPrev}
          className="btn-spring flex items-center gap-2 rounded-xl border border-outline/60 bg-surface px-4 py-2.5 text-sm font-bold text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon name="arrowRight" className="rotate-180 text-[16px]" />
          {prevLabel}
        </button>
        <p className="hidden text-xs font-semibold uppercase tracking-wider text-muted sm:block">
          {step} of {total}
        </p>
        <button
          type="button"
          onClick={onNext}
          disabled={!onNext}
          className="btn-glow flex items-center gap-2 rounded-xl primary-gradient px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {nextLabel}
          <Icon name="arrowRight" className="text-[16px]" />
        </button>
      </footer>
    </div>
  );
}
