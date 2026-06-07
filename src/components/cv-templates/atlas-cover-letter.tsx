import type { ResumeData, CoverLetterData } from "@/types/resume";

export function AtlasCoverLetter({ resume, coverLetter }: { resume: ResumeData, coverLetter: CoverLetterData }) {
  const fullName = `${resume.firstName} ${resume.lastName}`.trim() || "Your Name";

  return (
    <div 
      className="font-sans text-[#0f172a] bg-white flex" 
      style={{ width: "210mm", height: "297mm", overflow: "hidden" }}
    >
      {/* Sidebar matching Atlas Resume */}
      <aside 
        style={{ width: "65mm", backgroundColor: "#0f172a", color: "#ffffff", padding: "20mm 10mm" }}
      >
        <div className="mb-10">
          <h1 className="text-[24px] font-extrabold leading-[1.05] tracking-tight" style={{ overflowWrap: "break-word", wordBreak: "break-word", hyphens: "auto" }}>{fullName}</h1>
          <div className="mt-2 h-[3px] w-10 bg-[#2563eb]" />
          <p className="mt-3 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#93c5fd]" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
            {resume.title || "Professional Title"}
          </p>
        </div>

        <div className="space-y-6">
          <div className="border-t border-white/10 pt-6">
            <p className="text-[8.5px] font-semibold uppercase tracking-[0.16em] text-[#94a3b8] mb-4">Contact Info</p>
            <div className="space-y-3 text-[10px] text-white/80">
              {resume.email && <p className="break-words">{resume.email}</p>}
              {resume.phone && <p>{resume.phone}</p>}
              {resume.location && <p>{resume.location}</p>}
              {resume.website && <p className="break-words">{resume.website}</p>}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#ffffff] p-[20mm]">
        <div className="mb-10 text-[11px] text-[#475569]">
          <p>{coverLetter.date}</p>
        </div>

        <div className="mb-10 text-[11px] text-[#1e293b] leading-[1.6]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb] mb-2">Recipient</p>
          <p className="font-bold text-[#0f172a] text-[13px]">{coverLetter.recipientName}</p>
          <p>{coverLetter.recipientTitle}</p>
          <p className="font-semibold">{coverLetter.recipientCompany}</p>
          <p className="text-[#64748b]">{coverLetter.recipientAddress}</p>
        </div>

        {coverLetter.subject && (
          <div className="mb-8 text-[12px] font-extrabold text-[#0f172a]">
            Subject: {coverLetter.subject}
          </div>
        )}

        <div className="text-[11.5px] leading-[1.8] text-[#1e293b] whitespace-pre-wrap">
          {coverLetter.body || "Your letter body will appear here..."}
        </div>

        <div className="mt-16 text-[11.5px] text-[#1e293b]">
          <p>Best regards,</p>
          <p className="mt-6 font-extrabold text-[#0f172a] text-[14px]">{fullName}</p>
        </div>
      </main>
    </div>
  );
}
