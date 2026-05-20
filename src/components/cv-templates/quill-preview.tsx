import type { ResumeData, SelectedTemplate } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";

// Quill — refined classical serif. For legal, academic, finance,
// and other contexts where a traditional, dignified register works
// better than something obviously "modern".
export function QuillPreview({ resume, settings }: { resume: ResumeData; settings?: SelectedTemplate }) {
  const color = settings?.themeColor || "#6b5235";
  const fontClass = settings?.fontFamily === "sans" ? "font-sans" : settings?.fontFamily === "mono" ? "font-mono" : "font-serif";
  const fullName = getFullName(resume) || "Your Name";
  const contact = [resume.email, resume.phone, resume.location, resume.website].filter(Boolean);

  return (
    <div
      className={`${fontClass} text-[#1f2937] overflow-hidden`}
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "22mm 24mm",
        backgroundColor: "#ffffff"
      }}
    >
      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-10 bg-opacity-40" style={{ backgroundColor: color }} />
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: color }}>
            Curriculum Vitae
          </p>
          <div className="h-px w-10 bg-opacity-40" style={{ backgroundColor: color }} />
        </div>
        <h1 className="text-[38px] font-normal leading-none tracking-[0.02em] text-[#1f2937] break-words">
          {fullName}
        </h1>
        <p className="mt-4 text-[13px] italic text-[#4b5563] break-words tracking-wide">
          {resume.title || "Professional Title"}
        </p>
        {contact.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] text-[#4b5563] uppercase tracking-widest font-medium">
            {contact.map((item, i) => (
              <span key={item} className="flex items-center gap-6">
                {i > 0 && <span className="flex-shrink-0" style={{ color: color, opacity: 0.3 }}>◆</span>}
                <span className="break-all overflow-hidden">{item}</span>
              </span>
            ))}
          </div>
        )}
      </header>

      {resume.summary && (
        <p className="mb-7 text-justify text-[11px] leading-[1.7] text-[#1f2937] indent-[6mm] break-words">
          {resume.summary}
        </p>
      )}

      <Section title="Professional Experience" color={color}>
        {resume.experiences.length === 0 ? (
          <p className="text-[11px] italic text-[#9ca3af]">Experience entries will appear here.</p>
        ) : (
          <div className="space-y-5">
            {resume.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex flex-wrap items-start justify-between gap-x-4">
                  <h3 className="flex-1 text-[13px] font-bold tracking-tight text-[#1f2937] break-words">
                    {exp.role || "Role Title"}
                  </h3>
                  <span className="shrink-0 text-[10.5px] italic text-[#6b7280] whitespace-nowrap mt-0.5">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-[11.5px] italic text-[#4b5563] break-words">
                  {exp.company || "Company"}
                  {exp.location && <span> — {exp.location}</span>}
                </p>
                <ul className="mt-2 list-['—__'] space-y-1.5 pl-5">
                  {exp.bullets.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[11px] leading-[1.65] text-[#1f2937] break-words">
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
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[12.5px] font-bold tracking-tight text-[#1f2937]">
                    {edu.school || "School"}
                  </h3>
                  <span className="text-[10.5px] italic text-[#6b7280]">
                    {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                  </span>
                </div>
                <p className="text-[11px] italic text-[#4b5563]">
                  {edu.degree || "Degree"}
                  {edu.location && <span> — {edu.location}</span>}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {resume.skills.length > 0 && (
        <Section title="Areas of Expertise" color={color}>
          <p className="text-justify text-[11px] leading-[1.7] text-[#1f2937]">
            {resume.skills.join("  ·  ")}
          </p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children, color }: { title: string; children: React.ReactNode; color: string }) {
  return (
    <section className="mt-10 first:mt-0">
      <div className="mb-6 text-center">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.4em]" style={{ color: color }}>
          {title}
        </h2>
        <div className="mt-2 flex items-center justify-center gap-3">
          <div className="h-px w-20 bg-opacity-20" style={{ backgroundColor: color }} />
          <span className="text-[8px] opacity-40" style={{ color: color }}>❦</span>
          <div className="h-px w-20 bg-opacity-20" style={{ backgroundColor: color }} />
        </div>
      </div>
      {children}
    </section>
  );
}
