import type { ResumeData } from "@/types/resume";
import { formatDateRange, getFullName } from "./sample-data";

// Obsidian — full dark-mode CV. White-on-near-black with a single
// vibrant accent color. Reads like a premium product spec sheet.
// Aimed at senior tech / creative / design candidates.
export function ObsidianPreview({ resume }: { resume: ResumeData }) {
  const fullName = getFullName(resume) || "Your Name";
  const contact = [resume.email, resume.phone, resume.location, resume.website].filter(Boolean);

  return (
    <div
      className="font-sans text-white"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm 22mm",
        backgroundColor: "#0b0d12"
      }}
    >
      <header className="mb-7 flex items-end justify-between gap-6 border-b border-white/10 pb-5">
        <div>
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.32em] text-[#22d3ee]">
            Curriculum Vitae
          </p>
          <h1 className="mt-2 text-[36px] font-extrabold leading-[1.05] tracking-tight text-white">
            {fullName}
          </h1>
          <p className="mt-1.5 text-[12.5px] font-medium text-[#9ca3af]">
            {resume.title || "Professional Title"}
          </p>
        </div>
        <div className="text-right text-[9.5px] leading-[1.7] text-[#cbd5e1]">
          {contact.length === 0 ? (
            <p>Add contact details</p>
          ) : (
            contact.map((item) => <p key={item}>{item}</p>)
          )}
        </div>
      </header>

      {resume.summary && (
        <Section title="Summary">
          <p className="text-[10.5px] leading-[1.7] text-[#e2e8f0]">{resume.summary}</p>
        </Section>
      )}

      <Section title="Experience">
        {resume.experiences.length === 0 ? (
          <p className="text-[10.5px] italic text-[#64748b]">Experience entries will appear here.</p>
        ) : (
          <div className="space-y-5">
            {resume.experiences.map((exp) => (
              <div key={exp.id} className="relative pl-4">
                <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-[#22d3ee] shadow-[0_0_0_3px_rgba(34,211,238,0.18)]" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-[12.5px] font-bold text-white">{exp.role || "Role Title"}</h3>
                  <span className="text-[9.5px] font-medium uppercase tracking-wider text-[#94a3b8]">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-[#22d3ee]">
                  {exp.company || "Company"}
                  {exp.location && <span className="font-normal text-[#94a3b8]"> · {exp.location}</span>}
                </p>
                <ul className="mt-2 space-y-1">
                  {exp.bullets.filter(Boolean).map((bullet, i) => (
                    <li key={i} className="relative pl-3 text-[10.5px] leading-[1.55] text-[#e2e8f0]">
                      <span className="absolute left-0 top-[7px] h-1 w-1 rounded-full bg-[#64748b]" />
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
          <Section title="Education" embed>
            <div className="space-y-3">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-[11px] font-bold text-white">{edu.school || "School"}</p>
                  <p className="text-[10.5px] text-[#cbd5e1]">{edu.degree || "Degree"}</p>
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
          <Section title="Stack" embed>
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-white/15 bg-white/[0.06] px-2 py-1 text-[9.5px] font-semibold text-[#e2e8f0]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {resume.languages && resume.languages.length > 0 && (
          <Section title="Languages" embed>
            <div className="flex flex-wrap gap-1.5">
              {resume.languages.map((lang) => (
                <span
                  key={lang}
                  className="rounded-md border border-white/15 bg-white/[0.06] px-2 py-1 text-[9.5px] font-semibold text-[#e2e8f0]"
                >
                  {lang}
                </span>
              ))}
            </div>
          </Section>
        )}

        </div>

    </div>
  );
}

function Section({
  title,
  children,
  embed
}: {
  title: string;
  children: React.ReactNode;
  embed?: boolean;
}) {
  return (
    <section className={embed ? "" : "mt-7"}>
      <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#94a3b8]">
        {title}
      </h2>
      {children}
    </section>
  );
}
