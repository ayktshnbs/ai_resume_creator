import type { ResumeData, SelectedTemplate } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";

function Section({ title, index, children, color }: { title: string; index: string; children: React.ReactNode; color: string }) {
  return (
    <section className="mt-8 first:mt-5">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-sm shrink-0" style={{ color: color, backgroundColor: color + "1a" }}>{index}</span>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0f172a]">{title}</h2>
        <div className="flex-1 h-px bg-[#e2e8f0]" />
      </div>
      <div className="pl-10">
        {children}
      </div>
    </section>
  );
}

export function OnyxPreview({ resume, settings }: { resume: ResumeData; settings?: SelectedTemplate }) {
  const color = settings?.themeColor || "#0058bc";
  const fontClass = settings?.fontFamily === "serif" ? "font-serif" : settings?.fontFamily === "mono" ? "font-mono" : "font-sans";
  const fullName = getFullName(resume) || "Your Name";
  const contact = [resume.email, resume.phone, resume.location, resume.website].filter(Boolean);

  return (
    <div className={`${fontClass} text-[#0f172a] overflow-hidden`} style={{ width: "210mm", minHeight: "297mm", padding: "18mm 20mm", backgroundColor: "#ffffff" }}>
      <header className="mb-10 pl-10 border-l-4" style={{ borderColor: color }}>
        <h1 className="text-[38px] font-black leading-none tracking-tight break-words uppercase">{fullName}</h1>
        <p className="mt-3 text-[15px] font-bold tracking-[0.1em] break-words" style={{ color: color }}>
          {resume.title || "Professional Title"}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[10.5px] text-[#475569]">
          {contact.length > 0 ? (
            contact.map((item, i) => (
              <span key={item} className="flex items-center gap-2 min-w-0">
                <span className="break-all overflow-hidden">{item}</span>
              </span>
            ))
          ) : (
            <span>Add contact details</span>
          )}
        </div>
      </header>

      {resume.summary && (
        <Section title="Overview" index="01" color={color}>
          <p className="text-[10.5px] leading-[1.7] text-[#1e293b] break-words">{resume.summary}</p>
        </Section>
      )}

      <Section title="Experience" index="02" color={color}>
        {resume.experiences.length === 0 ? (
          <p className="text-[10.5px] italic text-[#94a3b8]">Experience entries will appear here.</p>
        ) : (
          <div className="space-y-6">
            {resume.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex flex-wrap items-start justify-between gap-x-4">
                  <div className="flex-1 min-w-0">
                    <span className="text-[12.5px] font-bold text-[#0f172a] break-words uppercase">{exp.role || "Role Title"}</span>
                    <span className="text-[12.5px] font-semibold" style={{ color: color }}> @ {exp.company || "Company"}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#64748b] whitespace-nowrap bg-[#f1f5f9] px-2 py-0.5 rounded mt-0.5">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                </div>
                {exp.location && <p className="mt-1 text-[10px] italic text-[#64748b] break-words">{exp.location}</p>}
                <ul className="mt-3 space-y-1.5">
                  {exp.bullets.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="relative pl-4 text-[10.5px] leading-[1.55] text-[#1e293b] break-words">
                      <span className="absolute left-0 top-[7px] h-1.5 w-1.5 border rounded-full" style={{ borderColor: color }} />
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
        <Section title="Education" index="03" color={color}>
          <div className="space-y-4">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex flex-wrap items-baseline justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-[12px] font-bold text-[#0f172a] break-words uppercase">{edu.school || "School"}</span>
                  <p className="text-[11px] text-[#475569] break-words">{edu.degree || "Degree"}{edu.location && <span className="text-[10.5px] text-[#64748b]"> — {edu.location}</span>}</p>
                </div>
                <span className="text-[10px] text-[#64748b] whitespace-nowrap font-medium">{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {resume.skills.length > 0 && (
        <Section title="Expertise" index="04" color={color}>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <span key={skill} className="px-2 py-1 bg-[#f8fafc] border border-[#e2e8f0] text-[9.5px] font-semibold text-[#1e293b] rounded">
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
