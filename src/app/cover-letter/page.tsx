"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/app-sidebar";
import { Icon } from "@/components/icon";
import { useProStatus } from "@/lib/use-pro-status";
import { useI18n } from "@/lib/i18n";
import { loadResumeData } from "@/lib/resume-storage";
import { exportToPdf } from "@/lib/export-utils";
import Link from "next/link";
import { useUsageQuota, type ConsumeFailureReason } from "@/lib/use-usage-quota";
import { PaywallModal } from "@/components/paywall-modal";
import { UsageChip } from "@/components/usage-chip";
import { useToast } from "@/components/toast";

type CoverLetterTemplate = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  style: "modern" | "classic" | "creative" | "minimal" | "bold";
  accentColor: string;
};

const templates: CoverLetterTemplate[] = [
  {
    id: "modern-professional",
    name: "Modern Professional",
    description: "A clean, contemporary layout with a strong header. Ideal for corporate roles, product management, and tech.",
    tags: ["Most Popular", "ATS Friendly"],
    style: "modern",
    accentColor: "#6366f1",
  },
  {
    id: "classic-business",
    name: "Classic Business",
    description: "Traditional business letter format with elegant serif typography. Perfect for law, finance, and executive roles.",
    tags: ["Executive", "Serif"],
    style: "classic",
    accentColor: "#111827",
  },
  {
    id: "creative-standout",
    name: "Creative Standout",
    description: "A bold two-tone design with a sidebar accent. Built for designers, marketers, and creative professionals.",
    tags: ["Creative", "Two-tone"],
    style: "creative",
    accentColor: "#ec4899",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Ultra-clean whitespace layout. Lets your words carry full weight — no distractions, just clarity.",
    tags: ["Minimal", "Clean"],
    style: "minimal",
    accentColor: "#10b981",
  },
  {
    id: "bold-impact",
    name: "Bold Impact",
    description: "A statement header with a strong accent bar. Commands attention from recruiters scanning quickly.",
    tags: ["Leadership", "High Impact"],
    style: "bold",
    accentColor: "#f59e0b",
  },
];

const sampleContent = {
  date: "May 20, 2026",
  role: "Head of Product",
  body: [
    "Dear Sarah,",
    "I am writing to express my strong interest in the Head of Product position at Acme Corp. With seven years of experience leading cross-functional teams and shipping products used by millions, I am excited by the opportunity to scale your platform.",
    "In my current role at TechVenture Inc., I led a team of 12 that delivered a 38% increase in user retention and drove $4M in net new ARR through targeted feature launches. I spearheaded the migration to a modular architecture that cut release cycles by 60%, enabling the team to ship weekly instead of monthly.",
    "I would welcome the opportunity to discuss how my experience in product strategy, data-driven decision making, and team leadership aligns with your roadmap. Thank you for considering my application.",
  ],
};

export default function CoverLetterPage() {
  const { data: session, status } = useSession();
  const { t } = useI18n();
  const { isPro, coverLetterCount } = useProStatus();
  const { toast } = useToast();
  const letterRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [exporting, setExporting] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const { quota, consume, refund } = useUsageQuota();
  const [paywall, setPaywall] = useState<{ open: boolean; reason: ConsumeFailureReason }>({
    open: false,
    reason: "limit_reached"
  });
  const [jobDescription, setJobDescription] = useState("");
  const [showJobInput, setShowJobInput] = useState(false);
  const [letterDate, setLetterDate] = useState(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
  const [letterBody, setLetterBody] = useState(sampleContent.body.join("\n\n"));

  // Load user's resume data to populate cover letter fields. Empty defaults
  // so a brand-new visitor sees blank inputs instead of the "Alexandra Chen"
  // sample. The useEffect below pre-fills from the saved résumé when
  // available; the user can still edit or clear any of these freely.
  const uid = session?.user?.id;
  const [userName, setUserName] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    if (!uid) return;
    const resume = loadResumeData(uid);
    const fullName = `${resume.firstName} ${resume.lastName}`.trim();
    if (fullName) setUserName(fullName);
    if (resume.title) setUserTitle(resume.title);
    if (resume.email) setUserEmail(resume.email);
    if (resume.phone) setUserPhone(resume.phone);
  }, [uid]);

  function getGuestCoverLetterCount(): number {
    if (typeof window === "undefined") return 0;
    try {
      return parseInt(localStorage.getItem("ai-cv-builder.guest-cl-count") || "0", 10);
    } catch { return 0; }
  }

  function incrementGuestCoverLetterCount() {
    if (typeof window === "undefined") return;
    try {
      const c = getGuestCoverLetterCount();
      localStorage.setItem("ai-cv-builder.guest-cl-count", String(c + 1));
    } catch {}
  }

  function selectTemplate(templateId: string) {
    setSelected(templateId);
    setShowUpgrade(false);
    setShowSignIn(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  async function generateCoverLetter(templateId: string) {
    // Generating doesn't burn quota — only the export step does. Anyone can
    // type and tweak; we charge a credit at PDF time.
    setShowUpgrade(false);
    setSelected(templateId);
    setGenerating(true);
    setGeneratedText("");
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);

    try {
      const res = await fetch("/api/ai/resume-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_cover_letter",
          targetRole: sampleContent.role,
          jobDescription: jobDescription.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { resultText?: string };
      const result = data.resultText || "Cover letter generation failed. Please try again.";
      setGeneratedText(result);
      setLetterBody(result);
    } catch {
      const errorText = "An error occurred. Please try again.";
      setGeneratedText(errorText);
      setLetterBody(errorText);
    } finally {
      setGenerating(false);
    }
  }

  async function exportPdf() {
    if (!letterRef.current) return;
    // Server-side debit FIRST. The button is also visually locked when
    // remaining=0, but never trust the UI — the consume API is the gate.
    const debit = await consume("cover_letter");
    if (!debit.ok) {
      const reason = "reason" in debit ? debit.reason : "limit_reached";
      if (reason !== "network_error") {
        setPaywall({ open: true, reason });
      }
      return;
    }
    const token = debit.token;
    setExporting(true);
    try {
      const name = `Cover_Letter_${userName.replace(/\s+/g, "_")}`;
      await exportToPdf(letterRef.current, name);
    } catch {
      await refund(token);
      toast("PDF export failed. Try your browser's Print function instead.", "error");
    } finally {
      setExporting(false);
    }
  }

  const activeTemplate = templates.find((t) => t.id === selected) || templates[0];
  const letterParagraphs = letterBody
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <AppShell active="cover-letter">
      <div className="noise-paper mx-auto w-full max-w-[1400px] px-4 py-8 text-ink-deep md:px-10 md:py-12">{/* Editorial wrapper */}
          {/* Editorial masthead */}
          <header className="border-b-[3px] border-ink-deep pb-6">
            <div className="flex items-baseline justify-between border-b border-ink-deep/30 pb-2">
              <p className="font-edit text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-soft">
                The Correspondence Desk · No. 04
              </p>
              <p className="font-serif text-xs italic text-saffron">{isPro ? "Pro subscriber" : "Free reader"}</p>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-2xl">
                <h1 className="headline-editorial text-[48px] sm:text-[60px] md:text-[80px]">
                  {t("coverLetter.title").split(" ").slice(0, -1).join(" ")}{" "}
                  <em>{t("coverLetter.title").split(" ").slice(-1).join(" ")}</em>.
                </h1>
                <p className="font-serif mt-4 text-[17px] italic leading-snug text-ink-soft">
                  {t("coverLetter.subtitle")}
                </p>
              </div>
              <div className="border-2 border-ink-deep bg-paper-soft p-4">
                <p className="font-serif text-sm italic text-saffron">— {t("coverLetter.aiPowered")} —</p>
                <p className="font-serif mt-1.5 text-sm italic text-ink-deep">
                  {isPro ? t("coverLetter.aiDesc") : t("coverLetter.aiUpgradeDesc")}
                </p>
              </div>
            </div>
          </header>

          {/* Editorial process strip */}
          <ol className="my-8 grid grid-cols-1 gap-0 border-2 border-ink-deep sm:grid-cols-3 sm:divide-x-2 sm:divide-ink-deep">
            <ProcessStep n={1} label="Pick a template" />
            <ProcessStep n={2} label="Add the job description" active={Boolean(jobDescription.trim())} />
            <ProcessStep n={3} label="Edit & export" active={Boolean(generatedText || selected)} />
          </ol>

          {/* Job Description Input — editorial */}
          <div className="mb-10 border-2 border-ink-deep bg-paper-soft p-5">
            <button
              className="flex w-full items-baseline justify-between gap-3 text-left"
              onClick={() => setShowJobInput(!showJobInput)}
              type="button"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-sm italic text-saffron">§ Brief</span>
                <div>
                  <p className="font-serif text-[18px] text-ink-deep">Tailor the letter to a specific job</p>
                  <p className="font-serif mt-0.5 text-xs italic text-ink-soft">
                    {jobDescription.trim()
                      ? `Tailored to ${jobDescription.length} chars of job description`
                      : "Optional — paste the job post for a sharper letter"}
                  </p>
                </div>
              </div>
              <span className={`font-serif text-2xl italic text-saffron transition ${showJobInput ? "rotate-45" : ""}`}>+</span>
            </button>
            {showJobInput && (
              <div className="mt-5">
                <textarea
                  className="w-full min-h-[140px] resize-none border-2 border-ink-deep bg-paper px-4 py-3 font-serif text-[15px] leading-snug text-ink-deep outline-none placeholder:text-ink-quiet/70 focus:border-saffron"
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here — include job title, requirements, responsibilities, and company info for best results..."
                  value={jobDescription}
                />
                {jobDescription.trim() && (
                  <div className="mt-3 flex items-baseline gap-2 font-serif text-xs italic text-moss">
                    <span>✓</span>
                    <span>Job description will tailor the AI-generated copy</span>
                  </div>
                )}
              </div>
            )}
          </div>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <article
              key={template.id}
              className={`card-tilt soft-card group min-w-0 cursor-pointer overflow-hidden rounded-3xl ${
                selected === template.id
                  ? "border-primary ring-2 ring-primary/20"
                  : ""
              }`}
              onClick={() => selectTemplate(template.id)}
            >
              <div className="relative aspect-[1/1.38] w-full min-w-0 overflow-hidden bg-white">
                <LetterCardPreview>
                  <LetterLayout
                    template={template}
                    name={userName}
                    title={userTitle}
                    email={userEmail}
                    phone={userPhone}
                    date={sampleContent.date}
                    body={sampleContent.body}
                  />
                </LetterCardPreview>
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 opacity-0 backdrop-blur-[2px] transition duration-300 group-hover:opacity-100">
                  <button
                    className="btn-glow primary-gradient flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-panel"
                    onClick={(event) => {
                      event.stopPropagation();
                      selectTemplate(template.id);
                    }}
                    type="button"
                  >
                    <Icon name="edit" />
                    {t("coverLetter.useTemplate")}
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="headline-lg text-xl text-ink transition-colors group-hover:text-primary">
                    {template.name}
                  </h2>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: template.accentColor + "18" }}>
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: template.accentColor }} />
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

        {showUpgrade && !isPro && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }} onClick={() => setShowUpgrade(false)}>
            <div className="mx-4 w-full max-w-md overflow-hidden rounded-3xl bg-surface p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
                  <Icon name="sparkle" className="text-[28px] text-white" />
                </div>
                <button
                  className="rounded-xl p-2 text-muted hover:bg-surface-soft"
                  onClick={() => setShowUpgrade(false)}
                  type="button"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <h3 className="text-2xl font-bold text-ink">{t("coverLetter.proFeature")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t("coverLetter.proDesc")}</p>
              <ul className="mt-5 space-y-2.5 text-sm text-muted">
                <li className="flex items-center gap-2"><Icon name="check" className="text-success" /> AI-powered cover letter generation</li>
                <li className="flex items-center gap-2"><Icon name="check" className="text-success" /> Job description matching</li>
                <li className="flex items-center gap-2"><Icon name="check" className="text-success" /> High-res PDF export</li>
                <li className="flex items-center gap-2"><Icon name="check" className="text-success" /> Unlimited documents</li>
              </ul>
              <div className="mt-8 flex gap-3">
                <button
                  className="flex-1 rounded-xl border border-outline/50 bg-surface px-4 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft"
                  onClick={() => setShowUpgrade(false)}
                  type="button"
                >
                  Maybe later
                </button>
                <Link
                  href="/pricing"
                  className="btn-glow badge-shimmer flex-1 primary-gradient rounded-xl px-4 py-3 text-sm font-bold text-white text-center"
                >
                  {t("coverLetter.upgradePro")}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Guest sign-in modal */}
        {showSignIn && !session && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink-deep/40 backdrop-blur-sm" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }} onClick={() => setShowSignIn(false)}>
            <div className="mx-4 w-full max-w-md rounded-3xl border border-outline/30 bg-surface p-8 shadow-panel" onClick={(e) => e.stopPropagation()}>
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon name="sparkle" className="text-[32px]" />
                </div>
              </div>
              <h2 className="mb-2 text-center text-xl font-bold text-ink">{t("gate.signInCover")}</h2>
              <p className="mb-6 text-center text-sm leading-6 text-muted">
                {t("gate.freeTrialUsedCL")}
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/signin"
                  className="flex items-center justify-center rounded-xl primary-gradient px-6 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-110"
                >
                  {t("nav.signIn")}
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center justify-center rounded-xl border border-outline/70 bg-surface px-6 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft"
                >
                  {t("auth.signUpBtn")}
                </Link>
                <button
                  onClick={() => setShowSignIn(false)}
                  className="mt-1 text-sm text-muted transition hover:text-ink"
                >
                  {t("common.close")}
                </button>
              </div>
            </div>
          </div>
        )}

        {(selected || generating || generatedText) && (
          <div
            ref={resultRef}
            className="mt-12 scroll-mt-8 overflow-hidden rounded-3xl border border-outline/30 bg-surface shadow-panel"
          >
            <div className="flex flex-col justify-between gap-4 border-b border-outline/30 bg-surface-soft/70 px-6 py-5 lg:flex-row lg:items-center lg:px-8">
              <div>
                <p className="font-label text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Editor
                </p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink md:text-2xl">
                  {selected ? "Fill in the details" : t("coverLetter.generated")}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Edit the recipient details and letter body. Preview updates as you type.
                </p>
              </div>
              {(selected || generatedText) && (
                <div className="flex flex-wrap items-center gap-2">
                  <UsageChip quota={quota} kind="cover_letter" className="mr-1" />
                  {isPro && (
                    <button
                      className="btn-spring flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-bold text-primary disabled:opacity-50"
                      onClick={() => void generateCoverLetter(selected || templates[0].id)}
                      disabled={generating}
                      type="button"
                    >
                      <Icon name="sparkle" className="text-[14px]" />
                      {generating ? "Drafting…" : "Regenerate with AI"}
                    </button>
                  )}
                  <button
                    className="btn-spring rounded-xl border border-outline/70 bg-surface px-3 py-2 text-xs font-bold text-ink"
                    onClick={() => void navigator.clipboard.writeText(letterBody)}
                    type="button"
                  >
                    {t("coverLetter.copyText")}
                  </button>
                  {(() => {
                    const locked = Boolean(quota && !quota.isPro && quota.cover_letter.remaining <= 0);
                    return (
                      <button
                        className={`btn-glow rounded-xl px-3 py-2 text-xs font-bold text-background transition disabled:opacity-50 ${
                          locked ? "bg-ink/60 ring-2 ring-warning/30 saturate-50" : "bg-ink"
                        }`}
                        disabled={exporting}
                        onClick={() => void exportPdf()}
                        type="button"
                        title={locked ? "Free limit reached — upgrade to continue" : "Export PDF"}
                      >
                        {exporting ? t("resume.exporting") : locked ? "Export PDF · 🔒" : t("resume.exportPdf")}
                      </button>
                    );
                  })()}
                </div>
              )}
            </div>
            <div className="p-6 lg:p-8">
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
              <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
                <div className="min-w-0 space-y-4">
                  <div>
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">From you</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-muted">Your Name</span>
                        <input className="field" onChange={(e) => setUserName(e.target.value)} placeholder="Leave blank to hide" value={userName} />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-muted">Your Title</span>
                        <input className="field" onChange={(e) => setUserTitle(e.target.value)} placeholder="Leave blank to hide" value={userTitle} />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-muted">Email</span>
                        <input className="field" onChange={(e) => setUserEmail(e.target.value)} placeholder="Leave blank to hide" type="email" value={userEmail} />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-muted">Phone</span>
                        <input className="field" onChange={(e) => setUserPhone(e.target.value)} placeholder="Leave blank to hide" type="tel" value={userPhone} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Date</p>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-muted">Letter Date</span>
                      <input className="field" onChange={(e) => setLetterDate(e.target.value)} value={letterDate} />
                    </label>
                    <p className="mt-2 text-xs italic text-muted">Start the body with your own salutation, e.g. <span className="font-semibold">Dear Sarah,</span> or <span className="font-semibold">Sayın Yetkili,</span></p>
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-muted">Letter Body</span>
                    <textarea
                      className="field min-h-[320px] resize-y text-sm leading-6"
                      onChange={(e) => setLetterBody(e.target.value)}
                      value={letterBody}
                    />
                  </label>
                </div>
                <ScaledLetterPreview exportRef={letterRef} overflowing={letterBody.length > 2800}>
                  <LetterLayout
                    template={activeTemplate}
                    name={userName}
                    title={userTitle}
                    email={userEmail}
                    phone={userPhone}
                    date={letterDate}
                    body={letterParagraphs.length > 0 ? letterParagraphs : sampleContent.body}
                  />
                </ScaledLetterPreview>
              </div>
            )}
            </div>
          </div>
        )}
      </div>
      <PaywallModal
        open={paywall.open}
        reason={paywall.reason}
        kind="cover_letter"
        returnPath="/cover-letter"
        onClose={() => setPaywall((p) => ({ ...p, open: false }))}
      />
    </AppShell>
  );
}

function ProcessStep({ n, label, active = false }: { n: number; label: string; active?: boolean }) {
  return (
    <li className={`flex items-baseline gap-3 px-5 py-3.5 transition ${active ? "bg-saffron text-paper-soft" : "bg-paper-soft text-ink-deep"}`}>
      <span className={`font-serif text-lg italic ${active ? "text-paper-soft" : "text-saffron"}`}>
        {n.toString().padStart(2, "0")}
      </span>
      <span className={`font-serif text-[15px] ${active ? "text-paper-soft" : "text-ink-deep"}`}>{label}</span>
    </li>
  );
}

type LetterLayoutProps = {
  template: CoverLetterTemplate;
  name: string;
  title: string;
  email: string;
  phone: string;
  date: string;
  body: string[];
};

function LetterLayout(props: LetterLayoutProps) {
  switch (props.template.style) {
    case "classic": return <ClassicLetter {...props} />;
    case "creative": return <CreativeLetter {...props} />;
    case "minimal": return <MinimalLetter {...props} />;
    case "bold": return <BoldLetter {...props} />;
    default: return <ModernLetter {...props} />;
  }
}

function ModernLetter({ template, name, title, email, phone, date, body }: LetterLayoutProps) {
  return (
    <div style={{ width: 794, height: 1123, overflow: "hidden", background: "#fff", fontFamily: "Inter, Arial, sans-serif" }}>
      <div style={{ background: template.accentColor + "12", padding: "60px 72px 48px" }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a" }}>{name}</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: template.accentColor, marginTop: 6, textTransform: "uppercase", letterSpacing: 1.5 }}>{title}</div>
        <div style={{ display: "flex", gap: 32, marginTop: 24, fontSize: 14, color: "#475569" }}>
          <span>{email}</span>
          <span>{phone}</span>
        </div>
      </div>
      <div style={{ padding: "60px 72px 72px" }}>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 48 }}>{date}</div>
        {body.map((p, i) => (
          <div key={i} style={{ fontSize: 16, color: "#1e293b", lineHeight: 1.7, marginBottom: 24, textAlign: "justify" }}>{p}</div>
        ))}
        <div style={{ marginTop: 60, fontSize: 16, color: "#0f172a", lineHeight: 1.7 }}>
          <div>Sincerely,</div>
          <div style={{ fontWeight: 700, marginTop: 32 }}>{name}</div>
          <div style={{ height: 4, width: 56, background: template.accentColor, borderRadius: 2, marginTop: 12 }} />
        </div>
      </div>
    </div>
  );
}

function ClassicLetter({ template, name, title, email, phone, date, body }: LetterLayoutProps) {
  return (
    <div style={{ width: 794, height: 1123, overflow: "hidden", background: "#fff", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div style={{ textAlign: "center", padding: "64px 84px 44px", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: "#0f172a", letterSpacing: 0.5 }}>{name}</div>
        <div style={{ fontSize: 16, color: "#475569", marginTop: 10 }}>{title}</div>
        <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 10 }}>{email} · {phone}</div>
        <div style={{ height: 3, width: 80, background: template.accentColor, borderRadius: 1, margin: "32px auto 0" }} />
      </div>
      <div style={{ padding: "60px 84px 84px" }}>
        <div style={{ textAlign: "right", fontSize: 13, color: "#64748b", marginBottom: 52 }}>{date}</div>
        {body.map((p, i) => (
          <div key={i} style={{ fontSize: 16, color: "#1e293b", lineHeight: 1.8, marginBottom: 24, textIndent: 36, textAlign: "justify" }}>{p}</div>
        ))}
        <div style={{ marginTop: 60, fontSize: 16, color: "#0f172a", lineHeight: 1.8 }}>
          <div>Yours sincerely,</div>
          <div style={{ fontWeight: 700, marginTop: 44, fontStyle: "italic" }}>{name}</div>
        </div>
      </div>
    </div>
  );
}

function CreativeLetter({ template, name, title, email, phone, date, body }: LetterLayoutProps) {
  return (
    <div style={{ width: 794, height: 1123, overflow: "hidden", background: "#fff", fontFamily: "Inter, Arial, sans-serif", display: "flex" }}>
      <div style={{ width: 14, background: template.accentColor, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: "64px 72px 72px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a" }}>{name}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: template.accentColor, marginTop: 6 }}>{title}</div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 12 }}>{email} · {phone}</div>
          </div>
          <div style={{ background: template.accentColor + "18", borderRadius: 18, padding: "16px 24px", fontSize: 14, fontWeight: 700, color: template.accentColor }}>
            {date}
          </div>
        </div>
        <div style={{ height: 1, background: "#f1f5f9", marginBottom: 48 }} />
        {body.map((p, i) => (
          <div key={i} style={{ fontSize: 16, color: "#1e293b", lineHeight: 1.7, marginBottom: 24, textAlign: "justify" }}>{p}</div>
        ))}
        <div style={{ marginTop: 60, fontSize: 16, color: "#0f172a", lineHeight: 1.7 }}>
          <div>Best regards,</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 36 }}>
            <div style={{ height: 4, width: 44, background: template.accentColor, borderRadius: 2 }} />
            <span style={{ fontWeight: 700 }}>{name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MinimalLetter({ template, name, title, email, phone, date, body }: LetterLayoutProps) {
  return (
    <div style={{ width: 794, height: 1123, overflow: "hidden", background: "#fff", fontFamily: "Inter, Arial, sans-serif" }}>
      <div style={{ padding: "72px 84px 0" }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: "#0f172a", letterSpacing: -0.5 }}>{name}</div>
        <div style={{ fontSize: 16, color: "#64748b", marginTop: 12 }}>{email} · {phone}</div>
        <div style={{ height: 1, background: template.accentColor + "40", marginTop: 36 }} />
      </div>
      <div style={{ padding: "52px 84px 84px" }}>
        <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 52 }}>{date}</div>
        {body.map((p, i) => (
          <div key={i} style={{ fontSize: 16, color: "#1e293b", lineHeight: 1.8, marginBottom: 24, textAlign: "justify" }}>{p}</div>
        ))}
        <div style={{ height: 1, background: template.accentColor + "20", marginTop: 64, marginBottom: 48 }} />
        <div style={{ fontSize: 16, color: "#0f172a", lineHeight: 1.8 }}>
          <div style={{ color: "#94a3b8", fontSize: 13 }}>Sincerely,</div>
          <div style={{ fontWeight: 700, marginTop: 16 }}>{name}</div>
        </div>
      </div>
    </div>
  );
}

function BoldLetter({ template, name, title, email, phone, date, body }: LetterLayoutProps) {
  return (
    <div style={{ width: 794, height: 1123, overflow: "hidden", background: "#fff", fontFamily: "Inter, Arial, sans-serif" }}>
      <div style={{ background: template.accentColor, padding: "60px 72px 48px", color: "#fff" }}>
        <div style={{ fontSize: 36, fontWeight: 800 }}>{name}</div>
        <div style={{ fontSize: 18, opacity: 0.9, marginTop: 6 }}>{title}</div>
        <div style={{ display: "flex", gap: 32, marginTop: 24, fontSize: 14, opacity: 0.8 }}>
          <span>{email}</span>
          <span>{phone}</span>
        </div>
      </div>
      <div style={{ padding: "60px 72px 72px" }}>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 48 }}>{date}</div>
        {body.map((p, i) => (
          <div key={i} style={{ fontSize: 16, color: "#1e293b", lineHeight: 1.7, marginBottom: 24, textAlign: "justify" }}>{p}</div>
        ))}
        <div style={{ marginTop: 60, fontSize: 16, color: "#0f172a", lineHeight: 1.7 }}>
          <div>Sincerely,</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 36 }}>
            <div style={{ height: 4, width: 56, background: template.accentColor, borderRadius: 2 }} />
            <span style={{ fontWeight: 700 }}>{name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const LETTER_W = 794;
const LETTER_H = 1123;

/**
 * Responsive A4 card preview. Measures container width and scales the
 * 794-wide letter to fit exactly — replaces the previous hard-coded
 * `scale(0.48)` which clipped on narrow mobile cards.
 */
function LetterCardPreview({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / LETTER_W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {scale > 0 && (
        <div
          style={{
            width: LETTER_W,
            height: LETTER_H,
            overflow: "hidden",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function ScaledLetterPreview({
  exportRef,
  children,
  overflowing = false,
}: {
  exportRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
  overflowing?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.75);

  // Keep exportRef pointing at the unscaled A4 element so the PDF export
  // can capture it at native size.
  useEffect(() => {
    if (exportRef) {
      (exportRef as React.MutableRefObject<HTMLDivElement | null>).current = innerRef.current;
    }
  });

  useEffect(() => {
    const measure = () => {
      if (wrapRef.current) {
        setScale(Math.min(1, wrapRef.current.clientWidth / LETTER_W));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="mx-auto w-full max-w-[595px]">
      {overflowing && (
        <div className="mb-3 flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning">
          <span aria-hidden className="mt-0.5 shrink-0 text-sm leading-none">⚠</span>
          <span>
            Your letter is longer than one A4 page. Anything past the bottom edge will be clipped in the PDF — trim a sentence or two from the body to fit.
          </span>
        </div>
      )}
      <div
        className="relative overflow-hidden rounded-2xl border border-outline/40 bg-white shadow-panel"
        style={{ width: LETTER_W * scale, height: LETTER_H * scale }}
      >
        <div
          ref={innerRef}
          style={{
            width: LETTER_W,
            height: LETTER_H,
            overflow: "hidden",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            background: "#ffffff"
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
