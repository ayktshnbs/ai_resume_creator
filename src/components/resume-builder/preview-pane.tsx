"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { TemplateRenderer } from "@/components/cv-templates/template-renderer";
import { cvLangFlags, cvLangList, cvLangNames } from "@/lib/cv-labels";
import type { ResumeData, SelectedTemplate } from "@/types/resume";

const A4_W = 794;
const A4_H = 1123;

type PreviewPaneProps = {
  resume: ResumeData;
  template: SelectedTemplate;
  onLanguageChange: (lang: string) => void;
  onExport: () => void;
  onShare: () => void;
  exporting: boolean;
  savedState: "saving" | "saved" | "offline";
  /** Slot for the freemium remaining-credits chip + paywall-gated export styling. */
  usageSlot?: ReactNode;
  /** When true, the export button is visually muted to telegraph the paywall. */
  exportLocked?: boolean;
};

export function PreviewPane({
  resume,
  template,
  onLanguageChange,
  onExport,
  onShare,
  exporting,
  savedState,
  usageSlot,
  exportLocked = false
}: PreviewPaneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [zoomMode, setZoomMode] = useState<"fit" | 0.5 | 0.75 | 1>("fit");
  const [fitScale, setFitScale] = useState(0.65);
  const [innerH, setInnerH] = useState(A4_H);

  const scale = zoomMode === "fit" ? fitScale : zoomMode;
  const pageCount = Math.max(1, Math.ceil(innerH / A4_H));

  useEffect(() => {
    const measure = () => {
      if (wrapRef.current) {
        const padding = 48;
        const avail = wrapRef.current.clientWidth - padding;
        setFitScale(Math.min(1, avail / A4_W));
      }
      if (innerRef.current) {
        setInnerH(innerRef.current.scrollHeight);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (innerRef.current) setInnerH(innerRef.current.scrollHeight);
    });
    return () => cancelAnimationFrame(frame);
  }, [resume, template]);

  return (
    <section className="flex h-full flex-col bg-surface-soft">
      <header className="glass-panel z-10 mx-4 mt-4 rounded-2xl px-4 py-3 shadow-ambient">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="flex items-center gap-2 rounded-xl bg-surface px-3 py-1.5 text-xs font-bold text-ink ring-1 ring-outline/40 transition hover:text-primary hover:ring-primary/40"
              href="/templates"
              title="Change template"
            >
              <Icon name="palette" className="text-[14px]" />
              <span className="max-w-[140px] truncate">{template.name}</span>
            </Link>
            <select
              className="rounded-xl border border-outline/40 bg-surface px-2.5 py-1.5 text-xs font-bold text-ink transition hover:border-primary/50 focus:border-primary focus:outline-none"
              value={template.cvLanguage || "en"}
              onChange={(e) => onLanguageChange(e.target.value)}
              title="CV output language"
            >
              {cvLangList.map((lang) => (
                <option key={lang} value={lang}>
                  {cvLangFlags[lang]} {cvLangNames[lang]}
                </option>
              ))}
            </select>
            <SaveBadge state={savedState} />
            {usageSlot}
          </div>

          <div className="flex items-center gap-2">
            <ZoomGroup zoomMode={zoomMode} onChange={setZoomMode} />
            <button
              className="btn-spring rounded-xl border border-outline/50 bg-surface px-3 py-1.5 text-xs font-bold text-ink"
              onClick={onShare}
              type="button"
            >
              <Icon name="visibility" className="text-[14px]" /> Share
            </button>
            <button
              className={`btn-glow rounded-xl px-3 py-1.5 text-xs font-bold text-background transition disabled:opacity-50 ${
                exportLocked ? "bg-ink/60 ring-2 ring-warning/30 saturate-50" : "bg-ink"
              }`}
              disabled={exporting}
              onClick={onExport}
              type="button"
              title={exportLocked ? "Free limit reached — upgrade to continue" : "Export PDF"}
            >
              {exporting ? "Exporting…" : exportLocked ? "Export PDF · 🔒" : "Export PDF"}
            </button>
          </div>
        </div>
      </header>

      <div ref={wrapRef} className="flex-1 overflow-auto px-4 py-6">
        <div className="mx-auto flex flex-col items-center gap-3">
          <div
            className="relative"
            style={{ width: A4_W * scale, height: innerH * scale }}
          >
            <div
              ref={innerRef}
              id="resume-export"
              className="print-area absolute left-0 top-0 origin-top-left rounded-sm bg-white shadow-panel ring-1 ring-outline/30"
              style={{
                width: A4_W,
                minHeight: A4_H,
                transform: `scale(${scale})`,
                transformOrigin: "top left"
              }}
            >
              <TemplateRenderer resume={resume} templateName={template.name} settings={template} />
            </div>
          </div>
          <p className="rounded-full bg-surface px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-muted ring-1 ring-outline/40">
            A4 · {pageCount} {pageCount === 1 ? "page" : "pages"} · {Math.round(scale * 100)}%
          </p>
        </div>
      </div>
    </section>
  );
}

function ZoomGroup({
  zoomMode,
  onChange
}: {
  zoomMode: "fit" | 0.5 | 0.75 | 1;
  onChange: (z: "fit" | 0.5 | 0.75 | 1) => void;
}) {
  const opts: Array<{ value: "fit" | 0.5 | 0.75 | 1; label: string }> = [
    { value: "fit", label: "Fit" },
    { value: 0.5, label: "50%" },
    { value: 0.75, label: "75%" },
    { value: 1, label: "100%" }
  ];
  return (
    <div className="hidden gap-0.5 rounded-xl border border-outline/40 bg-surface p-0.5 lg:flex">
      {opts.map((opt) => (
        <button
          key={opt.label}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-lg px-2 py-1 text-[11px] font-bold transition ${
            zoomMode === opt.value
              ? "bg-ink text-background"
              : "text-muted hover:text-ink"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SaveBadge({ state }: { state: "saving" | "saved" | "offline" }) {
  if (state === "saving") {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-[11px] font-bold text-muted ring-1 ring-outline/40">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warning" />
        Saving…
      </span>
    );
  }
  if (state === "offline") {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-[11px] font-bold text-muted ring-1 ring-outline/40">
        <span className="h-1.5 w-1.5 rounded-full bg-muted" />
        Local only
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success ring-1 ring-success/20">
      <Icon name="check" className="text-[12px]" />
      Saved
    </span>
  );
}
