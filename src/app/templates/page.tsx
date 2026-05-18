"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-sidebar";
import { Icon } from "@/components/icon";
import { saveSelectedTemplate } from "@/lib/resume-storage";
import type { SelectedTemplate, TemplateLayout } from "@/types/resume";

type TemplateVariant = "minimal" | "classic" | "tech" | "compact" | "startup" | "graduate";

type TemplateCard = SelectedTemplate & {
  accentClass: string;
  softAccentClass: string;
  text: string;
  tags: string[];
  variant: TemplateVariant;
};

const templates: TemplateCard[] = [
  {
    name: "Modern Minimalist",
    text: "A clean, single-column design focusing on whitespace and typography. Ideal for crisp, direct communication of skills.",
    tags: ["ATS Optimized", "Sans-Serif"],
    accent: "primary",
    accentClass: "bg-primary",
    softAccentClass: "bg-primary/10",
    layout: "single",
    variant: "minimal"
  },
  {
    name: "Professional Serif",
    text: "Traditional layout with elegant typography. Perfect for executive roles, law, finance, and academia.",
    tags: ["Executive", "Serif"],
    accent: "ink",
    accentClass: "bg-ink",
    softAccentClass: "bg-ink/10",
    layout: "classic",
    variant: "classic"
  },
  {
    name: "Creative Tech",
    text: "A structured two-column layout that highlights technical skills and project metrics with clear hierarchy.",
    tags: ["Tech Focused", "2-Column"],
    accent: "secondary",
    accentClass: "bg-secondary",
    softAccentClass: "bg-secondary/10",
    layout: "twoColumn",
    variant: "tech"
  },
  {
    name: "Lumina Compact",
    text: "A dense but breathable layout for experienced professionals who need more content on one page.",
    tags: ["Compact", "Recruiter Ready"],
    accent: "primaryBright",
    accentClass: "bg-primary-bright",
    softAccentClass: "bg-primary-bright/10",
    layout: "compact",
    variant: "compact"
  },
  {
    name: "Startup Operator",
    text: "A modern SaaS profile built around outcomes, cross-functional ownership, and launch metrics.",
    tags: ["SaaS", "Metrics"],
    accent: "success",
    accentClass: "bg-success",
    softAccentClass: "bg-success/10",
    layout: "twoColumn",
    variant: "startup"
  },
  {
    name: "Graduate Clean",
    text: "A polished entry-level template that gives education, projects, and skills clear visual priority.",
    tags: ["Entry Level", "Projects"],
    accent: "warning",
    accentClass: "bg-warning",
    softAccentClass: "bg-warning/10",
    layout: "single",
    variant: "graduate"
  },
  {
    name: "Executive Impact",
    text: "A high-end design for senior leadership. Focuses on strategic achievements and board-level experience.",
    tags: ["Leadership", "Results"],
    accent: "ink",
    accentClass: "bg-ink",
    softAccentClass: "bg-ink/5",
    layout: "classic",
    variant: "classic"
  },
  {
    name: "Academic Classic",
    text: "Structured for researchers and academics. Prioritizes education, publications, and institutional affiliations.",
    tags: ["Research", "Academic"],
    accent: "primary",
    accentClass: "bg-primary",
    softAccentClass: "bg-primary/5",
    layout: "single",
    variant: "minimal"
  }
];

export default function TemplatesPage() {
  const router = useRouter();

  function useTemplate(template: TemplateCard) {
    saveSelectedTemplate({
      name: template.name,
      layout: template.layout,
      accent: template.accent
    });
    router.push("/resume");
  }

  return (
    <AppShell active="templates">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-10 md:py-12">
        <header className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 w-fit rounded-full border border-outline/70 bg-surface px-3 py-1 font-label text-xs font-bold uppercase tracking-[0.12em] text-primary">
              CV Template Gallery
            </p>
            <h1 className="text-3xl font-bold tracking-normal text-ink md:text-4xl">Choose a Template</h1>
            <p className="mt-3 text-lg leading-8 text-muted">
              Select from ATS-optimized layouts designed to highlight your professional narrative with precision and clarity.
            </p>
          </div>
          <div className="rounded-2xl border border-outline/50 bg-surface-soft px-5 py-4 text-sm leading-6 text-muted">
            <strong className="block text-ink">Tip:</strong>
            Pick a style now. You can still edit your resume content after choosing it.
          </div>
        </header>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <article
              className="group cursor-pointer overflow-hidden rounded-3xl border border-outline/30 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-panel"
              key={template.name}
              onClick={() => useTemplate(template)}
            >
              <div className="relative aspect-[1/1.34] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.08),transparent_40%),linear-gradient(180deg,var(--tw-gradient-stops))] from-surface-soft to-white p-5">
                <TemplatePreview template={template} />
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 opacity-0 backdrop-blur-[2px] transition duration-300 group-hover:opacity-100">
                  <div className="primary-gradient flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-panel transition hover:-translate-y-0.5">
                    <Icon name="edit" />
                    Use Template
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-ink transition-colors group-hover:text-primary">{template.name}</h2>
                    <p className="mt-1 font-label text-xs font-bold uppercase tracking-[0.12em] text-primary">
                      {template.layout === "twoColumn" ? "Two-column layout" : template.layout === "classic" ? "Classic layout" : template.layout === "compact" ? "Compact layout" : "Single-column layout"}
                    </p>
                  </div>
                  <div className={`h-8 w-8 shrink-0 rounded-xl ${template.softAccentClass} flex items-center justify-center`}>
                    <div className={`h-4 w-4 rounded-full ${template.accentClass}`} />
                  </div>
                </div>
                <p className="min-h-16 text-sm leading-6 text-muted">{template.text}</p>
                <div className="mt-5 flex flex-wrap gap-2">
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

function TemplatePreview({ template }: { template: TemplateCard }) {
  const isClassic = template.variant === "classic";
  
  if (isClassic) {
    return <ClassicPreview template={template} />;
  }

  if (template.variant === "tech") {
    return <TechPreview template={template} />;
  }

  if (template.variant === "compact") {
    return <CompactPreview template={template} />;
  }

  if (template.variant === "startup") {
    return <StartupPreview template={template} />;
  }

  if (template.variant === "graduate") {
    return <GraduatePreview template={template} />;
  }

  return <MinimalPreview template={template} />;
}

function MinimalPreview({ template }: { template: TemplateCard }) {
  return (
    <PreviewPaper>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className={`mb-3 h-1.5 w-24 rounded-full ${template.accentClass}`} />
          <div className="mb-2 h-4 w-44 rounded bg-ink/90" />
          <div className="mb-4 h-1.5 w-32 rounded bg-primary/30" />
          <ContactLine />
        </div>
        <div className="h-14 w-14 shrink-0 rounded-xl bg-surface-soft border border-outline/20" />
      </div>
      <div className="mt-4">
        <SectionLabel accentClass={template.accentClass} width="w-20" />
        <PreviewText rows={4} />
      </div>
      <div className="mt-6">
        <SectionLabel accentClass={template.accentClass} width="w-24" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i}>
              <div className="mb-1.5 flex justify-between">
                <div className="h-2 w-32 rounded bg-ink/80" />
                <div className="h-1.5 w-16 rounded bg-outline/40" />
              </div>
              <div className="h-1.5 w-24 rounded bg-outline/30 mb-2" />
              <PreviewText rows={3} />
            </div>
          ))}
        </div>
      </div>
    </PreviewPaper>
  );
}

function ClassicPreview({ template }: { template: TemplateCard }) {
  return (
    <PreviewPaper className="px-7 py-6">
      <div className="mb-6 border-b border-outline/30 pb-5 text-center">
        <div className="mx-auto mb-2 h-5 w-56 rounded bg-ink/90 font-serif" />
        <div className={`mx-auto mb-3 h-0.5 w-24 rounded-full ${template.accentClass}`} />
        <ContactLine centered />
      </div>
      <div className="mb-6">
        <SectionLabel accentClass={template.accentClass} centered serif width="w-28" />
        <div className="mx-auto">
          <PreviewText centered rows={3} />
        </div>
      </div>
      <div className="space-y-5">
        <SectionLabel accentClass={template.accentClass} centered serif width="w-32" />
        {[1, 2, 3].map((i) => (
          <div className="border-l border-outline/20 pl-4" key={i}>
            <div className="mb-1.5 flex justify-between items-center">
              <div className="h-2 w-40 rounded bg-ink/80" />
              <div className="h-1.5 w-20 rounded bg-outline/40" />
            </div>
            <div className="mb-2 h-1.5 w-32 rounded bg-outline/40" />
            <PreviewText rows={3} />
          </div>
        ))}
      </div>
    </PreviewPaper>
  );
}

function TechPreview({ template }: { template: TemplateCard }) {
  return (
    <div className="mx-auto flex h-full max-w-[330px] overflow-hidden rounded-xl bg-white shadow-panel ring-1 ring-outline/30">
      <aside className="w-[32%] bg-ink p-5 text-white">
        <div className={`mb-6 h-14 w-14 rounded-2xl border-2 border-white/20 bg-white/5`} />
        <div className="mb-2 h-3 w-full rounded bg-white/90" />
        <div className="mb-8 h-1.5 w-3/4 rounded bg-white/40" />
        
        <div className="mb-8">
          <div className="mb-4 h-1.5 w-14 rounded bg-white/30" />
          <div className="space-y-2">
            <div className="h-1 w-full rounded bg-white/20" />
            <div className="h-1 w-full rounded bg-white/20" />
            <div className="h-1 w-4/5 rounded bg-white/20" />
          </div>
        </div>
        
        <div>
          <div className="mb-4 h-1.5 w-12 rounded bg-white/30" />
          <div className="flex flex-wrap gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div className={`h-3 rounded-full bg-white/10 ${i % 2 === 0 ? "w-8" : "w-10"}`} key={i} />
            ))}
          </div>
        </div>
      </aside>
      <main className="flex-1 p-5">
        <div className="mb-8">
          <SectionLabel accentClass={template.accentClass} width="w-24" />
          <PreviewText rows={4} />
        </div>
        <div className="space-y-6">
          <SectionLabel accentClass={template.accentClass} width="w-28" />
          {[1, 2].map((i) => (
            <div key={i}>
              <div className="mb-2 flex justify-between">
                <div className="h-2 w-36 rounded bg-ink/80" />
                <div className="h-1.5 w-16 rounded bg-outline/40" />
              </div>
              <div className="mb-3 h-1.5 w-24 rounded bg-primary/30" />
              <PreviewText rows={4} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function CompactPreview({ template }: { template: TemplateCard }) {
  return (
    <PreviewPaper className="p-5">
      <div className="mb-5 flex items-center justify-between border-b border-outline/30 pb-5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 shrink-0 rounded-xl bg-surface-soft border border-outline/20" />
          <div>
            <div className="mb-2 h-4 w-44 rounded bg-ink/90" />
            <div className="h-1.5 w-36 rounded bg-primary/40" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="h-1 w-24 rounded bg-outline/40" />
          <div className="h-1 w-20 rounded bg-outline/40" />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_0.64fr] gap-6">
        <main className="space-y-6">
          <div>
            <SectionLabel accentClass={template.accentClass} width="w-20" />
            <PreviewText rows={3} />
          </div>
          <div className="space-y-5">
            <SectionLabel accentClass={template.accentClass} width="w-28" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="mb-1.5 flex justify-between">
                  <div className="h-1.5 w-28 rounded bg-ink/80" />
                  <div className="h-1 w-12 rounded bg-outline/40" />
                </div>
                <PreviewText rows={2} />
              </div>
            ))}
          </div>
        </main>
        <aside className="space-y-6">
          <div className="rounded-xl bg-surface-soft p-4 border border-outline/10">
            <SectionLabel accentClass={template.accentClass} width="w-16" />
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div className={`h-3 rounded-full ${i % 3 === 0 ? template.accentClass : "bg-white"} ${i % 2 === 0 ? "w-8" : "w-10"}`} key={i} />
              ))}
            </div>
          </div>
          <div>
            <SectionLabel accentClass={template.accentClass} width="w-18" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i}>
                  <div className="mb-1.5 h-1 w-full rounded bg-outline/40" />
                  <div className="h-1 w-4/5 rounded bg-outline/30" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </PreviewPaper>
  );
}

function StartupPreview({ template }: { template: TemplateCard }) {
  return (
    <PreviewPaper className="p-5">
      <div className={`-mx-5 -mt-5 mb-5 rounded-t-xl ${template.softAccentClass} px-5 py-5`}>
        <div className="mb-2 h-4 w-48 rounded bg-ink/90" />
        <div className="mb-3 h-1.5 w-36 rounded bg-outline/50" />
        <div className="grid grid-cols-3 gap-2">
          {["38%", "21%", "12K"].map((item) => (
            <div className="rounded-lg bg-white p-2 shadow-sm border border-outline/10" key={item}>
              <div className={`mb-1 h-1.5 w-10 rounded-full ${template.accentClass}`} />
              <div className="h-1 w-14 rounded bg-outline/30" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-[0.7fr_1fr] gap-5">
        <aside>
          <SectionLabel accentClass={template.accentClass} width="w-20" />
          <SkillPills accentClass={template.accentClass} small />
          <div className="my-4 h-px bg-outline/20" />
          <PreviewText rows={5} />
        </aside>
        <main>
          <SectionLabel accentClass={template.accentClass} width="w-28" />
          {[1, 2].map((i) => (
            <div className="mb-4 rounded-xl border border-outline/10 bg-white p-3 shadow-sm" key={i}>
              <div className="mb-2 flex items-center justify-between">
                <div className={`h-2 w-20 rounded ${template.accentClass}`} />
                <div className="h-1.5 w-10 rounded bg-outline/30" />
              </div>
              <PreviewText rows={3} />
            </div>
          ))}
        </main>
      </div>
    </PreviewPaper>
  );
}

function GraduatePreview({ template }: { template: TemplateCard }) {
  return (
    <PreviewPaper>
      <div className="mb-5 rounded-2xl border border-outline/20 bg-surface-soft p-5">
        <div className="mb-2 h-4 w-48 rounded bg-ink/85" />
        <div className={`mb-3 h-1.5 w-36 rounded-full ${template.accentClass}`} />
        <ContactLine />
      </div>
      <SectionLabel accentClass={template.accentClass} width="w-24" />
      <PreviewText rows={4} />
      <div className="my-5 h-px bg-outline/20" />
      <div className="grid grid-cols-2 gap-6">
        <div>
          <SectionLabel accentClass={template.accentClass} width="w-20" />
          <PreviewText rows={5} />
        </div>
        <div>
          <SectionLabel accentClass={template.accentClass} width="w-20" />
          <SkillPills accentClass={template.accentClass} />
        </div>
      </div>
      <div className="my-5 h-px bg-outline/20" />
      <div className={`rounded-xl border border-outline/20 ${template.softAccentClass} p-4`}>
        <SectionLabel accentClass={template.accentClass} width="w-32" />
        <PreviewText rows={3} />
      </div>
    </PreviewPaper>
  );
}

function PreviewPaper({ children, className = "p-6" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto h-full w-full max-w-[310px] rounded bg-white shadow-ambient ring-1 ring-outline/10 ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ accentClass, centered = false, serif = false, width }: { accentClass: string; centered?: boolean; serif?: boolean; width: string }) {
  return (
    <div className={`mb-3 flex items-center gap-2 ${centered ? "justify-center" : ""}`}>
      <div className={`h-1.5 rounded-full ${accentClass} ${width}`} />
      <div className={`h-1.5 w-10 rounded-full bg-outline/30`} />
    </div>
  );
}

function ContactLine({ centered = false }: { centered?: boolean }) {
  return (
    <div className={`mb-5 flex flex-wrap gap-2 ${centered ? "justify-center" : ""}`}>
      {["w-16", "w-20", "w-14"].map((width) => (
        <div className={`h-1 rounded bg-outline/25 ${width}`} key={width} />
      ))}
    </div>
  );
}

function PreviewText({ rows, centered = false }: { rows: number; centered?: boolean }) {
  return (
    <div className={`space-y-1 ${centered ? "flex flex-col items-center" : ""}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div 
          className={`h-[2px] rounded-full bg-outline/30 ${
            index === rows - 1 ? "w-4/5" : "w-full"
          } ${centered ? "mx-auto" : ""}`} 
          key={index} 
        />
      ))}
    </div>
  );
}

function SkillPills({ accentClass, small = false }: { accentClass: string; small?: boolean }) {
  const widths = small ? ["w-10", "w-12", "w-8", "w-14"] : ["w-14", "w-10", "w-16", "w-12", "w-9"];

  return (
    <div className="flex flex-wrap gap-1.5">
      {widths.map((width, index) => (
        <div className={`h-3 rounded-full ${width} ${index % 2 === 0 ? accentClass : "bg-outline/20 opacity-40"}`} key={`${width}-${index}`} />
      ))}
    </div>
  );
}
