import type { ResumeData, SelectedTemplate } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";

// Vertex — dense, info-rich, two-column. Designed for principal /
// staff IC and engineering CVs where every line earns its space.
export function VertexPreview({ resume, settings }: { resume: ResumeData; settings?: SelectedTemplate }) {
  const color = settings?.themeColor || "#0d9488";
  const fontClass = settings?.fontFamily === "serif" ? "font-serif" : settings?.fontFamily === "mono" ? "font-mono" : "font-sans";
  const fullName = getFullName(resume) || "Your Name";
  const contact = [resume.email, resume.phone, resume.location, resume.website].filter(Boolean);

  return (
    <div
      className={`${fontClass} text-[#0f172a] overflow-hidden`}
      style={{ width: "210mm", minHeight: "297mm", padding: "16mm 18mm", backgroundColor: "#ffffff" }}
    >
      {/* Compact header */}
      <header className="mb-5 border-b-2 pb-4" style={{ borderColor: color }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-[28px] font-bold leading-none tracking-tight break-words">{fullName}</h1>
            <p className="mt-1.5 text-[11.5px] font-bold uppercase tracking-[0.16em] break-words" style={{ color: color }}>
              {resume.title || "Professional Title"}
            </p>
          </div>
          <div className="text-right text-[9.5px] leading-[1.55] text-[#475569] min-w-0">
            {contact.length === 0 ? (
              <p>Add contact details</p>
            ) : (
              contact.map((item) => <p key={item} className="break-all">{item}</p>)
            )}
          </div>
        </div>
      </header>

      {resume.summary && (
        <section className="mb-5">
          <SectionTitle color={color}>Profile</SectionTitle>
          <p className="text-[10px] leading-[1.55] text-[#1e293b] break-words">{resume.summary}</p>
        </section>
      )}

      <div className="grid grid-cols-[1fr_55mm] gap-x-7">
        {/* Main column — experience */}
        <div className="min-w-0">
          <section>
            <SectionTitle color={color}>Experience</SectionTitle>
            {resume.experiences.length === 0 ? (
              <p className="text-[10px] italic text-[#94a3b8]">Experience entries will appear here.</p>
            ) : (
              <div className="space-y-4">
                {resume.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-wrap items-start justify-between gap-x-3">
                      <h3 className="flex-1 text-[11.5px] font-bold text-[#0f172a] break-words">
                        {exp.role || "Role Title"}
                        <span className="font-normal" style={{ color: color }}> · {exp.company || "Company"}</span>
                      </h3>
                      <span className="shrink-0 text-[9.5px] font-semibold text-[#475569] whitespace-nowrap mt-0.5">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    {exp.location && (
                      <p className="text-[9.5px] italic text-[#64748b] break-words">{exp.location}</p>
                    )}
                    <ul className="mt-1.5 space-y-0.5">
                      {exp.bullets.filter(Boolean).map((bullet, i) => (
                        <li key={i} className="relative pl-3 text-[10px] leading-[1.5] text-[#1e293b] break-words">
                          <span className="absolute left-0 top-[6px] h-[3px] w-[3px] rounded-full" style={{ backgroundColor: color }} />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Side column — education + skills */}
        <aside>
          {resume.education.length > 0 && (
            <section>
              <SectionTitle color={color}>Education</SectionTitle>
              <div className="space-y-3">
                {resume.education.map((edu) => (
                  <div key={edu.id}>
                    <p className="text-[10.5px] font-bold leading-tight text-[#0f172a]">
                      {edu.school || "School"}
                    </p>
                    <p className="text-[9.5px] leading-tight text-[#475569]">
                      {edu.degree || "Degree"}
                    </p>
                    <p className="mt-0.5 text-[9px] text-[#64748b]">
                      {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                      {edu.location && ` · ${edu.location}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {resume.skills.length > 0 && (
            <section className="mt-5">
              <SectionTitle color={color}>Skills</SectionTitle>
              <ul className="space-y-0.5">
                {resume.skills.map((skill) => (
                  <li
                    key={skill}
                    className="relative pl-3 text-[9.5px] leading-[1.45] text-[#1e293b]"
                  >
                    <span className="absolute left-0 top-[7px] h-[3px] w-[3px] rounded-full" style={{ backgroundColor: color }} />
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function SectionTitle({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <h2 className="mb-2 text-[9.5px] font-bold uppercase tracking-[0.22em]" style={{ color: color }}>
      {children}
    </h2>
  );
}
