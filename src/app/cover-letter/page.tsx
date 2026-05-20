"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-sidebar";
import { Icon, type IconName } from "@/components/icon";
import { useSession } from "next-auth/react";
import {
  loadResumeData,
  loadSelectedTemplate,
  loadCoverLetterData,
  saveCoverLetterData,
  loadCoverLetterTemplateId,
  saveCoverLetterTemplateId
} from "@/lib/resume-storage";
import {
  emptyCoverLetterData,
  type CoverLetterData,
  type ResumeData,
  type SelectedTemplate
} from "@/types/resume";

import {
  coverLetterTemplates,
  CoverLetterRenderer,
  suggestLetterFromCvTemplate,
  type CoverLetterTemplateId
} from "@/components/cv-templates/cover-letter-renderer";

type AiAction = "generate" | "shorten" | "expand" | "formal" | "friendly";

const AI_ACTIONS: Array<{
  id: AiAction;
  label: string;
  loadingLabel: string;
  caption: string;
  icon: IconName;
  variant: "primary" | "ghost";
}> = [
  {
    id: "generate",
    label: "Generate letter",
    loadingLabel: "Drafting…",
    caption: "Write a full draft from your CV + target role",
    icon: "sparkle",
    variant: "primary"
  },
  {
    id: "shorten",
    label: "Shorten",
    loadingLabel: "Tightening…",
    caption: "Cut the current letter to one tight page",
    icon: "bolt",
    variant: "ghost"
  },
  {
    id: "expand",
    label: "Add detail",
    loadingLabel: "Expanding…",
    caption: "Add specific examples and metrics from your CV",
    icon: "edit",
    variant: "ghost"
  },
  {
    id: "formal",
    label: "More formal",
    loadingLabel: "Adjusting…",
    caption: "Tighten language for executive / finance audiences",
    icon: "document",
    variant: "ghost"
  },
  {
    id: "friendly",
    label: "More friendly",
    loadingLabel: "Adjusting…",
    caption: "Warmer tone for startups and creative roles",
    icon: "sparkle",
    variant: "ghost"
  }
];

export default function CoverLetterPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [resume, setResume] = useState<ResumeData>(loadResumeData(userId));
  const [coverLetter, setCoverLetter] = useState<CoverLetterData>(emptyCoverLetterData);
  const [cvTemplate, setCvTemplate] = useState<SelectedTemplate>(loadSelectedTemplate(userId));
  const [letterTemplateId, setLetterTemplateId] = useState<CoverLetterTemplateId>("onyx-letter");
  const [loaded, setLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [activeAction, setActiveAction] = useState<AiAction | null>(null);
  const [aiError, setAiError] = useState("");
  const [aiMessage, setAiMessage] = useState("");

  useEffect(() => {
    setIsClient(true);
    if (status === "loading") return;

    const currentResume = loadResumeData(userId);
    const currentTemplate = loadSelectedTemplate(userId);
    const currentLetter = loadCoverLetterData(userId);
    
    setResume(currentResume);
    setCvTemplate(currentTemplate);
    setCoverLetter(currentLetter);
    
    const initial = loadCoverLetterTemplateId(
      suggestLetterFromCvTemplate(currentTemplate.name),
      userId
    ) as CoverLetterTemplateId;
    setLetterTemplateId(initial);
    setLoaded(true);
  }, [userId, status]);

  useEffect(() => {
    if (loaded) saveCoverLetterData(coverLetter, userId);
  }, [loaded, coverLetter, userId]);

  useEffect(() => {
    if (loaded) saveCoverLetterTemplateId(letterTemplateId, userId);
  }, [loaded, letterTemplateId, userId]);

  function updateLetter<K extends keyof CoverLetterData>(key: K, value: CoverLetterData[K]) {
    setCoverLetter((current) => ({ ...current, [key]: value }));
  }

  async function runAi(action: AiAction) {
    setActiveAction(action);
    setAiError("");
    setAiMessage("");

    const targetCompany = coverLetter.recipientCompany || "the company";
    const targetRole = coverLetter.recipientTitle || resume.title || "the role";

    let instruction: string;
    if (action === "generate") {
      instruction = `Write a full 4-paragraph cover letter for ${targetRole} at ${targetCompany}. Use the CV facts; do not invent employers or numbers.`;
    } else if (action === "shorten") {
      instruction = `Shorten this cover letter to fit on one page (3 short paragraphs max) without losing the strongest concrete achievement. Keep voice consistent.\n\nLetter:\n${coverLetter.body || ""}`;
    } else if (action === "expand") {
      instruction = `Expand this cover letter with one extra paragraph that cites a specific, real example from the CV (a role, a metric, a project). Keep tone consistent and do not invent facts.\n\nLetter:\n${coverLetter.body || ""}`;
    } else if (action === "formal") {
      instruction = `Rewrite this cover letter in a more formal, executive register suitable for finance/legal/healthcare. Keep meaning identical.\n\nLetter:\n${coverLetter.body || ""}`;
    } else {
      instruction = `Rewrite this cover letter in a warmer, more conversational tone suitable for startups, design teams, and creative roles. Keep meaning identical.\n\nLetter:\n${coverLetter.body || ""}`;
    }

    try {
      const response = await fetch("/api/ai/resume-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_cover_letter",
          resumeData: resume,
          text: instruction,
          targetRole
        })
      });
      const data = (await response.json()) as { resultText?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "AI request failed.");
      if (data.resultText) {
        updateLetter("body", data.resultText);
        setAiMessage(action === "generate" ? "New draft applied. Edit anything you'd like to tweak." : "Letter updated.");
      } else {
        setAiError("AI returned no text. Try again.");
      }
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setActiveAction(null);
    }
  }

  return (
    <AppShell active="cover-letter" fullHeight>
      <div className="flex h-full flex-col overflow-hidden bg-background md:flex-row">
        <section className="h-full w-full overflow-y-auto border-r border-outline/30 bg-surface p-4 md:w-1/2 md:p-8 lg:w-5/12">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-normal text-ink">Cover Letter</h1>
            <p className="mt-1 text-sm text-muted">Pick a style, fill in the recipient, then let AI draft the body.</p>
          </header>

          <FormSection icon="palette" title="Letter Style">
            <p className="mb-3 text-sm leading-6 text-muted">
              Five distinct concepts. Independent from your CV template — match them or pair them up however you like.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {coverLetterTemplates.map((tpl) => {
                const isActive = tpl.id === letterTemplateId;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setLetterTemplateId(tpl.id)}
                    className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-3 text-left transition ${isActive ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-outline/40 bg-white hover:border-primary/40"}`}
                  >
                    <span className="h-2 w-8 rounded-full" style={{ backgroundColor: tpl.accentColor }} />
                    <span className="text-sm font-bold text-ink">{tpl.name}</span>
                    <span className="font-label text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: tpl.accentColor }}>
                      {tpl.accentLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </FormSection>

          <FormSection icon="analytics" title="AI Helper">
            <p className="mb-3 text-sm leading-6 text-muted">
              All five actions read your CV plus the recipient details. The first one writes a full draft; the others refine whatever&apos;s currently in the body.
            </p>

            {aiError && (
              <p className="mb-4 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-semibold text-error" role="alert">
                {aiError}
              </p>
            )}
            {aiMessage && (
              <p className="mb-4 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
                {aiMessage}
              </p>
            )}

            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {AI_ACTIONS.map((a) => (
                <AiActionButton
                  key={a.id}
                  caption={a.caption}
                  icon={a.icon}
                  label={a.label}
                  loading={activeAction === a.id}
                  loadingLabel={a.loadingLabel}
                  disabled={activeAction !== null || (a.id !== "generate" && !coverLetter.body.trim())}
                  onClick={() => void runAi(a.id)}
                  variant={a.variant}
                />
              ))}
            </div>
          </FormSection>

          <FormSection icon="person" title="Recipient">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Recipient Name" onChange={(v) => updateLetter("recipientName", v)} value={coverLetter.recipientName} />
              <Field label="Recipient Title" onChange={(v) => updateLetter("recipientTitle", v)} value={coverLetter.recipientTitle} />
              <Field label="Company" onChange={(v) => updateLetter("recipientCompany", v)} value={coverLetter.recipientCompany} />
              <Field label="Date" onChange={(v) => updateLetter("date", v)} value={coverLetter.date} />
            </div>
            <div className="mt-4">
              <Field label="Address / Location" onChange={(v) => updateLetter("recipientAddress", v)} value={coverLetter.recipientAddress} />
            </div>
          </FormSection>

          <FormSection icon="document" title="Letter Content">
            <Field label="Subject Line" onChange={(v) => updateLetter("subject", v)} value={coverLetter.subject} />
            <div className="mt-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">Letter Body</span>
                <textarea className="field min-h-[400px] resize-none" onChange={(e) => updateLetter("body", e.target.value)} placeholder="Write a draft here or hit Generate letter above." value={coverLetter.body} />
              </label>
            </div>
          </FormSection>
        </section>

        <section className="hidden h-full flex-1 flex-col bg-surface-soft p-6 md:flex lg:p-8">
          <div className="glass-panel z-10 mx-auto mb-6 flex w-full max-w-4xl items-center justify-between rounded-2xl px-5 py-3 shadow-ambient">
            <Link className="flex items-center gap-2 text-sm font-bold text-muted hover:text-primary" href="/templates">
              <Icon name="palette" />
              <span>{cvTemplate.name} · letter: {coverLetterTemplates.find((t) => t.id === letterTemplateId)?.name}</span>
            </Link>
            <div className="flex gap-3">
              <button className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white shadow-ambient" type="button">
                Export PDF
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-4xl">
              <div className="origin-top scale-[0.4] sm:scale-[0.55] md:scale-[0.75] lg:scale-[0.85] xl:scale-100" style={{ width: "210mm", margin: "0 auto" }}>
                <div className="bg-white shadow-2xl">
                  {isClient && <CoverLetterRenderer coverLetter={coverLetter} resume={resume} templateId={letterTemplateId} />}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function FormSection({ children, icon, title }: { children: React.ReactNode; icon: IconName; title: string }) {
  return (
    <section className="soft-card mb-6 rounded-2xl p-6">
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon name={icon} />
        </div>
        <h2 className="text-xl font-bold text-ink">{title}</h2>
      </header>
      {children}
    </section>
  );
}

function Field({ label, onChange, placeholder, value }: { label: string; onChange: (v: string) => void; placeholder?: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">{label}</span>
      <input className="field" onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type="text" value={value} />
    </label>
  );
}

function AiActionButton({
  caption,
  disabled,
  icon,
  label,
  loading,
  loadingLabel,
  onClick,
  variant
}: {
  caption: string;
  disabled: boolean;
  icon: IconName;
  label: string;
  loading: boolean;
  loadingLabel: string;
  onClick: () => void;
  variant: "primary" | "ghost";
}) {
  const base = "flex h-full flex-col items-start gap-1.5 rounded-xl px-4 py-3 text-left transition disabled:opacity-60";
  const styles = variant === "primary" ? `${base} bg-primary/10 hover:bg-primary/15` : `${base} border border-outline/70 bg-white hover:bg-surface-soft`;
  const labelColor = variant === "primary" ? "text-primary" : "text-ink";

  return (
    <button className={styles} disabled={disabled} onClick={onClick} type="button">
      <span className={`flex items-center gap-2 text-sm font-bold ${labelColor}`}>
        <Icon className="h-4 w-4" name={icon} />
        {loading ? loadingLabel : label}
      </span>
      <span className="text-[11px] leading-snug text-muted">{caption}</span>
    </button>
  );
}
