import type { ResumeData } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";

// Quill — refined classical serif. For legal, academic, finance,
// and other contexts where a traditional, dignified register works
// better than something obviously "modern".
export function QuillPreview({ resume }: { resume: ResumeData }) {
  const fullName = getFullName(resume) || "Your Name";
  const contact = [resume.email, resume.phone, resume.location, resume.website].filter(Boolean);

  return (
    <div
      className="text-[#1f2937]"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "22mm 24mm",
        backgroundColor: "#ffffff",
        fontFamily: "'Garamond', 'Georgia', 'Times New Roman', serif"
      }}
    >
      <header className="mb-7 text-center">
        <p className="font-label text-[10px] font-semibold uppercase tracking-[0.4em] text-[#6b5235]">
          Curriculum Vitae
        </p>
        <h1 className="mt-3 text-[34px] font-normal leading-none tracking-[0.04em] text-[#1f2937]">
          {fullName}
        </h1>
        <p className="mt-2.5 text-[12.5px] italic text-[#4b5563]">
          {resume.title || "Professional Title"}
        </p>
        <div className="mx-auto mt-4 flex w-fit items-center gap-3">
          <span className="h-px w-12 bg-[#1f2937]" />
          <span className="text-[10px] uppercase tracking-[0.32em] text-[#6b5235]">Profile</span>
          <span className="h-px w-12 bg-[#1f2937]" />
        </div>
        {contact.length > 0 && (
          <p className="mt-3 text-[10.5px] text-[#4b5563]">{contact.join("   ·   ")}</p>
        )}
      </header>

      {resume.summary && (
        <p className="mb-7 text-justify text-[11px] leading-[1.7] text-[#1f2937] indent-[6mm]">
          {resume.summary}
        </p>
      )}

      <Section title="Professional Experience">
        {resume.experiences.length === 0 ? (
          <p className="text-[11px] italic text-[#9ca3af]">Experience entries will appear here.</p>
        ) : (
          <div className="space-y-5">
            {resume.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[13px] font-bold tracking-tight text-[#1f2937]">
                    {exp.role || "Role Title"}
                  </h3>
                  <span className="text-[10.5px] italic text-[#6b7280]">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-[11.5px] italic text-[#4b5563]">
                  {exp.company || "Company"}
                  {exp.location && <span> — {exp.location}</span>}
                </p>
                <ul className="mt-2 list-['—__'] space-y-1.5 pl-5">
                  {exp.bullets.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="text-[11px] leading-[1.65] text-[#1f2937]">
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
        <Section title="Areas of Expertise">
          <p className="text-justify text-[11px] leading-[1.7] text-[#1f2937]">
            {resume.skills.join("  ·  ")}
          </p>
        </Section>
      )}

      {resume.languages.length > 0 && (
        <Section title="Languages">
          <p className="text-justify text-[11px] leading-[1.7] text-[#1f2937]">
            {resume.languages.join("  ·  ")}
          </p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#6b5235]">
          {title}
        </span>
        <span className="h-px flex-1 bg-[#1f2937]/60" />
      </div>
      {children}
    </section>
  );
}
