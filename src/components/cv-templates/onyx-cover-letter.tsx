import type { ResumeData, CoverLetterData } from "@/types/resume";

export function OnyxCoverLetter({ resume, coverLetter }: { resume: ResumeData, coverLetter: CoverLetterData }) {
  const fullName = `${resume.firstName} ${resume.lastName}`.trim() || "Your Name";

  return (
    <div className="font-sans text-[#0f172a] bg-white p-[20mm]" style={{ width: "210mm", minHeight: "297mm" }}>
      <header className="mb-12 border-b border-outline/40 pb-8">
        <h1 className="text-[32px] font-extrabold tracking-tight text-[#0f172a]">{fullName}</h1>
        <p className="mt-1 text-[13px] font-bold uppercase tracking-[0.16em] text-[#0058bc]">
          {resume.title || "Professional Title"}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 text-[10.5px] text-[#475569]">
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
          {resume.website && <span>{resume.website}</span>}
        </div>
      </header>

      <div className="mb-10 text-[11px] text-[#1e293b]">
        <p>{coverLetter.date}</p>
      </div>

      <div className="mb-10 text-[11px] text-[#1e293b] leading-[1.6]">
        <p className="font-bold text-[#0f172a]">{coverLetter.recipientName}</p>
        <p>{coverLetter.recipientTitle}</p>
        <p>{coverLetter.recipientCompany}</p>
        <p>{coverLetter.recipientAddress}</p>
      </div>

      {coverLetter.subject && (
        <div className="mb-8 text-[11.5px] font-bold text-[#0f172a]">
          RE: {coverLetter.subject}
        </div>
      )}

      <div className="text-[11.5px] leading-[1.8] text-[#1e293b] whitespace-pre-wrap">
        {coverLetter.body || "Your letter body will appear here..."}
      </div>

      <div className="mt-16 text-[11.5px] text-[#1e293b]">
        <p>Sincerely,</p>
        <p className="mt-6 font-bold text-[#0f172a] text-[14px]">{fullName}</p>
      </div>
    </div>
  );
}
