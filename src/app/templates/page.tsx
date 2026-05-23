"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AppShell } from "@/components/app-sidebar";
import { Icon } from "@/components/icon";
import { useI18n } from "@/lib/i18n";
import { saveSelectedTemplate } from "@/lib/resume-storage";
import type { SelectedTemplate, TemplateLayout } from "@/types/resume";
import { PARAMETRIC_CONFIGS } from "@/components/cv-templates/parametric-template";
import { TemplateRenderer } from "@/components/cv-templates/template-renderer";
import { sampleResume } from "@/components/cv-templates/sample-data";

type TemplateCard = SelectedTemplate & {
  text: string;
  tags: string[];
  category: string;
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

const ALL_TEMPLATES: TemplateCard[] = [...handcraftedTemplates, ...parametricCards];

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
    <div ref={ref} className="relative aspect-[1/1.38] overflow-hidden bg-surface">
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
  const { data: session, status } = useSession();
  const { t } = useI18n();
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? ALL_TEMPLATES : ALL_TEMPLATES.filter((t) => t.category === filter);

  function useTemplate(template: TemplateCard) {
    if (!session) {
      router.push("/signin");
      return;
    }
    saveSelectedTemplate({
      name: template.name,
      layout: template.layout,
      accent: template.accent,
      themeColor: template.themeColor,
    });
    router.push("/resume");
  }

  return (
    <AppShell active="templates">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-10 md:py-12">
        <header className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 w-fit rounded-full border border-outline/70 bg-surface px-3 py-1 font-label text-xs font-bold uppercase tracking-[0.12em] text-primary">
              {t("templates.badge")}
            </p>
            <h1 className="text-3xl font-bold tracking-normal text-ink md:text-4xl">{t("templates.title")}</h1>
            <p className="mt-3 text-lg leading-8 text-muted">
              {ALL_TEMPLATES.length} ATS-optimized layouts designed to highlight your professional story.
            </p>
          </div>
          <div className="rounded-2xl border border-outline/50 bg-surface-soft px-5 py-4 text-sm leading-6 text-muted">
            <strong className="block text-ink">{t("templates.tip")}</strong>
            {t("templates.tipText")}
          </div>
        </header>

        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-soft text-muted hover:bg-surface hover:text-ink"
              }`}
            >
              {cat}
              {cat !== "All" && (
                <span className="ml-1.5 text-xs opacity-60">
                  {ALL_TEMPLATES.filter((t) => t.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((template) => (
            <article
              className="group cursor-pointer overflow-hidden rounded-3xl border border-outline/30 bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-panel"
              key={template.name}
              onClick={() => useTemplate(template)}
            >
              <div className="relative">
                <TemplateCardPreview templateName={template.name} />
                <div className="absolute inset-0 flex items-center justify-center bg-surface/40 opacity-0 backdrop-blur-[2px] transition duration-300 group-hover:opacity-100">
                  <div className="primary-gradient flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-panel transition hover:-translate-y-0.5">
                    <Icon name="edit" />
                    {t("templates.useTemplate")}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-ink transition-colors group-hover:text-primary">{template.name}</h2>
                    <p className="font-label text-xs font-bold uppercase tracking-[0.12em] text-primary">
                      {template.category}
                    </p>
                  </div>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: (template.themeColor || "#6366f1") + "18" }}>
                    <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: template.themeColor || "#6366f1" }} />
                  </div>
                </div>
                <p className="min-h-12 text-sm leading-6 text-muted line-clamp-2">{template.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {template.tags.map((tag, index) => (
                    <span
                      className={`rounded-full px-3 py-1 font-label text-xs font-bold ${index === 0 ? "bg-primary/10 text-primary" : "bg-surface-soft text-muted"}`}
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
