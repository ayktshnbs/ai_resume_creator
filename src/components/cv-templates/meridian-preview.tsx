import type { ResumeData, SelectedTemplate } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";

// Meridian — ultra-minimal monochrome, generous white space.
// For consulting, executive, and finance candidates who let the
// content speak. No accent color by default, but we'll use themeColor for accents if set.
export function MeridianPreview({ resume, settings }: { resume: ResumeData; settings?: SelectedTemplate }) {
  const color = settings?.themeColor || "#111827";
  const fontClass = settings?.fontFamily === "serif" ? "font-serif" : settings?.fontFamily === "mono" ? "font-mono" : "font-sans";
  const fullName = getFullName(resume) || "Your Name";
  const contact = [resume.email, resume.phone, resume.location, resume.website].filter(Boolean);

  return (
    <div
      className={`${fontClass} text-[#111827] overflow-hidden`}
      style={{ width: "210mm", minHeight: "297mm", padding: "22mm 24mm", backgroundColor: "#ffffff" }}
    >
      <header className="mb-9 flex items-end justify-between gap-6 border-b pb-5" style={{ borderColor: color }}>
        <div className="min-w-0">
          <h1 className="text-[36px] font-semibold leading-[1.05] tracking-[-0.02em] text-[#111827] break-words">
            {fullName}
          </h1>
          <p className="mt-1.5 text-[12.5px] font-medium text-[#374151] break-words">
            {resume.title || "Professional Title"}
          </p>
        </div>
        <div className="text-right text-[9.5px] leading-[1.7] text-[#4b5563] min-w-0">
          {contact.length === 0 ? (
            <p>Add contact details</p>
          ) : (
            contact.map((item) => <p key={item} className="break-all">{item}</p>)
          )}
        </div>
      </header>

      {resume.summary && (
        <Section title="Summary" color={color}>
          <p className="text-[10.5px] leading-[1.7] text-[#1f2937] break-words">{resume.summary}</p>
        </Section>
      )}

      <Section title="Experience" color={color}>
        {resume.experiences.length === 0 ? (
          <p className="text-[10.5px] italic text-[#9ca3af]">Experience entries will appear here.</p>
        ) : (
          <div className="space-y-5">
            {resume.experiences.map((exp) => (
              <div key={exp.id} className="grid grid-cols-[30mm_1fr] gap-x-5">
                <div className="text-[9.5px] font-medium uppercase tracking-[0.12em] text-[#6b7280] whitespace-nowrap">
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[12px] font-semibold tracking-tight text-[#111827] break-words">
                    {exp.role || "Role Title"}
                  </h3>
                  <p className="text-[11px] font-medium text-[#374151] break-words">
                    {exp.company || "Company"}
                    {exp.location && <span className="font-normal text-[#6b7280]"> — {exp.location}</span>}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.filter(Boolean).map((bullet, i) => (
                      <li key={i} className="text-[10.5px] leading-[1.55] text-[#1f2937] break-words">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {resume.education.length > 0 && (
        <Section title="Education" color={color}>
          <div className="space-y-2">
            {resume.education.map((edu) => (
              <div key={edu.id} className="grid grid-cols-[30mm_1fr] gap-x-5">
                <div className="text-[9.5px] font-medium uppercase tracking-[0.12em] text-[#6b7280] whitespace-nowrap">
                  {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                </div>
                <div className="min-w-0">
                  <p className="text-[11.5px] font-semibold text-[#111827] break-words">
                    {edu.school || "School"}
                  </p>
                  <p className="text-[10.5px] text-[#374151] break-words">
                    {edu.degree || "Degree"}
                    {edu.location && <span className="text-[#6b7280]"> — {edu.location}</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {resume.skills.length > 0 && (
        <Section title="Skills" color={color}>
          <p className="text-[10.5px] leading-[1.75] text-[#1f2937] break-words">
            {resume.skills.join("  ·  ")}
          </p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children, color }: { title: string; children: React.ReactNode; color: string }) {
  return (
    <section className="mt-7">
      <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: color }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
