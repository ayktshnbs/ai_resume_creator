import type { ResumeData } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";

export function AuroraPreview({ resume }: { resume: ResumeData }) {
  const fullName = getFullName(resume) || "Your Name";

  return (
    <div className="font-sans" style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#ffffff" }}>
      {/* Top band with name */}
      <header style={{ padding: "16mm 20mm", backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}>
        <h1 className="text-[34px] font-extrabold leading-none tracking-tight text-[#0f172a]">{fullName}</h1>
        <p className="mt-2 text-[14px] font-semibold text-[#4648d4]">{resume.title || "Professional Title"}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[10.5px] text-[#475569]">
          {resume.email && <ContactItem label="Email" value={resume.email} />}
          {resume.phone && <ContactItem label="Tel" value={resume.phone} />}
          {resume.location && <ContactItem label="Loc" value={resume.location} />}
          {resume.website && <ContactItem label="Web" value={resume.website} />}
        </div>
      </header>

      <div style={{ display: "flex", padding: "16mm 20mm 20mm 20mm", gap: "12mm" }}>
        {/* Left column */}
        <aside style={{ width: "60mm" }}>
          {resume.summary && (
            <ColSection title="About">
              <p className="text-[10.5px] leading-[1.65] text-[#1e293b]">{resume.summary}</p>
            </ColSection>
          )}

          {resume.skills.length > 0 && (
            <ColSection title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-[#e2e8f0] bg-white px-2 py-1 text-[9.5px] font-semibold text-[#1e293b]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </ColSection>
          )}

          {resume.education.length > 0 && (
            <ColSection title="Education">
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
        <main style={{ flex: 1 }}>
          <ColSection title="Experience">
            {resume.experiences.length === 0 ? (
              <p className="text-[10.5px] italic text-[#94a3b8]">Experience entries will appear here.</p>
            ) : (
              <div className="space-y-4">
                {resume.experiences.map((exp) => (
                  <div key={exp.id} className="rounded-lg border border-[#e2e8f0] bg-white p-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-[12px] font-bold text-[#0f172a]">{exp.role || "Role Title"}</h3>
                      <span className="text-[9.5px] font-semibold uppercase tracking-wider text-[#4648d4]">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#475569]">
                      <span className="font-semibold">{exp.company || "Company"}</span>
                      {exp.location && <span> · {exp.location}</span>}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.filter(Boolean).map((bullet, i) => (
                        <li key={i} className="relative pl-3 text-[10.5px] leading-[1.55] text-[#1e293b]">
                          <span className="absolute left-0 top-[7px] h-1 w-1 rounded-full bg-[#4648d4]" />
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

function ContactItem({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#4648d4]">{label}</span>
      <span>{value}</span>
    </span>
  );
}

function ColSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#4648d4]">{title}</h2>
      <div className="mb-3 h-[2px] w-7 bg-[#4648d4]" />
      {children}
    </section>
  );
}
