import type { ResumeData } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";

export function OnyxPreview({ resume }: { resume: ResumeData }) {
  const fullName = getFullName(resume) || "Your Name";
  const contact = [resume.email, resume.phone, resume.location, resume.website].filter(Boolean);

  return (
    <div className="font-sans text-[#0f172a]" style={{ width: "210mm", minHeight: "297mm", padding: "18mm 20mm", backgroundColor: "#ffffff" }}>
      <header className="mb-7">
        <h1 className="text-[34px] font-bold leading-none tracking-tight">{fullName}</h1>
        <p className="mt-2 text-[14px] font-semibold uppercase tracking-[0.18em] text-[#0058bc]">
          {resume.title || "Professional Title"}
        </p>
        <div className="mt-4 h-px w-full bg-[#0f172a]" />
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-[#475569]">
          {contact.length > 0 ? (
            contact.map((item, i) => (
              <span key={item} className="flex items-center gap-3">
                {i > 0 && <span className="text-[#cbd5e1]">·</span>}
                <span>{item}</span>
              </span>
            ))
          ) : (
            <span>Add contact details</span>
          )}
        </div>
      </header>

      {resume.summary && (
        <Section title="Summary">
          <p className="text-[10.5px] leading-[1.65] text-[#1e293b]">{resume.summary}</p>
        </Section>
      )}

      <Section title="Experience">
        {resume.experiences.length === 0 ? (
          <p className="text-[10.5px] italic text-[#94a3b8]">Experience entries will appear here.</p>
        ) : (
          <div className="space-y-4">
            {resume.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <span className="text-[12px] font-bold text-[#0f172a]">{exp.role || "Role Title"}</span>
                    <span className="text-[12px] text-[#475569]"> · {exp.company || "Company"}</span>
                  </div>
                  <span className="text-[10px] font-medium text-[#64748b]">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                </div>
                {exp.location && <p className="mt-0.5 text-[10px] italic text-[#64748b]">{exp.location}</p>}
                <ul className="mt-2 space-y-1">
                  {exp.bullets.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="relative pl-3 text-[10.5px] leading-[1.55] text-[#1e293b]">
                      <span className="absolute left-0 top-[7px] h-1 w-1 rounded-full bg-[#0058bc]" />
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
              <div key={edu.id} className="flex items-baseline justify-between gap-4">
                <div>
                  <span className="text-[11.5px] font-bold text-[#0f172a]">{edu.school || "School"}</span>
                  <span className="text-[11.5px] text-[#475569]"> · {edu.degree || "Degree"}</span>
                  {edu.location && <span className="text-[10.5px] text-[#64748b]"> — {edu.location}</span>}
                </div>
                <span className="text-[10px] text-[#64748b]">{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {resume.skills.length > 0 && (
        <Section title="Skills">
          <p className="text-[10.5px] leading-[1.7] text-[#1e293b]">{resume.skills.join("  ·  ")}</p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#0058bc]">{title}</h2>
      {children}
    </section>
  );
}
