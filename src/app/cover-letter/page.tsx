"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-sidebar";
import { Icon } from "@/components/icon";

type CoverLetterTemplate = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  style: "modern" | "classic" | "creative" | "minimal" | "bold";
  accentColor: string;
  accentClass: string;
  softAccentClass: string;
};

const templates: CoverLetterTemplate[] = [
  {
    id: "modern-professional",
    name: "Modern Professional",
    description: "A clean, contemporary layout with a strong header. Ideal for corporate roles, product management, and tech.",
    tags: ["Most Popular", "ATS Friendly"],
    style: "modern",
    accentColor: "#6366f1",
    accentClass: "bg-primary",
    softAccentClass: "bg-primary/10",
  },
  {
    id: "classic-business",
    name: "Classic Business",
    description: "Traditional business letter format with elegant serif typography. Perfect for law, finance, and executive roles.",
    tags: ["Executive", "Serif"],
    style: "classic",
    accentColor: "#111827",
    accentClass: "bg-ink",
    softAccentClass: "bg-ink/10",
  },
  {
    id: "creative-standout",
    name: "Creative Standout",
    description: "A bold two-tone design with a sidebar accent. Built for designers, marketers, and creative professionals.",
    tags: ["Creative", "Two-tone"],
    style: "creative",
    accentColor: "#ec4899",
    accentClass: "bg-secondary",
    softAccentClass: "bg-secondary/10",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Ultra-clean whitespace layout. Lets your words carry full weight — no distractions, just clarity.",
    tags: ["Minimal", "Clean"],
    style: "minimal",
    accentColor: "#10b981",
    accentClass: "bg-success",
    softAccentClass: "bg-success/10",
  },
  {
    id: "bold-impact",
    name: "Bold Impact",
    description: "A statement header with a strong accent bar. Commands attention from recruiters scanning quickly.",
    tags: ["Leadership", "High Impact"],
    style: "bold",
    accentColor: "#f59e0b",
    accentClass: "bg-warning",
    softAccentClass: "bg-warning/10",
  },
];

const sampleContent = {
  name: "Alexandra Chen",
  title: "Senior Product Manager",
  email: "alex.chen@email.com",
  date: "May 20, 2026",
  company: "Acme Corp",
  role: "Head of Product",
  body: [
    "I am writing to express my strong interest in the Head of Product position at Acme Corp. With seven years of experience leading cross-functional teams and shipping products used by millions, I am excited by the opportunity to scale your platform.",
    "In my current role, I led a team of 12 that delivered a 38% increase in user retention and drove $4M in net new ARR through targeted feature launches. I believe this same outcome-focused approach will translate directly to the challenges your team is tackling.",
    "I would welcome the opportunity to discuss how my experience aligns with your roadmap.",
  ],
};

export default function CoverLetterPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  async function generateCoverLetter(templateId: string) {
    setSelected(templateId);
    setGenerating(true);
    setGeneratedText("");

    await new Promise((r) => setTimeout(r, 1200));

    setGeneratedText(
      `Dear Hiring Manager,\n\n${sampleContent.body[0]}\n\n${sampleContent.body[1]}\n\n${sampleContent.body[2]}\n\nSincerely,\n${sampleContent.name}`
    );
    setGenerating(false);
  }

  return (
    <AppShell active="cover-letter">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-10 md:py-12">
        <header className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 w-fit rounded-full border border-outline/70 bg-surface px-3 py-1 font-label text-xs font-bold uppercase tracking-[0.12em] text-primary">
              Cover Letter Gallery
            </p>
            <h1 className="text-3xl font-bold tracking-normal text-ink md:text-4xl">
              Cover Letter Templates
            </h1>
            <p className="mt-3 text-lg leading-8 text-muted">
              Choose a professionally designed layout. AI fills it with your resume data — ready to send in seconds.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-outline/50 bg-surface-soft px-5 py-4 text-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-success/10 text-success">
              <Icon name="sparkle" />
            </span>
            <span className="leading-6 text-muted">
              <strong className="text-ink">AI-powered.</strong> Pulls from your saved resume automatically.
            </span>
          </div>
        </header>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <article
              key={template.id}
              className={`group cursor-pointer overflow-hidden rounded-3xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-panel ${
                selected === template.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-outline/30 hover:border-primary/50"
              }`}
              onClick={() => void generateCoverLetter(template.id)}
            >
              <div className="relative aspect-[1/1.2] overflow-hidden bg-gradient-to-b from-surface-soft to-white p-5">
                <CoverLetterPreview template={template} />
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 opacity-0 backdrop-blur-[2px] transition duration-300 group-hover:opacity-100">
                  <div className="primary-gradient flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-panel">
                    <Icon name="edit" />
                    Use Template
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-ink transition-colors group-hover:text-primary">
                      {template.name}
                    </h2>
                  </div>
                  <div className={`h-8 w-8 shrink-0 rounded-xl ${template.softAccentClass} flex items-center justify-center`}>
                    <div className={`h-4 w-4 rounded-full ${template.accentClass}`} />
                  </div>
                </div>
                <p className="min-h-12 text-sm leading-6 text-muted">{template.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {template.tags.map((tag, i) => (
                    <span
                      key={tag}
                      className={`rounded-full px-3 py-1 font-label text-xs font-bold ${i === 0 ? "bg-primary/10 text-primary" : "bg-surface-soft text-muted"}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {(generating || generatedText) && (
          <div className="mt-12 rounded-3xl border border-outline/30 bg-white p-8 shadow-panel">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-ink">Generated Cover Letter</h2>
              {generatedText && (
                <button
                  className="rounded-xl border border-outline/70 bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-surface-soft"
                  onClick={() => {
                    void navigator.clipboard.writeText(generatedText);
                  }}
                  type="button"
                >
                  Copy Text
                </button>
              )}
            </div>
            {generating ? (
              <div className="space-y-3">
                <div className="h-3 w-3/4 animate-pulse rounded bg-outline/30" />
                <div className="h-3 w-full animate-pulse rounded bg-outline/20" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-outline/20" />
                <div className="mt-6 h-3 w-full animate-pulse rounded bg-outline/20" />
                <div className="h-3 w-full animate-pulse rounded bg-outline/20" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-outline/20" />
              </div>
            ) : (
              <div className="mx-auto max-w-2xl">
                <RenderedLetter templateId={selected} text={generatedText} />
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function CoverLetterPreview({ template }: { template: CoverLetterTemplate }) {
  if (template.style === "classic") {
    return <ClassicLetterPreview template={template} />;
  }
  if (template.style === "creative") {
    return <CreativeLetterPreview template={template} />;
  }
  if (template.style === "minimal") {
    return <MinimalLetterPreview template={template} />;
  }
  if (template.style === "bold") {
    return <BoldLetterPreview template={template} />;
  }
  return <ModernLetterPreview template={template} />;
}

function ModernLetterPreview({ template }: { template: CoverLetterTemplate }) {
  return (
    <div className="mx-auto h-full max-w-[300px] rounded-xl bg-white p-5 shadow-ambient ring-1 ring-outline/20">
      <div className={`-mx-5 -mt-5 mb-5 rounded-t-xl ${template.softAccentClass} px-5 py-4`}>
        <div className="mb-1.5 h-3 w-40 rounded bg-ink/80" />
        <div className={`h-1.5 w-28 rounded-full ${template.accentClass}`} />
        <div className="mt-3 flex gap-3">
          <div className="h-1 w-20 rounded bg-outline/30" />
          <div className="h-1 w-16 rounded bg-outline/25" />
        </div>
      </div>
      <div className="mb-3 h-1 w-32 rounded bg-outline/25" />
      <div className="space-y-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-[2px] rounded-full bg-outline/30 ${i === 4 ? "w-4/5" : "w-full"}`} />
        ))}
      </div>
      <div className="my-3 space-y-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-[2px] rounded-full bg-outline/25 ${i === 5 ? "w-3/4" : "w-full"}`} />
        ))}
      </div>
      <div className="space-y-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-[2px] rounded-full bg-outline/25 ${i === 3 ? "w-1/2" : "w-full"}`} />
        ))}
      </div>
      <div className="mt-5">
        <div className="mb-1.5 h-1 w-20 rounded bg-outline/30" />
        <div className={`h-2 w-32 rounded ${template.accentClass} opacity-60`} />
      </div>
    </div>
  );
}

function ClassicLetterPreview({ template }: { template: CoverLetterTemplate }) {
  return (
    <div className="mx-auto h-full max-w-[300px] rounded bg-white px-6 py-5 shadow-ambient ring-1 ring-outline/20">
      <div className="mb-5 border-b border-outline/30 pb-4 text-center">
        <div className="mx-auto mb-2 h-3 w-36 rounded bg-ink/80" />
        <div className="mx-auto mb-2 h-1 w-24 rounded bg-outline/30" />
        <div className={`mx-auto h-0.5 w-16 rounded-full ${template.accentClass}`} />
      </div>
      <div className="mb-3 h-1 w-28 rounded bg-outline/25" />
      <div className="mb-1 h-1 w-24 rounded bg-outline/25" />
      <div className="mt-4 space-y-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-[2px] rounded-full bg-outline/30 ${i === 5 ? "w-4/5" : "w-full"}`} />
        ))}
      </div>
      <div className="my-3 space-y-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-[2px] rounded-full bg-outline/25 ${i === 4 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
      <div className="mt-5 space-y-1.5">
        <div className="h-1 w-16 rounded bg-outline/30" />
        <div className="h-2 w-28 rounded bg-ink/50" />
      </div>
    </div>
  );
}

function CreativeLetterPreview({ template }: { template: CoverLetterTemplate }) {
  return (
    <div className="mx-auto flex h-full max-w-[300px] overflow-hidden rounded-xl shadow-ambient ring-1 ring-outline/20">
      <div className={`w-2 shrink-0 ${template.accentClass}`} />
      <div className="flex-1 bg-white p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-1.5 h-3 w-32 rounded bg-ink/80" />
            <div className={`h-1.5 w-20 rounded-full ${template.accentClass}`} />
          </div>
          <div className={`h-10 w-10 rounded-lg ${template.softAccentClass}`} />
        </div>
        <div className="mb-3 h-px bg-outline/20" />
        <div className="space-y-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-[2px] rounded-full bg-outline/30 ${i === 4 ? "w-4/5" : "w-full"}`} />
          ))}
        </div>
        <div className="my-3 space-y-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-[2px] rounded-full bg-outline/25 ${i === 4 ? "w-2/3" : "w-full"}`} />
          ))}
        </div>
        <div className="space-y-1.5">
          {[1, 2].map((i) => (
            <div key={i} className={`h-[2px] rounded-full bg-outline/20 ${i === 2 ? "w-1/2" : "w-full"}`} />
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2">
          <div className={`h-5 w-5 rounded ${template.softAccentClass}`} />
          <div className="h-2 w-24 rounded bg-ink/50" />
        </div>
      </div>
    </div>
  );
}

function MinimalLetterPreview({ template }: { template: CoverLetterTemplate }) {
  return (
    <div className="mx-auto h-full max-w-[300px] rounded bg-white p-6 shadow-ambient ring-1 ring-outline/20">
      <div className="mb-6">
        <div className="mb-2 h-4 w-36 rounded bg-ink/85" />
        <div className="h-1 w-24 rounded bg-outline/30" />
      </div>
      <div className={`mb-6 h-0.5 w-full rounded-full ${template.accentClass} opacity-40`} />
      <div className="mb-4 h-1 w-28 rounded bg-outline/25" />
      <div className="space-y-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-[2px] rounded-full bg-outline/30 ${i === 5 ? "w-3/4" : "w-full"}`} />
        ))}
      </div>
      <div className="my-4 space-y-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-[2px] rounded-full bg-outline/25 ${i === 4 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
      <div className={`mt-6 h-0.5 w-full rounded-full ${template.accentClass} opacity-20`} />
      <div className="mt-4">
        <div className="mb-1 h-1 w-16 rounded bg-outline/25" />
        <div className="h-2 w-28 rounded bg-ink/50" />
      </div>
    </div>
  );
}

function BoldLetterPreview({ template }: { template: CoverLetterTemplate }) {
  return (
    <div className="mx-auto h-full max-w-[300px] overflow-hidden rounded-xl bg-white shadow-ambient ring-1 ring-outline/20">
      <div className={`${template.accentClass} px-5 py-4`}>
        <div className="mb-1.5 h-3 w-40 rounded bg-white/90" />
        <div className="h-1.5 w-24 rounded-full bg-white/60" />
      </div>
      <div className="p-5">
        <div className="mb-3 h-1 w-32 rounded bg-outline/25" />
        <div className="space-y-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-[2px] rounded-full bg-outline/30 ${i === 4 ? "w-4/5" : "w-full"}`} />
          ))}
        </div>
        <div className="my-3 space-y-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-[2px] rounded-full bg-outline/25 ${i === 4 ? "w-2/3" : "w-full"}`} />
          ))}
        </div>
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-[2px] rounded-full bg-outline/20 ${i === 3 ? "w-1/2" : "w-full"}`} />
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2">
          <div className={`h-0.5 w-8 rounded-full ${template.accentClass}`} />
          <div className="h-2 w-24 rounded bg-ink/50" />
        </div>
      </div>
    </div>
  );
}

function RenderedLetter({ templateId, text }: { templateId: string | null; text: string }) {
  const template = templates.find((t) => t.id === templateId);
  const lines = text.split("\n");

  if (template?.style === "classic") {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-ambient ring-1 ring-outline/20">
        <div className="mb-8 border-b border-outline/30 pb-6 text-center">
          <h2 className="text-2xl font-bold text-ink">{sampleContent.name}</h2>
          <p className="mt-1 text-sm text-muted">{sampleContent.email}</p>
          <div className={`mx-auto mt-3 h-0.5 w-16 rounded-full`} style={{ background: template.accentColor }} />
        </div>
        <div className="space-y-5 text-sm leading-7 text-ink">
          {lines.map((line, i) => (line ? <p key={i}>{line}</p> : null))}
        </div>
      </div>
    );
  }

  if (template?.style === "creative") {
    return (
      <div className="flex overflow-hidden rounded-2xl shadow-ambient ring-1 ring-outline/20">
        <div className="w-2 shrink-0" style={{ background: template.accentColor }} />
        <div className="flex-1 bg-white p-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">{sampleContent.name}</h2>
              <p className="mt-1 font-semibold" style={{ color: template.accentColor }}>
                {sampleContent.title}
              </p>
            </div>
            <div className="rounded-xl px-3 py-1 text-xs font-bold" style={{ background: template.accentColor + "20", color: template.accentColor }}>
              {sampleContent.date}
            </div>
          </div>
          <div className="space-y-5 text-sm leading-7 text-ink">
            {lines.map((line, i) => (line ? <p key={i}>{line}</p> : null))}
          </div>
        </div>
      </div>
    );
  }

  if (template?.style === "bold") {
    return (
      <div className="overflow-hidden rounded-2xl shadow-ambient ring-1 ring-outline/20">
        <div className="px-8 py-5 text-white" style={{ background: template.accentColor }}>
          <h2 className="text-2xl font-bold">{sampleContent.name}</h2>
          <p className="mt-1 text-sm opacity-80">{sampleContent.title}</p>
        </div>
        <div className="bg-white p-8 space-y-5 text-sm leading-7 text-ink">
          {lines.map((line, i) => (line ? <p key={i}>{line}</p> : null))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-ambient ring-1 ring-outline/20">
      <div className="mb-6 rounded-xl p-4" style={{ background: template?.accentColor ? template.accentColor + "15" : "#f3f4f6" }}>
        <h2 className="text-2xl font-bold text-ink">{sampleContent.name}</h2>
        <p className="mt-1 font-semibold" style={{ color: template?.accentColor }}>
          {sampleContent.title}
        </p>
        <p className="mt-1 text-sm text-muted">{sampleContent.email}</p>
      </div>
      <div className="space-y-5 text-sm leading-7 text-ink">
        {lines.map((line, i) => (line ? <p key={i}>{line}</p> : null))}
      </div>
    </div>
  );
}
