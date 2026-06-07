import type { ResumeData, CoverLetterData } from "@/types/resume";

// Beacon — bold executive cover letter. Full-width harbor-blue header
// band with strong typography, single accent stripe, and confident
// signature block. Mirrors the Beacon CV template.
export function BeaconCoverLetter({
  resume,
  coverLetter
}: {
  resume: ResumeData;
  coverLetter: CoverLetterData;
}) {
  const fullName = `${resume.firstName} ${resume.lastName}`.trim() || "Your Name";

  return (
    <div className="font-sans bg-white" style={{ width: "210mm", height: "297mm", overflow: "hidden" }}>
      {/* Bold color block header */}
      <header style={{ backgroundColor: "#0b3d5a", color: "#ffffff", padding: "20mm 22mm 16mm 22mm" }}>
        <h1 className="text-[36px] font-extrabold leading-none tracking-tight text-white">{fullName}</h1>
        <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#a4d4ec]">
          {resume.title || "Professional Title"}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-1.5 text-[10.5px] text-[#cfe6f4]">
          {resume.email && <span className="break-words">{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
          {resume.website && <span className="break-words">{resume.website}</span>}
        </div>
      </header>

      <div style={{ padding: "14mm 22mm 22mm 22mm" }}>
        {/* Date + recipient — two columns */}
        <div className="mb-10 grid grid-cols-[1fr_auto] items-start gap-x-10">
          <div className="text-[11px] leading-[1.7] text-[#1e293b]">
            <p className="font-label text-[9px] font-bold uppercase tracking-[0.22em] text-[#0b3d5a]">
              Addressed to
            </p>
            <p className="mt-1 text-[13px] font-bold text-[#0b3d5a]">
              {coverLetter.recipientName || "—"}
            </p>
            <p className="text-[11px]">{coverLetter.recipientTitle}</p>
            <p className="mt-0.5 text-[11.5px] font-semibold text-[#1e293b]">
              {coverLetter.recipientCompany}
            </p>
            {coverLetter.recipientAddress && (
              <p className="text-[10.5px] text-[#64748b]">{coverLetter.recipientAddress}</p>
            )}
          </div>
          <div className="text-right text-[11px] text-[#475569]">
            <p className="font-label text-[9px] font-bold uppercase tracking-[0.22em] text-[#0b3d5a]">
              Date
            </p>
            <p className="mt-1">{coverLetter.date || "—"}</p>
          </div>
        </div>

        {coverLetter.subject && (
          <div className="mb-8 border-l-[3px] border-[#0b3d5a] pl-4">
            <p className="font-label text-[9px] font-bold uppercase tracking-[0.22em] text-[#0b3d5a]">
              Subject
            </p>
            <p className="mt-1 text-[13px] font-extrabold text-[#0f172a]">{coverLetter.subject}</p>
          </div>
        )}

        <div className="text-[11.5px] leading-[1.8] text-[#1f2937] whitespace-pre-wrap">
          {coverLetter.body || "Your letter body will appear here..."}
        </div>

        {/* Signature block with accent stripe */}
        <div className="mt-16 border-t-2 border-[#0b3d5a] pt-5">
          <p className="text-[11.5px] text-[#1e293b]">Sincerely,</p>
          <p className="mt-5 text-[18px] font-extrabold text-[#0b3d5a]">{fullName}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0b3d5a]/70">
            {resume.title || "Professional Title"}
          </p>
        </div>
      </div>
    </div>
  );
}
