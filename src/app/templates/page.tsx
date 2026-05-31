"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-sidebar";
import { Icon } from "@/components/icon";
import { useI18n } from "@/lib/i18n";
import { saveSelectedTemplate } from "@/lib/resume-storage";
import type { SelectedTemplate } from "@/types/resume";
import { PARAMETRIC_CONFIGS } from "@/components/cv-templates/parametric-template";
import { TemplateRenderer } from "@/components/cv-templates/template-renderer";
import { sampleResume } from "@/components/cv-templates/sample-data";
import { cvTemplates, cvTemplateToSelectedTemplate, isPremiumTemplate } from "@/templates/cvTemplates";
import { useUsageQuota } from "@/lib/use-usage-quota";

type TemplateCard = SelectedTemplate & {
  text: string;
  tags: string[];
  category: string;
  premium?: boolean;
};

const handcraftedTemplates: TemplateCard[] = [
  { name: "Modern Minimalist", text: "A clean, single-column design focusing on whitespace and typography.", tags: ["ATS Optimized", "Sans-Serif"], accent: "primary", layout: "single", category: "Single Column" },
  { name: "Professional Serif", text: "Traditional layout with elegant typography for executive and academic roles.", tags: ["Executive", "Serif"], accent: "ink", layout: "classic", category: "Classic" },
  { name: "Creative Tech", text: "Structured two-column layout highlighting technical skills and metrics.", tags: ["Tech Focused", "2-Column"], accent: "secondary", layout: "twoColumn", category: "Two Column" },
  { name: "Lumina Compact", text: "Dense but breathable layout for fitting more content per page.", tags: ["Compact", "Recruiter Ready"], accent: "primaryBright", layout: "compact", category: "Compact" },
  { name: "Startup Operator", text: "Modern SaaS profile built around outcomes and launch metrics.", tags: ["SaaS", "Metrics"], accent: "success", layout: "twoColumn", category: "Two Column" },
  { name: "Graduate Clean", text: "Polished entry-level template with clear visual priority.", tags: ["Entry Level", "Projects"], accent: "warning", layout: "single", category: "Single Column" },
  { name: "Executive Impact", text: "High-end design for senior leadership and board-level roles.", tags: ["Leadership", "Results"], accent: "ink", layout: "classic", category: "Classic" },
  { name: "Academic Classic", text: "Structured for researchers with priority on publications.", tags: ["Research", "Academic"], accent: "primary", layout: "single", category: "Single Column" },
  { name: "Obsidian Dark", text: "Bold dark-themed two-column design for creative professionals.", tags: ["Dark Theme", "Creative"], accent: "secondary", layout: "twoColumn", category: "Two Column" },
  { name: "Helix Modern", text: "Sleek contemporary layout with geometric accent elements.", tags: ["Modern", "Geometric"], accent: "primaryBright", layout: "single", category: "Single Column" },
];

function categoryForStyle(s: string): string {
  switch (s) {
    case "clean": case "split-header": case "minimal-line": case "card-header": return "Single Column";
    case "sidebar-dark": case "sidebar-light": return "Two Column";
    case "centered": return "Classic";
    case "compact-dense": return "Compact";
    case "accent-bar": return "Accent Bar";
    case "band-top": return "Header Band";
    case "timeline": return "Timeline";
    default: return "Other";
  }
}

const parametricCards: TemplateCard[] = PARAMETRIC_CONFIGS.map((c) => ({
  name: c.name,
  text: c.desc,
  tags: c.tags,
  accent: "primary",
  layout: c.pdfLayout,
  themeColor: c.color,
  category: categoryForStyle(c.style),
}));

const registryCards: TemplateCard[] = cvTemplates.map((template) => ({
  ...cvTemplateToSelectedTemplate(template),
  text: template.description,
  tags: [`#${template.id}`, ...template.tags],
  category: template.category,
  premium: isPremiumTemplate(template),
}));

const ALL_TEMPLATES: TemplateCard[] = [...handcraftedTemplates, ...parametricCards, ...registryCards];

const CATEGORIES = ["All", ...Array.from(new Set(ALL_TEMPLATES.map((t) => t.category)))];

const A4_W = 793;

function TemplateCardPreview({ templateName }: { templateName: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / A4_W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative aspect-[1/1.38] overflow-hidden bg-white">
      {scale > 0 && (
        <div
          style={{
            width: A4_W,
            minHeight: Math.round(A4_W * 1.414),
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <TemplateRenderer resume={sampleResume} templateName={templateName} />
        </div>
      )}
    </div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? ALL_TEMPLATES : ALL_TEMPLATES.filter((t) => t.category === filter);
  const { quota } = useUsageQuota();

  function useTemplate(template: TemplateCard) {
    saveSelectedTemplate({
      templateId: template.templateId,
      name: template.name,
      layout: template.layout,
      accent: template.accent,
      themeColor: template.themeColor,
    });
    router.push("/resume");
  }

  return (
    <AppShell active="templates">
      <div className="noise-paper min-h-screen">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-10 md:py-12">

          {/* Editorial masthead */}
          <header className="border-b-[3px] border-ink-deep pb-6">
            <div className="flex items-baseline justify-between border-b border-ink-deep/30 pb-2">
              <p className="font-edit text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-soft">
                The Anthology · Catalogue No. 02
              </p>
              <p className="font-serif text-xs italic text-saffron">{ALL_TEMPLATES.length} typeset templates</p>
            </div>

            <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h1 className="headline-editorial text-[48px] sm:text-[60px] md:text-[80px]">
                  The <em>Anthology</em>.
                </h1>
                <p className="font-serif mt-4 text-[17px] italic leading-snug text-ink-soft">
                  {ALL_TEMPLATES.length} ATS-optimised layouts, each typeset with the same craft as the front page — pick the one
                  that fits the role and we'll wire your data in.
                </p>
              </div>
              <div className="border-2 border-ink-deep bg-paper-soft p-5">
                <p className="font-serif text-sm italic text-saffron">— Editor's note —</p>
                <p className="font-serif mt-1.5 text-[15px] italic leading-snug text-ink-deep">
                  {t("templates.tipText")}
                </p>
              </div>
            </div>
          </header>

          {/* Filter tabs as editorial chips */}
          <div className="mt-8 mb-8 flex flex-wrap gap-0 border-2 border-ink-deep">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex items-baseline gap-2 px-4 py-2.5 font-edit text-[11px] font-bold uppercase tracking-[0.18em] transition ${
                  filter === cat
                    ? "bg-ink-deep text-paper-soft"
                    : "bg-paper-soft text-ink-deep hover:bg-paper-warm"
                } ${i > 0 ? "border-l-2 border-ink-deep" : ""}`}
              >
                {cat}
                <span className={`font-serif text-xs italic normal-case tracking-normal ${filter === cat ? "text-saffron-bright" : "text-saffron"}`}>
                  ({cat === "All" ? ALL_TEMPLATES.length : ALL_TEMPLATES.filter((t) => t.category === cat).length})
                </span>
              </button>
            ))}
          </div>

          {/* Editorial grid of templates */}
          <div className="grid gap-px bg-ink-deep border-2 border-ink-deep sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((template, idx) => (
              <article
                className="group flex cursor-pointer flex-col bg-paper-soft transition hover:bg-paper-warm"
                key={template.name}
                onClick={() => useTemplate(template)}
              >
                <div className="relative border-b-2 border-ink-deep">
                  <TemplateCardPreview templateName={template.name} />
                  <div className="absolute left-3 top-3 font-serif text-xs italic text-saffron">
                    Plate {(idx + 1).toString().padStart(2, "0")}
                  </div>
                  {template.premium && !quota?.isPro && (
                    <span className="absolute right-3 top-3 z-10 border border-saffron bg-paper-soft px-2 py-0.5 font-edit text-[9px] font-bold uppercase tracking-[0.18em] text-saffron">
                      ★ Pro
                    </span>
                  )}
                  <div className="absolute inset-0 flex items-end justify-center bg-ink-deep/0 opacity-0 transition duration-300 group-hover:bg-ink-deep/30 group-hover:opacity-100">
                    <div className="mb-4 inline-flex items-center gap-2 bg-saffron px-4 py-2.5 font-edit text-[11px] font-bold uppercase tracking-[0.18em] text-paper-soft">
                      <Icon name="edit" className="text-[14px]" />
                      {t("templates.useTemplate")} →
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-serif text-xs italic text-saffron">{template.category}</p>
                    <div className="h-3 w-3 rounded-full border border-ink-deep" style={{ backgroundColor: template.themeColor || "#14130f" }} />
                  </div>
                  <h2 className="font-serif mt-1 text-[22px] leading-tight text-ink-deep transition-colors group-hover:text-saffron">
                    {template.name}
                  </h2>
                  <p className="font-serif mt-2 line-clamp-2 text-sm italic leading-snug text-ink-soft">
                    {template.text}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <span
                        className={`border px-2 py-0.5 font-edit text-[9px] font-bold uppercase tracking-[0.18em] ${index === 0 ? "border-saffron text-saffron" : "border-ink-deep/40 text-ink-soft"}`}
                        key={tag}
                      >
                        {tag.replace(/^#/, "")}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-6 border-2 border-ink-deep bg-paper-soft p-10 text-center">
              <p className="font-serif text-sm italic text-saffron">— Empty shelf —</p>
              <h3 className="headline-editorial mt-3 text-3xl">No templates in this category.</h3>
              <p className="font-serif mt-2 italic text-ink-soft">Try the &quot;All&quot; shelf to see every typeset layout.</p>
            </div>
          )}

          <footer className="mt-12 border-t border-ink-deep/30 pt-5">
            <p className="byline text-center">— Hand-set with care · {ALL_TEMPLATES.length} templates total —</p>
          </footer>
        </div>
      </div>
    </AppShell>
  );
}
