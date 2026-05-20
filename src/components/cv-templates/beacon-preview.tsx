import type { ResumeData, SelectedTemplate } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";

export function BeaconPreview({ resume, settings }: { resume: ResumeData; settings?: SelectedTemplate }) {
  const color = settings?.themeColor || "#0b3d5a";
  const fontClass = settings?.fontFamily === "serif" ? "font-serif" : settings?.fontFamily === "mono" ? "font-mono" : "font-sans";
  const fullName = getFullName(resume) || "Your Name";
  const contact = [resume.email, resume.phone, resume.location, resume.website].filter(Boolean);

  return (
    <div className={`${fontClass} overflow-hidden`} style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#ffffff" }}>
      {/* Strong color header band */}
      <header style={{ backgroundColor: color, color: "#ffffff", padding: "18mm 22mm 14mm 22mm" }}>
        <h1 className="text-[36px] font-extrabold leading-none tracking-tight break-words">{fullName}</h1>
        <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.18em] break-words" style={{ opacity: 0.8 }}>
          {resume.title || "Professional Title"}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-1.5 text-[10.5px]" style={{ opacity: 0.9 }}>
          {contact.length === 0 ? (
            <span>Add contact details</span>
          ) : (
            contact.map((item) => (
              <span key={item} className="break-all overflow-hidden">
                {item}
              </span>
            ))
          )}
        </div>
      </header>

      <div style={{ padding: "14mm 22mm 20mm 22mm" }}>
        {resume.summary && (
          <Section title="Executive Summary" color={color}>
            <p className="text-[10.5px] leading-[1.7] text-[#1f2937] break-words">{resume.summary}</p>
          </Section>
        )}

        <Section title="Experience" color={color}>
          {resume.experiences.length === 0 ? (
            <p className="text-[10.5px] italic text-[#94a3b8]">Experience entries will appear here.</p>
          ) : (
            <div className="space-y-4">
              {resume.experiences.map((exp) => (
                <div key={exp.id} className="border-l-[3px] pl-4 min-w-0" style={{ borderColor: color }}>
                  <div className="flex flex-wrap items-start justify-between gap-x-4">
                    <h3 className="flex-1 text-[12.5px] font-bold break-words" style={{ color: color }}>
                      {exp.role || "Role Title"}
                    </h3>
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#475569] whitespace-nowrap mt-0.5">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-semibold text-[#1f2937] break-words">
                    {exp.company || "Company"}
                    {exp.location && <span className="font-normal text-[#64748b]"> · {exp.location}</span>}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.filter(Boolean).map((bullet, i) => (
                      <li key={i} className="relative pl-3 text-[10.5px] leading-[1.55] text-[#1f2937] break-words">
                        <span className="absolute left-0 top-[7px] h-1 w-1 rounded-full" style={{ backgroundColor: color }} />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Section>

        <div className="mt-6 grid grid-cols-2 gap-x-8">
          {resume.education.length > 0 && (
            <Section title="Education" color={color} small>
              <div className="space-y-2.5">
                {resume.education.map((edu) => (
                  <div key={edu.id}>
                    <p className="text-[11px] font-bold" style={{ color: color }}>{edu.school || "School"}</p>
                    <p className="text-[10.5px] text-[#1f2937]">{edu.degree || "Degree"}</p>
                    <p className="mt-0.5 text-[9.5px] text-[#64748b]">
                      {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                      {edu.location && ` · ${edu.location}`}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {resume.skills.length > 0 && (
            <Section title="Core Skills" color={color} small>
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border bg-opacity-5 px-2 py-1 text-[9.5px] font-semibold"
                    style={{ borderColor: color + "33", backgroundColor: color + "0d", color: color }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  color,
  small
}: {
  title: string;
  children: React.ReactNode;
  color: string;
  small?: boolean;
}) {
  return (
    <section className={small ? "" : "mt-5 first:mt-0"}>
      <h2 className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.22em]" style={{ color: color }}>
        {title}
      </h2>
      <div className="mb-3 h-[2px] w-9" style={{ backgroundColor: color }} />
      {children}
    </section>
  );
}
