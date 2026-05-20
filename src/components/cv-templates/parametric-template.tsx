import type { ResumeData, SelectedTemplate } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";
import type { ComponentType } from "react";

export type ParametricStyle =
  | "clean"
  | "sidebar-dark"
  | "sidebar-light"
  | "centered"
  | "compact-dense"
  | "accent-bar"
  | "band-top"
  | "timeline";

export type ParametricConfig = {
  name: string;
  style: ParametricStyle;
  pdfLayout: "single" | "twoColumn" | "classic" | "compact";
  color: string;
  sidebarBg?: string;
  sidebarText?: string;
  font: "sans" | "serif" | "mono";
  desc: string;
  tags: string[];
};

type LP = { resume: ResumeData; config: ParametricConfig };

function fc(f: string) {
  return f === "serif" ? "font-serif" : f === "mono" ? "font-mono" : "font-sans";
}
function fn(r: ResumeData) { return getFullName(r) || "Your Name"; }
function gc(r: ResumeData) { return [r.email, r.phone, r.location, r.website].filter(Boolean); }

/* ── Shared Blocks ── */

function Contact({ items, color, centered, light }: { items: string[]; color?: string; centered?: boolean; light?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-x-3 gap-y-1 text-[10px] ${light ? "text-white/70" : "text-[#64748b]"} ${centered ? "justify-center" : ""}`}>
      {items.map((c, i) => (
        <span key={c} className="flex items-center gap-2 min-w-0">
          {i > 0 && <span style={{ color: light ? "rgba(255,255,255,0.3)" : (color || "#cbd5e1") }} className="flex-shrink-0">·</span>}
          <span className="break-all overflow-hidden">{c}</span>
        </span>
      ))}
    </div>
  );
}

function SH({ title, color, centered, underline }: { title: string; color: string; centered?: boolean; underline?: boolean }) {
  return (
    <h2
      className={`mb-2 text-[10px] font-bold uppercase tracking-[0.2em] break-words ${centered ? "text-center" : ""}`}
      style={{ color, borderBottom: underline ? `1px solid ${color}33` : undefined, paddingBottom: underline ? 3 : undefined }}
    >
      {title}
    </h2>
  );
}

function Exp({ experiences, color }: { experiences: ResumeData["experiences"]; color: string }) {
  if (!experiences.length) return <p className="text-[10px] italic text-[#94a3b8]">Experience entries will appear here.</p>;
  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <div key={exp.id}>
          <div className="flex flex-wrap items-start justify-between gap-x-4">
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-[#0f172a] break-words">{exp.role || "Role"}</span>
              <span className="text-[11px] text-[#475569] break-words"> · {exp.company || "Company"}</span>
            </div>
            <span className="shrink-0 text-[9px] text-[#64748b] whitespace-nowrap mt-0.5">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
          </div>
          {exp.location && <p className="mt-0.5 text-[9px] italic text-[#64748b] break-words">{exp.location}</p>}
          <ul className="mt-1.5 space-y-0.5">
            {exp.bullets.filter(Boolean).map((b, i) => (
              <li key={i} className="relative pl-3 text-[10px] leading-[1.55] text-[#1e293b] break-words">
                <span className="absolute left-0 top-[6px] h-1 w-1 rounded-full" style={{ backgroundColor: color }} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function TimelineExp({ experiences, color }: { experiences: ResumeData["experiences"]; color: string }) {
  if (!experiences.length) return <p className="text-[10px] italic text-[#94a3b8]">Experience entries will appear here.</p>;
  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <div key={exp.id} className="relative pl-5">
          <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: color, backgroundColor: "#fff" }} />
          <div className="absolute bottom-0 left-[4.5px] top-5 w-px" style={{ backgroundColor: color + "30" }} />
          <div className="flex flex-wrap items-start justify-between gap-x-4">
            <span className="flex-1 text-[11px] font-bold text-[#0f172a] break-words">{exp.role || "Role"}</span>
            <span className="shrink-0 text-[9px] text-[#64748b] whitespace-nowrap mt-0.5">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
          </div>
          <p className="text-[10px] font-semibold break-words" style={{ color }}>{exp.company || "Company"}{exp.location && <span className="font-normal text-[#64748b]"> · {exp.location}</span>}</p>
          <ul className="mt-1.5 space-y-0.5">
            {exp.bullets.filter(Boolean).map((b, i) => (
              <li key={i} className="relative pl-3 text-[10px] leading-[1.55] text-[#1e293b] break-words">
                <span className="absolute left-0 top-[6px] h-1 w-1 rounded-full" style={{ backgroundColor: color }} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Edu({ education }: { education: ResumeData["education"] }) {
  return (
    <div className="space-y-2">
      {education.map((edu) => (
        <div key={edu.id} className="flex flex-wrap items-start justify-between gap-x-4">
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold text-[#0f172a] break-words">{edu.school || "School"}</span>
            <span className="text-[11px] text-[#475569] break-words"> · {edu.degree || "Degree"}</span>
            {edu.location && <span className="text-[10px] text-[#64748b] break-words"> — {edu.location}</span>}
          </div>
          <span className="shrink-0 text-[9px] text-[#64748b] whitespace-nowrap mt-0.5">{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</span>
        </div>
      ))}
    </div>
  );
}

function EduSidebar({ education, light }: { education: ResumeData["education"]; light?: boolean }) {
  return (
    <div className="space-y-3">
      {education.map((edu) => (
        <div key={edu.id}>
          <p className={`text-[10px] font-bold break-words ${light ? "text-[#0f172a]" : "text-white"}`}>{edu.school || "School"}</p>
          <p className={`text-[9.5px] break-words ${light ? "text-[#475569]" : "text-white/70"}`}>{edu.degree || "Degree"}</p>
          <p className={`text-[8.5px] whitespace-nowrap ${light ? "text-[#94a3b8]" : "text-white/50"}`}>
            {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
          </p>
        </div>
      ))}
    </div>
  );
}

function Skills({ skills, color, inline }: { skills: string[]; color: string; inline?: boolean }) {
  if (inline) return <p className="text-[10px] leading-[1.7] text-[#1e293b] break-words">{skills.join("  ·  ")}</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((s) => (
        <span key={s} className="rounded-full px-2 py-0.5 text-[8.5px] font-semibold break-words" style={{ backgroundColor: color + "15", color }}>{s}</span>
      ))}
    </div>
  );
}

function SkillsSidebar({ skills, light, color }: { skills: string[]; light?: boolean; color: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((s) => (
        <span key={s} className={`rounded-full px-2 py-0.5 text-[8.5px] font-medium break-words ${light ? "" : "text-white"}`}
          style={{ backgroundColor: light ? color + "15" : "rgba(255,255,255,0.1)", color: light ? color : undefined }}
        >{s}</span>
      ))}
    </div>
  );
}

function Langs({ languages }: { languages: string[] }) {
  if (!languages.length) return null;
  return (
    <div className="space-y-1">
      {languages.map((l) => (
        <p key={l} className="text-[9px] text-[#64748b] break-words">{l}</p>
      ))}
    </div>
  );
}

/* ── Page Shell ── */
function Sheet({ font, children }: { font: string; children: React.ReactNode }) {
  return (
    <div className={fc(font) + " text-[#0f172a] overflow-hidden"} style={{ width: "210mm", minHeight: "297mm", padding: "18mm 20mm", backgroundColor: "#fff" }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════
   LAYOUT 1: Clean single-column
   ══════════════════════════════════════ */
function CleanLayout({ resume: r, config: c }: LP) {
  const contact = gc(r);
  return (
    <Sheet font={c.font}>
      <header className="mb-7">
        <h1 className="text-[32px] font-bold leading-none tracking-tight">{fn(r)}</h1>
        <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: c.color }}>{r.title || "Professional Title"}</p>
        <div className="mt-3 h-px w-full" style={{ backgroundColor: c.color }} />
        <div className="mt-3"><Contact items={contact} color={c.color} /></div>
      </header>
      {r.summary && <section className="mt-5"><SH title="Summary" color={c.color} /><p className="text-[10px] leading-[1.65] text-[#1e293b]">{r.summary}</p></section>}
      <section className="mt-5"><SH title="Experience" color={c.color} /><Exp experiences={r.experiences} color={c.color} /></section>
      {r.education.length > 0 && <section className="mt-5"><SH title="Education" color={c.color} /><Edu education={r.education} /></section>}
      {r.skills.length > 0 && <section className="mt-5"><SH title="Skills" color={c.color} /><Skills skills={r.skills} color={c.color} /></section>}
      {r.languages.length > 0 && <section className="mt-5"><SH title="Languages" color={c.color} /><Langs languages={r.languages} /></section>}
    </Sheet>
  );
}

/* ══════════════════════════════════════
   LAYOUT 2: Dark sidebar
   ══════════════════════════════════════ */
function SidebarDarkLayout({ resume: r, config: c }: LP) {
  const bg = c.sidebarBg || "#0f172a";
  const contact = gc(r);
  return (
    <div className={fc(c.font) + " overflow-hidden"} style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#fff", display: "flex" }}>
      <aside style={{ width: "72mm", backgroundColor: bg, color: "#fff", padding: "20mm 12mm" }} className="flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-[24px] font-extrabold leading-[1.05] tracking-tight text-white break-words">{fn(r)}</h1>
          <div className="mt-2 h-[3px] w-10" style={{ backgroundColor: c.color }} />
          <p className="mt-3 text-[10.5px] font-medium uppercase tracking-[0.14em] break-words" style={{ color: c.color + "cc" }}>{r.title || "Professional Title"}</p>
        </div>
        {contact.length > 0 && (
          <div className="mb-6">
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.16em] text-white/50">Contact</p>
            <div className="h-px w-full bg-white/10 mb-2" />
            <div className="space-y-1.5">{contact.map((c) => <p key={c} className="break-words text-[9.5px] text-white/80">{c}</p>)}</div>
          </div>
        )}
        {r.skills.length > 0 && (
          <div className="mb-6">
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.16em] text-white/50">Skills</p>
            <div className="h-px w-full bg-white/10 mb-2" />
            <SkillsSidebar skills={r.skills} color={c.color} />
          </div>
        )}
        {r.education.length > 0 && (
          <div className="mb-6">
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.16em] text-white/50">Education</p>
            <div className="h-px w-full bg-white/10 mb-2" />
            <EduSidebar education={r.education} />
          </div>
        )}
        {r.languages.length > 0 && (
          <div>
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.16em] text-white/50">Languages</p>
            <div className="h-px w-full bg-white/10 mb-2" />
            <div className="space-y-1">{r.languages.map((l) => <p key={l} className="text-[9px] text-white/70">{l}</p>)}</div>
          </div>
        )}
      </aside>
      <main style={{ flex: 1, padding: "20mm 18mm" }} className="min-w-0">
        {r.summary && <section className="mb-6"><SH title="Profile" color={c.color} /><div className="mb-3 h-[2px] w-8" style={{ backgroundColor: c.color }} /><p className="text-[10px] leading-[1.65] text-[#1e293b] break-words">{r.summary}</p></section>}
        <section className="mb-6">
          <SH title="Experience" color={c.color} />
          <div className="mb-3 h-[2px] w-8" style={{ backgroundColor: c.color }} />
          <Exp experiences={r.experiences} color={c.color} />
        </section>
      </main>
    </div>
  );
}

/* ══════════════════════════════════════
   LAYOUT 3: Light sidebar
   ══════════════════════════════════════ */
function SidebarLightLayout({ resume: r, config: c }: LP) {
  const bg = c.sidebarBg || "#f1f5f9";
  const contact = gc(r);
  return (
    <div className={fc(c.font) + " overflow-hidden"} style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#fff", display: "flex" }}>
      <aside style={{ width: "72mm", backgroundColor: bg, padding: "20mm 12mm" }} className="flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-[22px] font-extrabold leading-[1.05] tracking-tight text-[#0f172a] break-words">{fn(r)}</h1>
          <div className="mt-2 h-[2px] w-10" style={{ backgroundColor: c.color }} />
          <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] break-words" style={{ color: c.color }}>{r.title || "Professional Title"}</p>
        </div>
        {contact.length > 0 && (
          <div className="mb-5">
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.16em]" style={{ color: c.color }}>Contact</p>
            <div className="space-y-1.5">{contact.map((ct) => <p key={ct} className="break-words text-[9.5px] text-[#475569]">{ct}</p>)}</div>
          </div>
        )}
        {r.skills.length > 0 && (
          <div className="mb-5">
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.16em]" style={{ color: c.color }}>Skills</p>
            <SkillsSidebar skills={r.skills} light color={c.color} />
          </div>
        )}
        {r.education.length > 0 && (
          <div className="mb-5">
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.16em]" style={{ color: c.color }}>Education</p>
            <EduSidebar education={r.education} light />
          </div>
        )}
        {r.languages.length > 0 && (
          <div>
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.16em]" style={{ color: c.color }}>Languages</p>
            <div className="space-y-1">{r.languages.map((l) => <p key={l} className="text-[9px] text-[#64748b] break-words">{l}</p>)}</div>
          </div>
        )}
      </aside>
      <main style={{ flex: 1, padding: "20mm 18mm" }} className="min-w-0">
        {r.summary && <section className="mb-6"><SH title="Summary" color={c.color} /><p className="text-[10px] leading-[1.65] text-[#1e293b] break-words">{r.summary}</p></section>}
        <section className="mb-6"><SH title="Experience" color={c.color} /><Exp experiences={r.experiences} color={c.color} /></section>
      </main>
    </div>
  );
}

/* ══════════════════════════════════════
   LAYOUT 4: Centered classic
   ══════════════════════════════════════ */
function CenteredLayout({ resume: r, config: c }: LP) {
  const contact = gc(r);
  return (
    <Sheet font={c.font}>
      <header className="mb-7 border-b pb-5 text-center" style={{ borderColor: "#e2e8f0" }}>
        <h1 className="text-[28px] font-bold leading-none break-words">{fn(r)}</h1>
        <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.16em] break-words" style={{ color: c.color }}>{r.title || "Professional Title"}</p>
        <div className="mx-auto mt-2 h-[2px] w-14" style={{ backgroundColor: c.color }} />
        <div className="mt-3"><Contact items={contact} color={c.color} centered /></div>
      </header>
      {r.summary && <section className="mt-5"><SH title="Profile" color={c.color} centered /><p className="text-[10px] leading-[1.7] text-[#1e293b] break-words" style={{ textAlign: "justify" }}>{r.summary}</p></section>}
      <section className="mt-5"><SH title="Experience" color={c.color} centered /><Exp experiences={r.experiences} color={c.color} /></section>
      {r.education.length > 0 && <section className="mt-5"><SH title="Education" color={c.color} centered /><Edu education={r.education} /></section>}
      {r.skills.length > 0 && <section className="mt-5"><SH title="Skills" color={c.color} centered /><Skills skills={r.skills} color={c.color} inline /></section>}
    </Sheet>
  );
}

/* ══════════════════════════════════════
   LAYOUT 5: Compact dense
   ══════════════════════════════════════ */
function CompactLayout({ resume: r, config: c }: LP) {
  const contact = gc(r);
  return (
    <div className={fc(c.font) + " text-[#0f172a] overflow-hidden"} style={{ width: "210mm", minHeight: "297mm", padding: "14mm 16mm", backgroundColor: "#fff" }}>
      <header className="mb-4 flex items-center justify-between border-b pb-4" style={{ borderColor: "#e2e8f0" }}>
        <div className="flex items-center gap-3">
          <div className="h-full w-[3px] self-stretch rounded" style={{ backgroundColor: c.color }} />
          <div>
            <h1 className="text-[22px] font-bold leading-none break-words">{fn(r)}</h1>
            <p className="mt-1 text-[11px] font-semibold break-words" style={{ color: c.color }}>{r.title || "Professional Title"}</p>
          </div>
        </div>
      </header>
      <div className="mb-3"><Contact items={contact} color={c.color} /></div>
      {r.summary && <section className="mt-3"><SH title="Summary" color={c.color} underline /><p className="text-[9.5px] leading-[1.55] text-[#1e293b] break-words">{r.summary}</p></section>}
      <section className="mt-3"><SH title="Experience" color={c.color} underline /><Exp experiences={r.experiences} color={c.color} /></section>
      {r.education.length > 0 && <section className="mt-3"><SH title="Education" color={c.color} underline /><Edu education={r.education} /></section>}
      {r.skills.length > 0 && <section className="mt-3"><SH title="Skills" color={c.color} underline /><Skills skills={r.skills} color={c.color} /></section>}
    </div>
  );
}

/* ══════════════════════════════════════
   LAYOUT 6: Accent bar
   ══════════════════════════════════════ */
function AccentBarLayout({ resume: r, config: c }: LP) {
  const contact = gc(r);
  return (
    <Sheet font={c.font}>
      <header className="mb-7 flex gap-4">
        <div className="w-[4px] shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
        <div className="min-w-0">
          <h1 className="text-[30px] font-bold leading-none break-words">{fn(r)}</h1>
          <p className="mt-2 text-[12px] font-semibold break-words" style={{ color: c.color }}>{r.title || "Professional Title"}</p>
          <div className="mt-3"><Contact items={contact} color={c.color} /></div>
        </div>
      </header>
      {r.summary && (
        <section className="mt-5 flex gap-4">
          <div className="w-[4px] shrink-0 rounded-full" style={{ backgroundColor: c.color + "30" }} />
          <div className="min-w-0"><SH title="Summary" color={c.color} /><p className="text-[10px] leading-[1.65] text-[#1e293b] break-words">{r.summary}</p></div>
        </section>
      )}
      <section className="mt-5 flex gap-4">
        <div className="w-[4px] shrink-0 rounded-full" style={{ backgroundColor: c.color + "30" }} />
        <div className="flex-1 min-w-0"><SH title="Experience" color={c.color} /><Exp experiences={r.experiences} color={c.color} /></div>
      </section>
      {r.education.length > 0 && (
        <section className="mt-5 flex gap-4">
          <div className="w-[4px] shrink-0 rounded-full" style={{ backgroundColor: c.color + "30" }} />
          <div className="flex-1 min-w-0"><SH title="Education" color={c.color} /><Edu education={r.education} /></div>
        </section>
      )}
      {r.skills.length > 0 && (
        <section className="mt-5 flex gap-4">
          <div className="w-[4px] shrink-0 rounded-full" style={{ backgroundColor: c.color + "30" }} />
          <div className="flex-1 min-w-0"><SH title="Skills" color={c.color} /><Skills skills={r.skills} color={c.color} /></div>
        </section>
      )}
    </Sheet>
  );
}

/* ══════════════════════════════════════
   LAYOUT 7: Band top
   ══════════════════════════════════════ */
function BandTopLayout({ resume: r, config: c }: LP) {
  const contact = gc(r);
  return (
    <div className={fc(c.font) + " text-[#0f172a] overflow-hidden"} style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#fff" }}>
      <header style={{ backgroundColor: c.color, padding: "18mm 20mm 14mm", color: "#fff" }}>
        <h1 className="text-[30px] font-bold leading-none text-white break-words">{fn(r)}</h1>
        <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.14em] text-white/80 break-words">{r.title || "Professional Title"}</p>
        <div className="mt-3"><Contact items={contact} light /></div>
      </header>
      <div style={{ padding: "14mm 20mm 18mm" }}>
        {r.summary && <section className="mt-2"><SH title="Summary" color={c.color} /><p className="text-[10px] leading-[1.65] text-[#1e293b] break-words">{r.summary}</p></section>}
        <section className="mt-5"><SH title="Experience" color={c.color} /><Exp experiences={r.experiences} color={c.color} /></section>
        {r.education.length > 0 && <section className="mt-5"><SH title="Education" color={c.color} /><Edu education={r.education} /></section>}
        {r.skills.length > 0 && <section className="mt-5"><SH title="Skills" color={c.color} /><Skills skills={r.skills} color={c.color} /></section>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   LAYOUT 8: Timeline
   ══════════════════════════════════════ */
function TimelineLayout({ resume: r, config: c }: LP) {
  const contact = gc(r);
  return (
    <Sheet font={c.font}>
      <header className="mb-7">
        <h1 className="text-[30px] font-bold leading-none tracking-tight break-words">{fn(r)}</h1>
        <p className="mt-2 text-[13px] font-semibold break-words" style={{ color: c.color }}>{r.title || "Professional Title"}</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-px flex-1" style={{ backgroundColor: c.color + "40" }} />
          <Contact items={contact} color={c.color} />
          <div className="h-px flex-1" style={{ backgroundColor: c.color + "40" }} />
        </div>
      </header>
      {r.summary && <section className="mt-5"><SH title="Summary" color={c.color} /><p className="text-[10px] leading-[1.65] text-[#1e293b] break-words">{r.summary}</p></section>}
      <section className="mt-5"><SH title="Experience" color={c.color} /><TimelineExp experiences={r.experiences} color={c.color} /></section>
      {r.education.length > 0 && <section className="mt-5"><SH title="Education" color={c.color} /><Edu education={r.education} /></section>}
      {r.skills.length > 0 && <section className="mt-5"><SH title="Skills" color={c.color} /><Skills skills={r.skills} color={c.color} /></section>}
    </Sheet>
  );
}

/* ══════════════════════════════════════
   40 TEMPLATE CONFIGURATIONS
   ══════════════════════════════════════ */
export const PARAMETRIC_CONFIGS: ParametricConfig[] = [
  /* ── Clean / Single Column ── */
  { name: "Nova",       style: "clean", pdfLayout: "single", color: "#7c3aed", font: "sans", desc: "Bold violet single-column design with a striking modern feel.", tags: ["Modern", "Sans-Serif"] },
  { name: "Frost",      style: "clean", pdfLayout: "single", color: "#0ea5e9", font: "sans", desc: "Cool sky-blue minimalist layout for a crisp, professional look.", tags: ["Clean", "ATS Optimized"] },
  { name: "Slate",      style: "clean", pdfLayout: "single", color: "#475569", font: "sans", desc: "Sophisticated gray tones for understated elegance.", tags: ["Professional", "Neutral"] },
  { name: "Ember",      style: "clean", pdfLayout: "single", color: "#dc2626", font: "sans", desc: "Striking red accents that demand attention and confidence.", tags: ["Bold", "Sans-Serif"] },
  { name: "Sage",       style: "clean", pdfLayout: "single", color: "#059669", font: "sans", desc: "Natural green palette for a calm, trustworthy impression.", tags: ["Fresh", "ATS Optimized"] },
  { name: "Teal",       style: "clean", pdfLayout: "single", color: "#0d9488", font: "sans", desc: "Balanced teal tones for a polished, contemporary design.", tags: ["Modern", "Clean"] },
  { name: "Coral",      style: "clean", pdfLayout: "single", color: "#f97316", font: "sans", desc: "Warm orange accents for creative and energetic professionals.", tags: ["Creative", "Warm"] },
  { name: "Azure",      style: "clean", pdfLayout: "single", color: "#2563eb", font: "sans", desc: "Classic blue professional design that inspires trust.", tags: ["Professional", "ATS Optimized"] },

  /* ── Sidebar Dark ── */
  { name: "Iron",       style: "sidebar-dark", pdfLayout: "twoColumn", color: "#ef4444", sidebarBg: "#1e293b", font: "sans", desc: "Dark sidebar with bold red accents for strong visual impact.", tags: ["2-Column", "Bold"] },
  { name: "Midnight",   style: "sidebar-dark", pdfLayout: "twoColumn", color: "#3b82f6", sidebarBg: "#0f172a", font: "sans", desc: "Deep navy sidebar with blue highlights for a premium look.", tags: ["2-Column", "Premium"] },
  { name: "Forest",     style: "sidebar-dark", pdfLayout: "twoColumn", color: "#22c55e", sidebarBg: "#14532d", font: "sans", desc: "Rich forest-green sidebar for nature-inspired professionalism.", tags: ["2-Column", "Unique"] },
  { name: "Crimson",    style: "sidebar-dark", pdfLayout: "twoColumn", color: "#f87171", sidebarBg: "#1c1917", font: "sans", desc: "Warm charcoal sidebar with crimson details for executive presence.", tags: ["2-Column", "Executive"] },
  { name: "Plum",       style: "sidebar-dark", pdfLayout: "twoColumn", color: "#a855f7", sidebarBg: "#1e1b4b", font: "sans", desc: "Deep indigo sidebar with purple accents for creative roles.", tags: ["2-Column", "Creative"] },
  { name: "Ocean",      style: "sidebar-dark", pdfLayout: "twoColumn", color: "#06b6d4", sidebarBg: "#0c4a6e", font: "sans", desc: "Dark teal sidebar with cyan highlights for tech-focused roles.", tags: ["2-Column", "Tech"] },

  /* ── Sidebar Light ── */
  { name: "Coast",      style: "sidebar-light", pdfLayout: "twoColumn", color: "#0284c7", sidebarBg: "#eff6ff", font: "sans", desc: "Soft blue sidebar for a fresh, inviting design.", tags: ["2-Column", "Light"] },
  { name: "Prism",      style: "sidebar-light", pdfLayout: "twoColumn", color: "#7c3aed", sidebarBg: "#f5f3ff", font: "sans", desc: "Gentle violet sidebar with a modern, airy feel.", tags: ["2-Column", "Elegant"] },
  { name: "Meadow",     style: "sidebar-light", pdfLayout: "twoColumn", color: "#059669", sidebarBg: "#f0fdf4", font: "sans", desc: "Light green sidebar for a natural, approachable look.", tags: ["2-Column", "Fresh"] },
  { name: "Copper",     style: "sidebar-light", pdfLayout: "twoColumn", color: "#b45309", sidebarBg: "#fffbeb", font: "sans", desc: "Warm amber sidebar for a rich, sophisticated palette.", tags: ["2-Column", "Warm"] },
  { name: "Blush",      style: "sidebar-light", pdfLayout: "twoColumn", color: "#db2777", sidebarBg: "#fdf2f8", font: "sans", desc: "Soft pink sidebar for a distinctive, elegant touch.", tags: ["2-Column", "Distinctive"] },
  { name: "Storm",      style: "sidebar-light", pdfLayout: "twoColumn", color: "#475569", sidebarBg: "#f1f5f9", font: "sans", desc: "Neutral gray sidebar for a versatile, corporate design.", tags: ["2-Column", "Corporate"] },

  /* ── Centered / Classic ── */
  { name: "Parchment",  style: "centered", pdfLayout: "classic", color: "#78350f", font: "serif", desc: "Warm brown serif design evoking classic paper documents.", tags: ["Classic", "Serif"] },
  { name: "Chronicle",  style: "centered", pdfLayout: "classic", color: "#0f172a", font: "serif", desc: "Bold black serif layout with timeless editorial authority.", tags: ["Editorial", "Serif"] },
  { name: "Heritage",   style: "centered", pdfLayout: "classic", color: "#57534e", font: "serif", desc: "Warm stone tones with classic centered typography.", tags: ["Traditional", "Serif"] },
  { name: "Regal",      style: "centered", pdfLayout: "classic", color: "#1e40af", font: "serif", desc: "Royal blue serif design for distinguished professionals.", tags: ["Distinguished", "Serif"] },
  { name: "Ivory",      style: "centered", pdfLayout: "classic", color: "#7c2d12", font: "serif", desc: "Deep terracotta accents with refined serif typography.", tags: ["Refined", "Serif"] },

  /* ── Compact ── */
  { name: "Flux",       style: "compact-dense", pdfLayout: "compact", color: "#6366f1", font: "sans", desc: "Dense indigo design for fitting more content per page.", tags: ["Compact", "Dense"] },
  { name: "Swift",      style: "compact-dense", pdfLayout: "compact", color: "#0284c7", font: "sans", desc: "Compact blue layout that maximizes information density.", tags: ["Compact", "ATS Optimized"] },
  { name: "Dash",       style: "compact-dense", pdfLayout: "compact", color: "#059669", font: "sans", desc: "Quick-scan green compact design for experienced professionals.", tags: ["Compact", "Experienced"] },
  { name: "Pulse",      style: "compact-dense", pdfLayout: "compact", color: "#dc2626", font: "sans", desc: "High-energy red compact layout that packs a punch.", tags: ["Compact", "Bold"] },

  /* ── Accent Bar ── */
  { name: "Stripe",     style: "accent-bar", pdfLayout: "single", color: "#2563eb", font: "sans", desc: "Signature blue accent bar running alongside each section.", tags: ["Accent Bar", "Modern"] },
  { name: "Edge",       style: "accent-bar", pdfLayout: "single", color: "#dc2626", font: "sans", desc: "Bold red accent bar for a decisive, impactful layout.", tags: ["Accent Bar", "Bold"] },
  { name: "Rail",       style: "accent-bar", pdfLayout: "single", color: "#059669", font: "sans", desc: "Green rail accent for an organized, calm presentation.", tags: ["Accent Bar", "Professional"] },
  { name: "Shard",      style: "accent-bar", pdfLayout: "single", color: "#7c3aed", font: "sans", desc: "Purple accent bar design with a creative, sharp edge.", tags: ["Accent Bar", "Creative"] },

  /* ── Band Top ── */
  { name: "Signal",     style: "band-top", pdfLayout: "single", color: "#1e40af", font: "sans", desc: "Deep blue header band for immediate visual authority.", tags: ["Header Band", "Executive"] },
  { name: "Zen",        style: "band-top", pdfLayout: "single", color: "#065f46", font: "sans", desc: "Calming dark green header for a serene, focused feel.", tags: ["Header Band", "Calm"] },
  { name: "Futura",     style: "band-top", pdfLayout: "single", color: "#7c3aed", font: "sans", desc: "Vibrant purple header band for a forward-looking design.", tags: ["Header Band", "Creative"] },
  { name: "Crest",      style: "band-top", pdfLayout: "single", color: "#b45309", font: "sans", desc: "Warm amber header band for a distinguished, warm presence.", tags: ["Header Band", "Warm"] },

  /* ── Timeline ── */
  { name: "Journey",    style: "timeline", pdfLayout: "single", color: "#2563eb", font: "sans", desc: "Timeline-style layout with connected experience dots in blue.", tags: ["Timeline", "Modern"] },
  { name: "Pathway",    style: "timeline", pdfLayout: "single", color: "#059669", font: "sans", desc: "Green timeline design showing your career path progression.", tags: ["Timeline", "Career Path"] },
  { name: "Milestone",  style: "timeline", pdfLayout: "single", color: "#7c3aed", font: "sans", desc: "Purple timeline highlighting key career milestones.", tags: ["Timeline", "Unique"] },
];

/* ══════════════════════════════════════
   FACTORY
   ══════════════════════════════════════ */
export function makeParametric(config: ParametricConfig): ComponentType<{ resume: ResumeData; settings?: SelectedTemplate }> {
  const layouts: Record<ParametricStyle, React.FC<LP>> = {
    "clean": CleanLayout,
    "sidebar-dark": SidebarDarkLayout,
    "sidebar-light": SidebarLightLayout,
    "centered": CenteredLayout,
    "compact-dense": CompactLayout,
    "accent-bar": AccentBarLayout,
    "band-top": BandTopLayout,
    "timeline": TimelineLayout,
  };
  const Layout = layouts[config.style] || CleanLayout;
  function Preview({ resume, settings }: { resume: ResumeData; settings?: SelectedTemplate }) {
    const activeConfig = {
      ...config,
      color: settings?.themeColor || config.color,
      font: settings?.fontFamily || config.font,
    };
    return <Layout resume={resume} config={activeConfig} />;
  }
  Preview.displayName = config.name.replace(/\s/g, "") + "Preview";
  return Preview;
}

export const parametricTemplates: Record<string, ComponentType<{ resume: ResumeData; settings?: SelectedTemplate }>> = {};
for (const config of PARAMETRIC_CONFIGS) {
  parametricTemplates[config.name] = makeParametric(config);
}
