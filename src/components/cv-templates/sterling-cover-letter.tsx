import type { ResumeData, CoverLetterData } from "@/types/resume";

export function SterlingCoverLetter({ resume, coverLetter }: { resume: ResumeData, coverLetter: CoverLetterData }) {
  const fullName = `${resume.firstName} ${resume.lastName}`.trim() || "Your Name";

  return (
    <div 
      className="text-[#0f172a] bg-white p-[25mm]" 
      style={{ 
        width: "210mm", 
        minHeight: "297mm",
        fontFamily: "'Garamond', 'Georgia', 'Times New Roman', serif"
      }}
    >
      <header className="mb-14 text-center">
        <h1 className="text-[34px] font-normal leading-none tracking-[0.04em] text-[#0f172a]">{fullName}</h1>
        <p className="mt-3 text-[12.5px] italic text-[#475569]">
          {resume.title || "Professional Title"}
        </p>
        <div className="mx-auto mt-5 flex w-fit items-center gap-3">
          <span className="h-px w-12 bg-[#0f172a]" />
          <span className="text-[10px] uppercase tracking-[0.32em] text-[#6b5235]">Contact</span>
          <span className="h-px w-12 bg-[#0f172a]" />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-1 text-[10.5px] text-[#475569]">
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
        </div>
      </header>

      <div className="mb-12 text-[11.5px] text-[#1e293b]">
        <p>{coverLetter.date}</p>
      </div>

      <div className="mb-12 text-[11.5px] text-[#1e293b] leading-[1.6]">
        <p className="font-bold text-[#0f172a]">{coverLetter.recipientName}</p>
        <p className="italic">{coverLetter.recipientTitle}</p>
        <p className="font-bold">{coverLetter.recipientCompany}</p>
        <p>{coverLetter.recipientAddress}</p>
      </div>

      {coverLetter.subject && (
        <div className="mb-8 text-[12px] font-bold text-[#0f172a] underline underline-offset-4">
          RE: {coverLetter.subject}
        </div>
      )}

      <div className="text-[12px] leading-[1.7] text-[#1e293b] whitespace-pre-wrap text-justify">
        {coverLetter.body || "Your letter body will appear here..."}
      </div>

      <div className="mt-20 text-[12px] text-[#1e293b]">
        <p>Sincerely,</p>
        <p className="mt-8 font-normal text-[#0f172a] text-[16px]">{fullName}</p>
      </div>
    </div>
  );
}
