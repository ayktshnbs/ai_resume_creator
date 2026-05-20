import type { ResumeData, SelectedTemplate } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";

export function SterlingPreview({ resume, settings }: { resume: ResumeData; settings?: SelectedTemplate }) {
  const color = settings?.themeColor || "#0058bc";
  const fontClass = settings?.fontFamily === "serif" ? "font-serif" : settings?.fontFamily === "mono" ? "font-mono" : "font-sans";
  const fullName = getFullName(resume) || "Your Name";
  const contact = [resume.email, resume.phone, resume.location, resume.website].filter(Boolean);

  return (
    <div
      className={`${fontClass} text-[#1f2937] overflow-hidden`}
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm 22mm",
        backgroundColor: "#ffffff"
      }}
    >
      <header className="mb-9">
        <h1 className="text-[32px] font-normal leading-none tracking-[0.04em] break-words">{fullName.toUpperCase()}</h1>
        <p className="mt-3 text-[14px] italic font-bold break-words" style={{ color: color }}>{resume.title || "Professional Title"}</p>
        {contact.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[10.5px] text-[#475569]">
            {contact.map((item, i) => (
              <span key={item} className="flex items-center gap-5">
                {i > 0 && <span className="text-[#cbd5e1] flex-shrink-0">/</span>}
                <span className="break-all overflow-hidden">{item}</span>
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="flex gap-10">
        <div className="w-1 bg-[#f3f4f6] shrink-0 self-stretch rounded-full" />
        <div className="flex-1">
          {resume.summary && (
            <Section title="Profile" color={color}>
              <p className="text-[10.5px] leading-[1.7] text-[#1f2937] break-words">{resume.summary}</p>
            </Section>
          )}

          <Section title="Professional Experience" color={color}>
            {resume.experiences.length === 0 ? (
              <p className="text-[10.5px] italic text-[#94a3b8]">Experience entries will appear here.</p>
            ) : (
              <div className="space-y-6">
                {resume.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-wrap items-start justify-between gap-x-4">
                      <h3 className="flex-1 text-[13px] font-bold text-[#0f172a] break-words">{exp.role || "Role Title"}</h3>
                      <span className="shrink-0 text-[10.5px] italic text-[#475569] whitespace-nowrap mt-0.5">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                    </div>
                    <p className="text-[11px] italic font-medium break-words" style={{ color: color }}>
                      {exp.company || "Company"}
                      {exp.location && <span> — {exp.location}</span>}
                    </p>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5">
                      {exp.bullets.filter(Boolean).map((bullet, i) => (
                        <li key={i} className="text-[10.5px] leading-[1.6] text-[#1f2937] break-words">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {resume.education.length > 0 && (
            <Section title="Education" color={color}>
              <div className="space-y-3">
                {resume.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-4">
                      <h3 className="text-[12px] font-bold text-[#0f172a] break-words">{edu.school || "School"}</h3>
                      <span className="text-[10.5px] italic text-[#475569] whitespace-nowrap">{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</span>
                    </div>
                    <p className="text-[11px] italic text-[#475569] break-words">
                      {edu.degree || "Degree"}
                      {edu.location && <span> — {edu.location}</span>}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {resume.skills.length > 0 && (
            <Section title="Competencies" color={color}>
              <p className="text-[10.5px] leading-[1.7] text-[#1f2937] break-words">{resume.skills.join("  /  ")}</p>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, color }: { title: string; children: React.ReactNode; color: string }) {
  return (
    <section className="mb-8 last:mb-0">
      <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: color }}>{title}</h2>
      {children}
    </section>
  );
}
