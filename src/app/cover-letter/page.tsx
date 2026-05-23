"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/app-sidebar";
import { Icon } from "@/components/icon";
import { useProStatus } from "@/lib/use-pro-status";
import { useI18n } from "@/lib/i18n";
import { PaymentButton } from "@/components/payment-button";
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
  const [selected, setSelected] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [exporting, setExporting] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [showJobInput, setShowJobInput] = useState(false);

  if (status === "loading") {
    return (
      <AppShell active="cover-letter">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  if (!session) {
    return (
      <AppShell active="cover-letter">
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon name="document" className="text-[32px]" />
          </div>
          <h1 className="text-2xl font-bold text-ink">{t("gate.signInCover")}</h1>
          <p className="max-w-md text-muted">{t("gate.signInCoverDesc")}</p>
          <div className="flex gap-3">
            <Link href="/signin" className="rounded-xl primary-gradient px-6 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-110">{t("nav.signIn")}</Link>
            <Link href="/signup" className="rounded-xl border border-outline/70 bg-surface px-6 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft">{t("auth.signUpBtn")}</Link>
          </div>
        </div>
      </AppShell>
    );
  }
  const letterRef = useRef<HTMLDivElement>(null);
  const { isPro } = useProStatus();

  async function generateCoverLetter(templateId: string) {
    if (!isPro) {
      setShowUpgrade(true);
      return;
    }
    setShowUpgrade(false);
    setSelected(templateId);
    setGenerating(true);
    setGeneratedText("");

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
      doc.save(`Cover_Letter_${sampleContent.name.replace(/\s+/g, "_")}.pdf`);
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
            <h1 className="text-3xl font-bold tracking-normal text-ink md:text-4xl">
              {t("coverLetter.title")}
            </h1>
            <p className="mt-3 text-lg leading-8 text-muted">
              {t("coverLetter.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-outline/50 bg-surface-soft px-5 py-4 text-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-success/10 text-success">
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
              className={`group cursor-pointer overflow-hidden rounded-3xl border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-panel ${
                selected === template.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-outline/30 hover:border-primary/50"
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
                      name={sampleContent.name}
                      title={sampleContent.title}
                      email={sampleContent.email}
                      phone={sampleContent.phone}
                      date={sampleContent.date}
                      recipientName={sampleContent.recipientName}
                      recipientTitle={sampleContent.recipientTitle}
                      company={sampleContent.company}
                      body={sampleContent.body}
                    />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 opacity-0 backdrop-blur-[2px] transition duration-300 group-hover:opacity-100">
                  <div className="primary-gradient flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-panel">
                    <Icon name="edit" />
                    {t("coverLetter.useTemplate")}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold text-ink transition-colors group-hover:text-primary">
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
          <div className="mt-12 flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <Icon className="h-7 w-7 shrink-0 text-primary" name="sparkle" />
            <div className="flex-1">
              <p className="text-lg font-bold text-ink">{t("coverLetter.proFeature")}</p>
              <p className="mt-1 text-sm text-muted">{t("coverLetter.proDesc")}</p>
            </div>
            <PaymentButton
              price="6"
              className="primary-gradient shrink-0 rounded-xl px-6 py-3 text-sm font-bold text-white"
            >
              {t("coverLetter.upgradePro")}
            </PaymentButton>
          </div>
        )}

        {(generating || generatedText) && (
          <div className="mt-12 rounded-3xl border border-outline/30 bg-surface p-8 shadow-panel">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-ink">{t("coverLetter.generated")}</h2>
              {generatedText && (
                <div className="flex gap-3">
                  <button
                    className="rounded-xl border border-outline/70 bg-surface px-4 py-2 text-sm font-bold text-ink hover:bg-surface-soft"
                    onClick={() => void navigator.clipboard.writeText(generatedText)}
                    type="button"
                  >
                    {t("coverLetter.copyText")}
                  </button>
                  {isPro ? (
                    <button
                      className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-background disabled:opacity-50"
                      disabled={exporting}
                      onClick={() => void exportPdf()}
                      type="button"
                    >
                      {exporting ? t("resume.exporting") : t("resume.exportPdf")}
                    </button>
                  ) : (
                    <PaymentButton
                      price="6"
                      className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-background"
                    >
                      {t("resume.exportPdfPro")}
                    </PaymentButton>
                  )}
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
                  name={sampleContent.name}
                  title={sampleContent.title}
                  email={sampleContent.email}
                  phone={sampleContent.phone}
                  date={sampleContent.date}
                  recipientName={sampleContent.recipientName}
                  recipientTitle={sampleContent.recipientTitle}
                  company={sampleContent.company}
                  body={sampleContent.body}
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
