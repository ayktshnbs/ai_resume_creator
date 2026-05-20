import type { ResumeData, SelectedTemplate } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";

export function AuroraPreview({ resume, settings }: { resume: ResumeData; settings?: SelectedTemplate }) {
  const color = settings?.themeColor || "#4648d4";
  const fontClass = settings?.fontFamily === "serif" ? "font-serif" : settings?.fontFamily === "mono" ? "font-mono" : "font-sans";
  const fullName = getFullName(resume) || "Your Name";

  return (
    <div className={`${fontClass} overflow-hidden`} style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#ffffff" }}>
      {/* Top band with name */}
      <header style={{ padding: "16mm 20mm", backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}>
        <h1 className="text-[34px] font-extrabold leading-none tracking-tight text-[#0f172a] break-words">{fullName}</h1>
        <p className="mt-2 text-[14px] font-semibold break-words" style={{ color: color }}>{resume.title || "Professional Title"}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[10.5px] text-[#475569]">
          {resume.email && <ContactItem label="Email" value={resume.email} color={color} />}
          {resume.phone && <ContactItem label="Tel" value={resume.phone} color={color} />}
          {resume.location && <ContactItem label="Loc" value={resume.location} color={color} />}
          {resume.website && <ContactItem label="Web" value={resume.website} color={color} />}
        </div>
      </header>

      <div style={{ display: "flex", padding: "16mm 20mm 20mm 20mm", gap: "12mm" }}>
        {/* Left column */}
        <aside style={{ width: "60mm" }} className="flex-shrink-0">
          {resume.summary && (
            <ColSection title="About" color={color}>
              <p className="text-[10.5px] leading-[1.65] text-[#1e293b] break-words">{resume.summary}</p>
            </ColSection>
          )}

          {resume.skills.length > 0 && (
            <ColSection title="Skills" color={color}>
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-[#e2e8f0] bg-white px-2 py-1 text-[9.5px] font-semibold text-[#1e293b] break-words"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </ColSection>
          )}

          {resume.education.length > 0 && (
            <ColSection title="Education" color={color}>
              <div className="space-y-3">
                {resume.education.map((edu) => (
                  <div key={edu.id}>
                    <p className="text-[10.5px] font-bold text-[#0f172a]">{edu.school || "School"}</p>
                    <p className="text-[10px] text-[#475569]">{edu.degree || "Degree"}</p>
                    <p className="mt-0.5 text-[9.5px] text-[#64748b]">
                      {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                      {edu.location && ` · ${edu.location}`}
                    </p>
                  </div>
                ))}
              </div>
            </ColSection>
          )}
        </aside>

        {/* Right column - experience */}
        <main style={{ flex: 1 }} className="min-w-0">
          <ColSection title="Experience" color={color}>
            {resume.experiences.length === 0 ? (
              <p className="text-[10.5px] italic text-[#94a3b8]">Experience entries will appear here.</p>
            ) : (
              <div className="space-y-4">
                {resume.experiences.map((exp) => (
                  <div key={exp.id} className="rounded-lg border border-[#e2e8f0] bg-white p-3">
                    <div className="flex flex-wrap items-start justify-between gap-x-3">
                      <h3 className="flex-1 text-[12px] font-bold text-[#0f172a] break-words">{exp.role || "Role Title"}</h3>
                      <span className="shrink-0 text-[9.5px] font-semibold uppercase tracking-wider whitespace-nowrap mt-0.5" style={{ color: color }}>
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#475569] break-words">
                      <span className="font-semibold">{exp.company || "Company"}</span>
                      {exp.location && <span> · {exp.location}</span>}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.filter(Boolean).map((bullet, i) => (
                        <li key={i} className="relative pl-3 text-[10.5px] leading-[1.55] text-[#1e293b] break-words">
                          <span className="absolute left-0 top-[7px] h-1 w-1 rounded-full" style={{ backgroundColor: color }} />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </ColSection>
        </main>
      </div>
    </div>
  );
}

function ContactItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <span className="flex items-center gap-1.5 min-w-0">
      <span className="text-[8.5px] font-bold uppercase tracking-wider flex-shrink-0" style={{ color: color }}>{label}</span>
      <span className="break-all overflow-hidden">{value}</span>
    </span>
  );
}

function ColSection({ title, children, color }: { title: string; children: React.ReactNode; color: string }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: color }}>{title}</h2>
      <div className="mb-3 h-[2px] w-7" style={{ backgroundColor: color }} />
      {children}
    </section>
  );
}
