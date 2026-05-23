"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/app-sidebar";
import { Icon } from "@/components/icon";
import { useProStatus } from "@/lib/use-pro-status";
import { useI18n } from "@/lib/i18n";
import { PaymentButton } from "@/components/payment-button";
import { loadResumeData } from "@/lib/resume-storage";
import Link from "next/link";

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
  name: "Alexandra Chen",
  title: "Senior Product Manager",
  email: "alex.chen@email.com",
  phone: "+1 (555) 234-5678",
  date: "May 20, 2026",
  company: "Acme Corp",
  recipientName: "Sarah Williams",
  recipientTitle: "VP of Product",
  role: "Head of Product",
  body: [
    "I am writing to express my strong interest in the Head of Product position at Acme Corp. With seven years of experience leading cross-functional teams and shipping products used by millions, I am excited by the opportunity to scale your platform.",
    "In my current role at TechVenture Inc., I led a team of 12 that delivered a 38% increase in user retention and drove $4M in net new ARR through targeted feature launches. I spearheaded the migration to a modular architecture that cut release cycles by 60%, enabling the team to ship weekly instead of monthly.",
    "I would welcome the opportunity to discuss how my experience in product strategy, data-driven decision making, and team leadership aligns with your roadmap. Thank you for considering my application.",
  ],
};

export default function CoverLetterPage() {
  const { data: session, status } = useSession();
  const { t } = useI18n();
  const { isPro, coverLetterCount } = useProStatus();
  const letterRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [exporting, setExporting] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [showJobInput, setShowJobInput] = useState(false);

  // Load user's resume data to populate cover letter fields
  const uid = session?.user?.id;
  const [userName, setUserName] = useState(sampleContent.name);
  const [userTitle, setUserTitle] = useState(sampleContent.title);
  const [userEmail, setUserEmail] = useState(sampleContent.email);
  const [userPhone, setUserPhone] = useState(sampleContent.phone);

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

  async function generateCoverLetter(templateId: string) {
    // Guest: 1 free, then sign-in modal
    if (!session) {
      const guestCount = getGuestCoverLetterCount();
      if (guestCount >= 1) {
        setShowSignIn(true);
        return;
      }
      incrementGuestCoverLetterCount();
    }
    // Logged-in non-Pro: 1 free, then upgrade modal
    if (session && !isPro && coverLetterCount >= 1) {
      setShowUpgrade(true);
      return;
    }
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
      setGeneratedText(data.resultText || "Cover letter generation failed. Please try again.");
    } catch {
      setGeneratedText("An error occurred. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function exportPdf() {
    if (!letterRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(letterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfW = 210;
      const pdfH = (canvas.height * pdfW) / canvas.width;
      const doc = new jsPDF("p", "mm", "a4");
      doc.addImage(imgData, "PNG", 0, 0, pdfW, Math.min(pdfH, 297));
      doc.save(`Cover_Letter_${userName.replace(/\s+/g, "_")}.pdf`);
    } catch {
      alert("PDF export failed. Try using your browser's Print function instead.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <AppShell active="cover-letter">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-10 md:py-12">
        <header className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 w-fit rounded-full border border-outline/70 bg-surface px-3 py-1 font-label text-xs font-bold uppercase tracking-[0.12em] text-primary">
              {t("coverLetter.gallery")}
            </p>
            <h1 className="headline-xl text-4xl text-ink md:text-5xl">
              {t("coverLetter.title")}
            </h1>
            <p className="mt-3 text-lg leading-8 text-muted">
              {t("coverLetter.subtitle")}
            </p>
          </div>
          <div className="soft-card flex items-center gap-3 rounded-2xl px-5 py-4 text-sm">
            <span className="icon-bounce flex h-8 w-8 items-center justify-center rounded-xl bg-success/10 text-success">
              <Icon name="sparkle" />
            </span>
            <span className="leading-6 text-muted">
              <strong className="text-ink">{t("coverLetter.aiPowered")}</strong>{" "}
              {isPro ? t("coverLetter.aiDesc") : t("coverLetter.aiUpgradeDesc")}
            </span>
          </div>
        </header>

        {/* Job Description Input */}
        <div className="mb-10 rounded-2xl border border-outline/30 bg-surface-soft p-6">
          <button
            className="flex w-full items-center justify-between text-left"
            onClick={() => setShowJobInput(!showJobInput)}
            type="button"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name="work" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">Paste a job description for a tailored cover letter</p>
                <p className="mt-0.5 text-xs text-muted">
                  {jobDescription.trim() ? "Job description added — your cover letter will be tailored to it" : "Optional — AI will match your experience to the job requirements"}
                </p>
              </div>
            </div>
            <Icon name={showJobInput ? "close" : "add"} className="text-muted" />
          </button>
          {showJobInput && (
            <div className="mt-5">
              <textarea
                className="field min-h-[140px] resize-none text-sm"
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here — include job title, requirements, responsibilities, and company info for best results..."
                value={jobDescription}
              />
              {jobDescription.trim() && (
                <div className="mt-3 flex items-center gap-2 text-xs text-success">
                  <Icon name="check" className="text-sm" />
                  <span className="font-semibold">Job description will be used to tailor your cover letter</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <article
              key={template.id}
              className={`card-tilt soft-card group cursor-pointer overflow-hidden rounded-3xl ${
                selected === template.id
                  ? "border-primary ring-2 ring-primary/20"
                  : ""
              }`}
              onClick={() => void generateCoverLetter(template.id)}
            >
              <div className="relative aspect-[1/1.38] overflow-hidden bg-white">
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    style={{
                      width: 595,
                      minHeight: 842,
                      transform: "scale(0.64)",
                      transformOrigin: "top left",
                    }}
                  >
                    <LetterLayout
                      template={template}
                      name={userName}
                      title={userTitle}
                      email={userEmail}
                      phone={userPhone}
                      date={sampleContent.date}
                      recipientName={sampleContent.recipientName}
                      recipientTitle={sampleContent.recipientTitle}
                      company={sampleContent.company}
                      body={sampleContent.body}
                    />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 opacity-0 backdrop-blur-[2px] transition duration-300 group-hover:opacity-100">
                  <div className="btn-glow primary-gradient flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-panel">
                    <Icon name="edit" />
                    {t("coverLetter.useTemplate")}
                  </div>
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
                <PaymentButton
                  price="6"
                  className="btn-glow badge-shimmer flex-1 primary-gradient rounded-xl px-4 py-3 text-sm font-bold text-white"
                >
                  {t("coverLetter.upgradePro")}
                </PaymentButton>
              </div>
            </div>
          </div>
        )}

        {/* Guest sign-in modal */}
        {showSignIn && !session && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink/40 backdrop-blur-sm" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }} onClick={() => setShowSignIn(false)}>
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

        {(generating || generatedText) && (
          <div ref={resultRef} className="mt-12 scroll-mt-8 rounded-3xl border border-outline/30 bg-surface p-8 shadow-panel">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="section-title text-2xl font-bold text-ink">{t("coverLetter.generated")}</h2>
              {generatedText && (
                <div className="flex gap-3">
                  <button
                    className="btn-spring rounded-xl border border-outline/70 bg-surface px-4 py-2 text-sm font-bold text-ink"
                    onClick={() => void navigator.clipboard.writeText(generatedText)}
                    type="button"
                  >
                    {t("coverLetter.copyText")}
                  </button>
                  <button
                    className="btn-glow rounded-xl bg-ink px-4 py-2 text-sm font-bold text-background disabled:opacity-50"
                    disabled={exporting}
                    onClick={() => void exportPdf()}
                    type="button"
                  >
                    {exporting ? t("resume.exporting") : t("resume.exportPdf")}
                  </button>
                </div>
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
              <div ref={letterRef} className="mx-auto max-w-[595px]">
                <LetterLayout
                  template={templates.find((t) => t.id === selected) || templates[0]}
                  name={userName}
                  title={userTitle}
                  email={userEmail}
                  phone={userPhone}
                  date={new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  recipientName={sampleContent.recipientName}
                  recipientTitle={sampleContent.recipientTitle}
                  company={sampleContent.company}
                  body={generatedText ? generatedText.split("\n\n").filter(Boolean) : sampleContent.body}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

type LetterLayoutProps = {
  template: CoverLetterTemplate;
  name: string;
  title: string;
  email: string;
  phone: string;
  date: string;
  recipientName: string;
  recipientTitle: string;
  company: string;
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

function ModernLetter({ template, name, title, email, phone, date, recipientName, recipientTitle, company, body }: LetterLayoutProps) {
  return (
    <div style={{ width: 595, minHeight: 842, background: "#fff", fontFamily: "Inter, Arial, sans-serif" }}>
      <div style={{ background: template.accentColor + "12", padding: "40px 52px 32px" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#141b2b" }}>{name}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: template.accentColor, marginTop: 4, textTransform: "uppercase", letterSpacing: 1.5 }}>{title}</div>
        <div style={{ display: "flex", gap: 24, marginTop: 16, fontSize: 11, color: "#6b7280" }}>
          <span>{email}</span>
          <span>{phone}</span>
        </div>
      </div>
      <div style={{ padding: "40px 52px 52px" }}>
        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>{date}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#141b2b" }}>{recipientName}</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 32 }}>{recipientTitle}, {company}</div>
        <div style={{ fontSize: 12, color: "#141b2b", lineHeight: 1.85, fontWeight: 600, marginBottom: 20 }}>
          Dear {recipientName},
        </div>
        {body.map((p, i) => (
          <div key={i} style={{ fontSize: 12, color: "#374151", lineHeight: 1.85, marginBottom: 16, textAlign: "justify" }}>{p}</div>
        ))}
        <div style={{ marginTop: 40, fontSize: 12, color: "#141b2b", lineHeight: 1.85 }}>
          <div>Sincerely,</div>
          <div style={{ fontWeight: 700, marginTop: 24 }}>{name}</div>
          <div style={{ height: 3, width: 44, background: template.accentColor, borderRadius: 2, marginTop: 10 }} />
        </div>
      </div>
    </div>
  );
}

function ClassicLetter({ template, name, title, email, phone, date, recipientName, recipientTitle, company, body }: LetterLayoutProps) {
  return (
    <div style={{ width: 595, minHeight: 842, background: "#fff", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div style={{ textAlign: "center", padding: "48px 56px 28px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#141b2b", letterSpacing: 0.5 }}>{name}</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{title}</div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>{email} · {phone}</div>
        <div style={{ height: 2, width: 56, background: template.accentColor, borderRadius: 1, margin: "20px auto 0" }} />
      </div>
      <div style={{ padding: "40px 64px 52px" }}>
        <div style={{ textAlign: "right", fontSize: 11, color: "#6b7280", marginBottom: 32 }}>{date}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#141b2b" }}>{recipientName}</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 32 }}>{recipientTitle}, {company}</div>
        <div style={{ fontSize: 12, color: "#141b2b", lineHeight: 1.9, marginBottom: 20 }}>
          Dear {recipientName},
        </div>
        {body.map((p, i) => (
          <div key={i} style={{ fontSize: 12, color: "#374151", lineHeight: 1.9, marginBottom: 18, textIndent: 24, textAlign: "justify" }}>{p}</div>
        ))}
        <div style={{ marginTop: 44, fontSize: 12, color: "#141b2b", lineHeight: 1.9 }}>
          <div>Yours sincerely,</div>
          <div style={{ fontWeight: 700, marginTop: 28, fontStyle: "italic" }}>{name}</div>
        </div>
      </div>
    </div>
  );
}

function CreativeLetter({ template, name, title, email, phone, date, recipientName, recipientTitle, company, body }: LetterLayoutProps) {
  return (
    <div style={{ width: 595, minHeight: 842, background: "#fff", fontFamily: "Inter, Arial, sans-serif", display: "flex" }}>
      <div style={{ width: 8, background: template.accentColor, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: "48px 52px 52px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#141b2b" }}>{name}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: template.accentColor, marginTop: 4 }}>{title}</div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 8 }}>{email} · {phone}</div>
          </div>
          <div style={{ background: template.accentColor + "18", borderRadius: 12, padding: "10px 16px", fontSize: 11, fontWeight: 700, color: template.accentColor }}>
            {date}
          </div>
        </div>
        <div style={{ height: 1, background: "#e5e7eb", marginBottom: 32 }} />
        <div style={{ fontSize: 12, fontWeight: 600, color: "#141b2b" }}>{recipientName}</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 32 }}>{recipientTitle}, {company}</div>
        <div style={{ fontSize: 12, color: "#141b2b", lineHeight: 1.85, fontWeight: 600, marginBottom: 20 }}>
          Dear {recipientName},
        </div>
        {body.map((p, i) => (
          <div key={i} style={{ fontSize: 12, color: "#374151", lineHeight: 1.85, marginBottom: 16, textAlign: "justify" }}>{p}</div>
        ))}
        <div style={{ marginTop: 40, fontSize: 12, color: "#141b2b", lineHeight: 1.85 }}>
          <div>Best regards,</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
            <div style={{ height: 3, width: 28, background: template.accentColor, borderRadius: 2 }} />
            <span style={{ fontWeight: 700 }}>{name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MinimalLetter({ template, name, title, email, phone, date, recipientName, recipientTitle, company, body }: LetterLayoutProps) {
  return (
    <div style={{ width: 595, minHeight: 842, background: "#fff", fontFamily: "Inter, Arial, sans-serif" }}>
      <div style={{ padding: "52px 64px 0" }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#141b2b", letterSpacing: -0.5 }}>{name}</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>{email} · {phone}</div>
        <div style={{ height: 1, background: template.accentColor + "60", marginTop: 24 }} />
      </div>
      <div style={{ padding: "36px 64px 52px" }}>
        <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 24 }}>{date}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#141b2b" }}>{recipientName}</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 36 }}>{recipientTitle}, {company}</div>
        <div style={{ fontSize: 12, color: "#141b2b", lineHeight: 1.9, marginBottom: 20 }}>
          Dear {recipientName},
        </div>
        {body.map((p, i) => (
          <div key={i} style={{ fontSize: 12, color: "#374151", lineHeight: 1.9, marginBottom: 18, textAlign: "justify" }}>{p}</div>
        ))}
        <div style={{ height: 1, background: template.accentColor + "30", marginTop: 44, marginBottom: 32 }} />
        <div style={{ fontSize: 12, color: "#141b2b", lineHeight: 1.9 }}>
          <div style={{ color: "#9ca3af", fontSize: 11 }}>Sincerely,</div>
          <div style={{ fontWeight: 700, marginTop: 10 }}>{name}</div>
        </div>
      </div>
    </div>
  );
}

function BoldLetter({ template, name, title, email, phone, date, recipientName, recipientTitle, company, body }: LetterLayoutProps) {
  return (
    <div style={{ width: 595, minHeight: 842, background: "#fff", fontFamily: "Inter, Arial, sans-serif" }}>
      <div style={{ background: template.accentColor, padding: "40px 52px 32px", color: "#fff" }}>
        <div style={{ fontSize: 26, fontWeight: 800 }}>{name}</div>
        <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>{title}</div>
        <div style={{ display: "flex", gap: 24, marginTop: 16, fontSize: 11, opacity: 0.8 }}>
          <span>{email}</span>
          <span>{phone}</span>
        </div>
      </div>
      <div style={{ padding: "40px 52px 52px" }}>
        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>{date}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#141b2b" }}>{recipientName}</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 32 }}>{recipientTitle}, {company}</div>
        <div style={{ fontSize: 12, color: "#141b2b", lineHeight: 1.85, fontWeight: 600, marginBottom: 20 }}>
          Dear {recipientName},
        </div>
        {body.map((p, i) => (
          <div key={i} style={{ fontSize: 12, color: "#374151", lineHeight: 1.85, marginBottom: 16, textAlign: "justify" }}>{p}</div>
        ))}
        <div style={{ marginTop: 40, fontSize: 12, color: "#141b2b", lineHeight: 1.85 }}>
          <div>Sincerely,</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 24 }}>
            <div style={{ height: 3, width: 36, background: template.accentColor, borderRadius: 2 }} />
            <span style={{ fontWeight: 700 }}>{name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
