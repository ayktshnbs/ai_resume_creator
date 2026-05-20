import type { ResumeData, SelectedTemplate } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";

// Helix — bold gradient sidebar with a photo placeholder, modern card body.
export function HelixPreview({ resume, settings }: { resume: ResumeData; settings?: SelectedTemplate }) {
  const color = settings?.themeColor || "#6366f1";
  const fontClass = settings?.fontFamily === "serif" ? "font-serif" : settings?.fontFamily === "mono" ? "font-mono" : "font-sans";
  const fullName = getFullName(resume) || "Your Name";
  const initials = (fullName.match(/\b[A-Za-z]/g) || []).slice(0, 2).join("").toUpperCase() || "YN";
  const contact = [
    { label: "Email", value: resume.email },
    { label: "Phone", value: resume.phone },
    { label: "Loc", value: resume.location },
    { label: "Web", value: resume.website }
  ].filter((item) => item.value);

  // Simple logic to generate a gradient based on the theme color
  const sidebarBg = settings?.themeColor 
    ? `linear-gradient(160deg, ${color}cc 0%, ${color} 55%, ${color}ee 100%)`
    : "linear-gradient(160deg, #4338ca 0%, #6366f1 55%, #8b5cf6 100%)";

  return (
    <div
      className={`${fontClass} overflow-hidden`}
      style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#ffffff", display: "flex" }}
    >
      {/* Sidebar with gradient + photo placeholder */}
      <aside
        style={{
          width: "70mm",
          background: sidebarBg,
          color: "#ffffff",
          padding: "18mm 12mm"
        }}
        className="flex-shrink-0"
      >
        {/* Avatar / initials placeholder */}
        <div
          className="flex items-center justify-center rounded-full border-[3px] border-white/40 bg-white/15 text-[22px] font-bold text-white shadow-[0_8px_18px_-6px_rgba(0,0,0,0.35)]"
          style={{ height: "26mm", width: "26mm" }}
        >
          {initials}
        </div>

        <div className="mt-5">
          <h1 className="text-[22px] font-extrabold leading-[1.1] tracking-tight text-white break-words">
            {fullName}
          </h1>
          <p className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/80 break-words">
            {resume.title || "Professional Title"}
          </p>
        </div>

        {contact.length > 0 && (
          <SidebarSection title="Contact">
            <div className="space-y-2">
              {contact.map((item) => (
                <div key={item.label}>
                  <p className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-white/60">
                    {item.label}
                  </p>
                  <p className="break-all text-[10px] text-white overflow-hidden">{item.value}</p>
                </div>
              ))}
            </div>
          </SidebarSection>
        )}

        {resume.skills.length > 0 && (
          <SidebarSection title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white/15 px-2 py-1 text-[9px] font-semibold text-white break-words"
                >
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
                  <p className="text-[10.5px] font-bold text-white break-words">{edu.school || "School"}</p>
                  <p className="text-[10px] text-white/80 break-words">{edu.degree || "Degree"}</p>
                  <p className="mt-0.5 text-[9px] text-white/60 whitespace-nowrap">
                    {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                    {edu.location && ` · ${edu.location}`}
                  </p>
                </div>
              ))}
            </div>
          </SidebarSection>
        )}
      </aside>

      {/* Main column */}
      <main style={{ flex: 1, padding: "20mm 18mm", backgroundColor: "#fafaff" }} className="min-w-0">
        {resume.summary && (
          <MainSection title="About" color={color}>
            <p className="text-[10.5px] leading-[1.7] text-[#1f2937] break-words">{resume.summary}</p>
          </MainSection>
        )}

        <MainSection title="Experience" color={color}>
          {resume.experiences.length === 0 ? (
            <p className="text-[10.5px] italic text-[#94a3b8]">Experience entries will appear here.</p>
          ) : (
            <div className="space-y-4">
              {resume.experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-[0_2px_8px_-4px_rgba(67,56,202,0.12)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-x-3">
                    <h3 className="flex-1 text-[12px] font-bold text-[#1f2937] break-words">{exp.role || "Role Title"}</h3>
                    <span className="shrink-0 text-[9.5px] font-semibold uppercase tracking-wider whitespace-nowrap mt-0.5" style={{ color: color }}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] break-words" style={{ color: color }}>
                    <span className="font-semibold">{exp.company || "Company"}</span>
                    {exp.location && <span className="font-normal text-[#6b7280]"> · {exp.location}</span>}
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
        </MainSection>
      </main>
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white">{title}</h2>
      <div className="mb-3 h-px w-9 bg-white/40" />
      {children}
    </section>
  );
}

function MainSection({ title, children, color }: { title: string; children: React.ReactNode; color: string }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.22em]" style={{ color: color }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
