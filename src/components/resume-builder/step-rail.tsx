"use client";

import { Icon, type IconName } from "@/components/icon";

export type StepStatus = "empty" | "partial" | "complete";

export type StepDef = {
  id: string;
  label: string;
  icon: IconName;
  hint?: string;
};

type StepRailProps = {
  steps: StepDef[];
  activeId: string;
  statuses: Record<string, StepStatus>;
  onSelect: (id: string) => void;
  className?: string;
};

const statusDot: Record<StepStatus, string> = {
  empty: "bg-outline/60 ring-0",
  partial: "bg-warning ring-2 ring-warning/25",
  complete: "bg-success ring-2 ring-success/25"
};

export function StepRail({ steps, activeId, statuses, onSelect, className = "" }: StepRailProps) {
  const completed = steps.filter((s) => statuses[s.id] === "complete").length;
  const total = steps.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <aside className={`flex h-full flex-col gap-4 ${className}`}>
      <div className="px-5 pt-1">
        <div className="flex items-baseline justify-between">
          <p className="font-label text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Progress</p>
          <p className="text-xs font-bold text-ink">{completed}/{total}</p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-outline/30">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Resume sections">
        <ul className="space-y-1">
          {steps.map((step, index) => {
            const status = statuses[step.id] || "empty";
            const isActive = activeId === step.id;
            return (
              <li key={step.id}>
                <button
                  onClick={() => onSelect(step.id)}
                  type="button"
                  className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
                    isActive
                      ? "bg-primary/10 text-primary shadow-ambient ring-1 ring-primary/20"
                      : "text-muted hover:bg-surface-soft hover:text-ink"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-surface text-[16px] ring-1 ring-outline/40">
                    <Icon name={step.icon} className={isActive ? "text-primary" : "text-muted"} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold leading-tight">
                      {step.label}
                    </span>
                    <span className="block text-[11px] font-medium uppercase tracking-wider text-muted/80">
                      Step {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDot[status]}`}
                    aria-label={status}
                    title={status}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

type StepTabsProps = StepRailProps;

/**
 * Horizontal-scroll variant for mobile.
 */
export function StepTabs({ steps, activeId, statuses, onSelect, className = "" }: StepTabsProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="flex gap-2 px-4 py-3">
        {steps.map((step, index) => {
          const status = statuses[step.id] || "empty";
          const isActive = activeId === step.id;
          return (
            <button
              key={step.id}
              onClick={() => onSelect(step.id)}
              type="button"
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition ${
                isActive
                  ? "border-primary bg-primary text-white shadow-ambient"
                  : "border-outline/60 bg-surface text-muted"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="font-mono text-[10px] opacity-70">{String(index + 1).padStart(2, "0")}</span>
              <Icon name={step.icon} className="text-[14px]" />
              {step.label}
              <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white/80" : statusDot[status]}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
