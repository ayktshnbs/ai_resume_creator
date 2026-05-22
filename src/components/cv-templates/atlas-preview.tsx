import type { ResumeData } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";

export function AtlasPreview({ resume }: { resume: ResumeData }) {
  const fullName = getFullName(resume) || "Your Name";
  const contact = [
    { label: "Email", value: resume.email },
    { label: "Phone", value: resume.phone },
    { label: "Location", value: resume.location },
    { label: "Website", value: resume.website }
  ].filter((item) => item.value);

  return (
    <div className="font-sans" style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#ffffff", display: "flex" }}>
      {/* Sidebar */}
      <aside
        style={{ width: "72mm", backgroundColor: "#0f172a", color: "#ffffff", padding: "20mm 12mm" }}
      >
        <div className="mb-5">
          {resume.photoUrl ? (
            <img src={resume.photoUrl} alt={fullName} style={{ width: "24mm", height: "24mm", borderRadius: "50%", objectFit: "cover", objectPosition: `${resume.photoX ?? 50}% ${resume.photoY ?? 50}%`, border: "2.5px solid #2563eb" }} />
          ) : (
            <div className="flex items-center justify-center rounded-full border-[2.5px] border-[#2563eb]/40 bg-[#2563eb]/15 text-[22px] font-bold text-white" style={{ width: "24mm", height: "24mm" }}>
              {fullName.split(" ").map(w => w.charAt(0)).slice(0, 2).join("").toUpperCase() || "CV"}
            </div>
          )}
        </div>
        <div className="mb-7">
          <h1 className="text-[26px] font-extrabold leading-[1.05] tracking-tight">{fullName}</h1>
          <div className="mt-2 h-[3px] w-10 bg-[#2563eb]" />
          <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#93c5fd]">
            {resume.title || "Professional Title"}
          </p>
        </div>

        {contact.length > 0 && (
          <SidebarSection title="Contact">
            <div className="space-y-2">
              {contact.map((item) => (
                <div key={item.label}>
                  <p className="text-[8.5px] font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">{item.label}</p>
                  <p className="break-words text-[10px] text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </SidebarSection>
        )}

        {resume.skills.length > 0 && (
          <SidebarSection title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-white/10 px-2 py-1 text-[9px] font-medium text-white">
                  {skill}
                </span>
              ))}
            </div>
          </SidebarSection>
        )}

        {resume.education.length > 0 && (
          <SidebarSection title="Education">
            <div className="space-y-3">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-[10.5px] font-bold text-white">{edu.school || "School"}</p>
                  <p className="text-[10px] text-[#cbd5e1]">{edu.degree || "Degree"}</p>
                  <p className="text-[9px] text-[#94a3b8]">
                    {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                    {edu.location && ` · ${edu.location}`}
                  </p>
                </div>
              ))}
            </div>
          </SidebarSection>
        )}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "20mm 18mm" }}>
        {resume.summary && (
          <MainSection title="Profile">
            <p className="text-[10.5px] leading-[1.7] text-[#1e293b]">{resume.summary}</p>
          </MainSection>
        )}

        <MainSection title="Experience">
          {resume.experiences.length === 0 ? (
            <p className="text-[10.5px] italic text-[#94a3b8]">Experience entries will appear here.</p>
          ) : (
            <div className="space-y-5">
              {resume.experiences.map((exp) => (
                <div key={exp.id} className="relative pl-4">
                  <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-[#2563eb]" />
                  <div className="absolute bottom-0 left-[3px] top-5 w-px bg-[#e2e8f0]" />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-[12px] font-bold text-[#0f172a]">{exp.role || "Role Title"}</h3>
                    <span className="text-[10px] font-medium text-[#64748b]">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-[#2563eb]">{exp.company || "Company"}{exp.location && <span className="font-normal text-[#64748b]"> · {exp.location}</span>}</p>
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.filter(Boolean).map((bullet, i) => (
                      <li key={i} className="relative pl-3 text-[10.5px] leading-[1.55] text-[#1e293b]">
                        <span className="absolute left-0 top-[7px] h-1 w-1 rounded-full bg-[#64748b]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </MainSection>
      </main>
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-white">{title}</h2>
      <div className="mb-3 h-px w-full bg-white/15" />
      {children}
    </section>
  );
}

function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#0f172a]">{title}</h2>
      <div className="mb-4 h-[2px] w-8 bg-[#2563eb]" />
      {children}
    </section>
  );
}
