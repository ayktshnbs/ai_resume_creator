import type { ResumeData } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";

export function SterlingPreview({ resume }: { resume: ResumeData }) {
  const fullName = getFullName(resume) || "Your Name";
  const contact = [resume.email, resume.phone, resume.location, resume.website].filter(Boolean);

  return (
    <div
      className="text-[#1f2937]"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm 22mm",
        backgroundColor: "#ffffff",
        fontFamily: "'Georgia', 'Times New Roman', serif"
      }}
    >
      <header className="mb-7 text-center">
        <h1 className="text-[36px] font-normal leading-none tracking-[0.06em]">{fullName.toUpperCase()}</h1>
        <div className="mx-auto my-3 h-px w-20 bg-[#1f2937]" />
        <p className="text-[13px] italic text-[#475569]">{resume.title || "Professional Title"}</p>
        {contact.length > 0 && (
          <p className="mt-3 text-[10.5px] text-[#475569]">{contact.join("   ·   ")}</p>
        )}
      </header>

      {resume.summary && (
        <Section title="Profile">
          <p className="text-[10.5px] leading-[1.7] text-[#1f2937]">{resume.summary}</p>
        </Section>
      )}

      <Section title="Professional Experience">
        {resume.experiences.length === 0 ? (
          <p className="text-[10.5px] italic text-[#94a3b8]">Experience entries will appear here.</p>
        ) : (
          <div className="space-y-4">
            {resume.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[12.5px] font-bold text-[#0f172a]">{exp.role || "Role Title"}</h3>
                  <span className="text-[10.5px] italic text-[#475569]">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                </div>
                <p className="text-[11px] italic text-[#475569]">
                  {exp.company || "Company"}
                  {exp.location && <span> — {exp.location}</span>}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {exp.bullets.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[10.5px] leading-[1.6] text-[#1f2937]">
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
        <Section title="Education">
          <div className="space-y-2">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[12px] font-bold text-[#0f172a]">{edu.school || "School"}</h3>
                  <span className="text-[10.5px] italic text-[#475569]">{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</span>
                </div>
                <p className="text-[11px] italic text-[#475569]">
                  {edu.degree || "Degree"}
                  {edu.location && <span> — {edu.location}</span>}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {resume.skills.length > 0 && (
        <Section title="Competencies">
          <p className="text-[10.5px] leading-[1.7] text-[#1f2937]">{resume.skills.join("  ·  ")}</p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <div className="mb-3">
        <h2 className="text-center text-[11.5px] font-normal uppercase tracking-[0.32em] text-[#0f172a]">{title}</h2>
        <div className="mx-auto mt-1 h-px w-full bg-[#cbd5e1]" />
      </div>
      {children}
    </section>
  );
}
