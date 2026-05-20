"use client";

import { useRef, useState } from "react";
import { AppShell } from "@/components/app-sidebar";
import { Icon } from "@/components/icon";

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
  const [selected, setSelected] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [exporting, setExporting] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  async function generateCoverLetter(templateId: string) {
    setSelected(templateId);
    setGenerating(true);
    setGeneratedText("");

    await new Promise((r) => setTimeout(r, 1200));

    setGeneratedText(
      `Dear ${sampleContent.recipientName},\n\n${sampleContent.body[0]}\n\n${sampleContent.body[1]}\n\n${sampleContent.body[2]}\n\nSincerely,\n${sampleContent.name}`
    );
    setGenerating(false);
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
              <div className="relative aspect-[1/1.3] overflow-hidden bg-white">
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    style={{
                      width: 595,
                      minHeight: 842,
                      transform: "scale(0.42)",
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
                    Use Template
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

        {(generating || generatedText) && (
          <div className="mt-12 rounded-3xl border border-outline/30 bg-white p-8 shadow-panel">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-ink">Generated Cover Letter</h2>
              {generatedText && (
                <div className="flex gap-3">
                  <button
                    className="rounded-xl border border-outline/70 bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-surface-soft"
                    onClick={() => void navigator.clipboard.writeText(generatedText)}
                    type="button"
                  >
                    Copy Text
                  </button>
                  <button
                    className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                    disabled={exporting}
                    onClick={() => void exportPdf()}
                    type="button"
                  >
                    {exporting ? "Exporting..." : "Export PDF"}
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
      <div style={{ background: template.accentColor + "12", padding: "36px 48px 28px" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#141b2b" }}>{name}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: template.accentColor, marginTop: 4, textTransform: "uppercase", letterSpacing: 1.5 }}>{title}</div>
        <div style={{ display: "flex", gap: 24, marginTop: 14, fontSize: 10, color: "#6b7280" }}>
          <span>{email}</span>
          <span>{phone}</span>
        </div>
      </div>
      <div style={{ padding: "32px 48px 48px" }}>
        <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4 }}>{date}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#141b2b" }}>{recipientName}</div>
        <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 28 }}>{recipientTitle}, {company}</div>
        <div style={{ fontSize: 11, color: "#141b2b", lineHeight: 1.85, fontWeight: 600, marginBottom: 20 }}>
          Dear {recipientName},
        </div>
        {body.map((p, i) => (
          <div key={i} style={{ fontSize: 11, color: "#374151", lineHeight: 1.85, marginBottom: 16 }}>{p}</div>
        ))}
        <div style={{ marginTop: 32, fontSize: 11, color: "#141b2b", lineHeight: 1.85 }}>
          <div>Sincerely,</div>
          <div style={{ fontWeight: 700, marginTop: 20 }}>{name}</div>
          <div style={{ height: 3, width: 40, background: template.accentColor, borderRadius: 2, marginTop: 8 }} />
        </div>
      </div>
    </div>
  );
}

function ClassicLetter({ template, name, title, email, phone, date, recipientName, recipientTitle, company, body }: LetterLayoutProps) {
  return (
    <div style={{ width: 595, minHeight: 842, background: "#fff", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div style={{ textAlign: "center", padding: "44px 48px 24px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#141b2b", letterSpacing: 0.5 }}>{name}</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>{title}</div>
        <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>{email} · {phone}</div>
        <div style={{ height: 2, width: 48, background: template.accentColor, borderRadius: 1, margin: "16px auto 0" }} />
      </div>
      <div style={{ padding: "32px 56px 48px" }}>
        <div style={{ textAlign: "right", fontSize: 10, color: "#6b7280", marginBottom: 24 }}>{date}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#141b2b" }}>{recipientName}</div>
        <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 28 }}>{recipientTitle}, {company}</div>
        <div style={{ fontSize: 11, color: "#141b2b", lineHeight: 1.9, marginBottom: 20 }}>
          Dear {recipientName},
        </div>
        {body.map((p, i) => (
          <div key={i} style={{ fontSize: 11, color: "#374151", lineHeight: 1.9, marginBottom: 18, textIndent: 24 }}>{p}</div>
        ))}
        <div style={{ marginTop: 36, fontSize: 11, color: "#141b2b", lineHeight: 1.9 }}>
          <div>Yours sincerely,</div>
          <div style={{ fontWeight: 700, marginTop: 24, fontStyle: "italic" }}>{name}</div>
        </div>
      </div>
    </div>
  );
}

function CreativeLetter({ template, name, title, email, phone, date, recipientName, recipientTitle, company, body }: LetterLayoutProps) {
  return (
    <div style={{ width: 595, minHeight: 842, background: "#fff", fontFamily: "Inter, Arial, sans-serif", display: "flex" }}>
      <div style={{ width: 6, background: template.accentColor, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: "40px 44px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#141b2b" }}>{name}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: template.accentColor, marginTop: 4 }}>{title}</div>
            <div style={{ fontSize: 10, color: "#6b7280", marginTop: 6 }}>{email} · {phone}</div>
          </div>
          <div style={{ background: template.accentColor + "18", borderRadius: 10, padding: "8px 14px", fontSize: 10, fontWeight: 700, color: template.accentColor }}>
            {date}
          </div>
        </div>
        <div style={{ height: 1, background: "#e5e7eb", marginBottom: 24 }} />
        <div style={{ fontSize: 11, fontWeight: 600, color: "#141b2b" }}>{recipientName}</div>
        <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 24 }}>{recipientTitle}, {company}</div>
        <div style={{ fontSize: 11, color: "#141b2b", lineHeight: 1.85, fontWeight: 600, marginBottom: 18 }}>
          Dear {recipientName},
        </div>
        {body.map((p, i) => (
          <div key={i} style={{ fontSize: 11, color: "#374151", lineHeight: 1.85, marginBottom: 16 }}>{p}</div>
        ))}
        <div style={{ marginTop: 32, fontSize: 11, color: "#141b2b", lineHeight: 1.85 }}>
          <div>Best regards,</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20 }}>
            <div style={{ height: 3, width: 24, background: template.accentColor, borderRadius: 2 }} />
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
      <div style={{ padding: "48px 56px 0" }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#141b2b", letterSpacing: -0.5 }}>{name}</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>{email} · {phone}</div>
        <div style={{ height: 1, background: template.accentColor + "60", marginTop: 20 }} />
      </div>
      <div style={{ padding: "28px 56px 48px" }}>
        <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 20 }}>{date}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#141b2b" }}>{recipientName}</div>
        <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 32 }}>{recipientTitle}, {company}</div>
        <div style={{ fontSize: 11, color: "#141b2b", lineHeight: 1.9, marginBottom: 20 }}>
          Dear {recipientName},
        </div>
        {body.map((p, i) => (
          <div key={i} style={{ fontSize: 11, color: "#374151", lineHeight: 1.9, marginBottom: 18 }}>{p}</div>
        ))}
        <div style={{ height: 1, background: template.accentColor + "30", marginTop: 36, marginBottom: 28 }} />
        <div style={{ fontSize: 11, color: "#141b2b", lineHeight: 1.9 }}>
          <div style={{ color: "#9ca3af", fontSize: 10 }}>Sincerely,</div>
          <div style={{ fontWeight: 700, marginTop: 8 }}>{name}</div>
        </div>
      </div>
    </div>
  );
}

function BoldLetter({ template, name, title, email, phone, date, recipientName, recipientTitle, company, body }: LetterLayoutProps) {
  return (
    <div style={{ width: 595, minHeight: 842, background: "#fff", fontFamily: "Inter, Arial, sans-serif" }}>
      <div style={{ background: template.accentColor, padding: "32px 48px 24px", color: "#fff" }}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>{name}</div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{title}</div>
        <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 10, opacity: 0.7 }}>
          <span>{email}</span>
          <span>{phone}</span>
        </div>
      </div>
      <div style={{ padding: "32px 48px 48px" }}>
        <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4 }}>{date}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#141b2b" }}>{recipientName}</div>
        <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 28 }}>{recipientTitle}, {company}</div>
        <div style={{ fontSize: 11, color: "#141b2b", lineHeight: 1.85, fontWeight: 600, marginBottom: 20 }}>
          Dear {recipientName},
        </div>
        {body.map((p, i) => (
          <div key={i} style={{ fontSize: 11, color: "#374151", lineHeight: 1.85, marginBottom: 16 }}>{p}</div>
        ))}
        <div style={{ marginTop: 32, fontSize: 11, color: "#141b2b", lineHeight: 1.85 }}>
          <div>Sincerely,</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20 }}>
            <div style={{ height: 2, width: 32, background: template.accentColor, borderRadius: 2 }} />
            <span style={{ fontWeight: 700 }}>{name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
