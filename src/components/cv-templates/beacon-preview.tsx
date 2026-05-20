import type { ResumeData } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";

// Beacon — strong color block header, bold modern executive feel.
// Pairs well with senior leadership / heads-of-function CVs.
export function BeaconPreview({ resume }: { resume: ResumeData }) {
  const fullName = getFullName(resume) || "Your Name";
  const contact = [resume.email, resume.phone, resume.location, resume.website].filter(Boolean);

  return (
    <div className="font-sans" style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#ffffff" }}>
      {/* Strong color header band */}
      <header style={{ backgroundColor: "#0b3d5a", color: "#ffffff", padding: "18mm 22mm 14mm 22mm" }}>
        <h1 className="text-[36px] font-extrabold leading-none tracking-tight">{fullName}</h1>
        <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#a4d4ec]">
          {resume.title || "Professional Title"}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-1.5 text-[10.5px] text-[#cfe6f4]">
          {contact.length === 0 ? (
            <span>Add contact details</span>
          ) : (
            contact.map((item) => (
              <span key={item} className="break-words">
                {item}
              </span>
            ))
          )}
        </div>
      </header>

      <div style={{ padding: "14mm 22mm 20mm 22mm" }}>
        {resume.summary && (
          <Section title="Executive Summary">
            <p className="text-[10.5px] leading-[1.7] text-[#1f2937]">{resume.summary}</p>
          </Section>
        )}

        <Section title="Experience">
          {resume.experiences.length === 0 ? (
            <p className="text-[10.5px] italic text-[#94a3b8]">Experience entries will appear here.</p>
          ) : (
            <div className="space-y-4">
              {resume.experiences.map((exp) => (
                <div key={exp.id} className="border-l-[3px] border-[#0b3d5a] pl-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-[12.5px] font-bold text-[#0b3d5a]">
                      {exp.role || "Role Title"}
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#475569]">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-semibold text-[#1f2937]">
                    {exp.company || "Company"}
                    {exp.location && <span className="font-normal text-[#64748b]"> · {exp.location}</span>}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.filter(Boolean).map((bullet, i) => (
                      <li key={i} className="relative pl-3 text-[10.5px] leading-[1.55] text-[#1f2937]">
                        <span className="absolute left-0 top-[7px] h-1 w-1 rounded-full bg-[#0b3d5a]" />
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
            <Section title="Education" small>
              <div className="space-y-2.5">
                {resume.education.map((edu) => (
                  <div key={edu.id}>
                    <p className="text-[11px] font-bold text-[#0b3d5a]">{edu.school || "School"}</p>
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
            <Section title="Core Skills" small>
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-[#0b3d5a]/20 bg-[#0b3d5a]/5 px-2 py-1 text-[9.5px] font-semibold text-[#0b3d5a]"
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
  small
}: {
  title: string;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <section className={small ? "" : "mt-5 first:mt-0"}>
      <h2 className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#0b3d5a]">
        {title}
      </h2>
      <div className="mb-3 h-[2px] w-9 bg-[#0b3d5a]" />
      {children}
    </section>
  );
}
