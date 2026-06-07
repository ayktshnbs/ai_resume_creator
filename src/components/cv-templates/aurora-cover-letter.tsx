import type { ResumeData, CoverLetterData } from "@/types/resume";

// Aurora — warm modern letter with a soft tinted band header and
// rounded card-style content blocks. Friendly but still polished.
// Pairs naturally with design / marketing / startup roles.
export function AuroraCoverLetter({
  resume,
  coverLetter
}: {
  resume: ResumeData;
  coverLetter: CoverLetterData;
}) {
  const fullName = `${resume.firstName} ${resume.lastName}`.trim() || "Your Name";

  return (
    <div className="font-sans text-[#1e293b] bg-white" style={{ width: "210mm", height: "297mm", overflow: "hidden" }}>
      {/* Tinted band header */}
      <header
        style={{
          padding: "20mm 22mm 14mm 22mm",
          backgroundColor: "#f1f5f9",
          borderBottom: "1px solid #e2e8f0"
        }}
      >
        <h1 className="text-[32px] font-extrabold leading-none tracking-tight text-[#0f172a]">
          {fullName}
        </h1>
        <p className="mt-2 text-[13px] font-semibold text-[#4648d4]">
          {resume.title || "Professional Title"}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[10.5px] text-[#475569]">
          {resume.email && <ContactItem label="Email" value={resume.email} />}
          {resume.phone && <ContactItem label="Tel" value={resume.phone} />}
          {resume.location && <ContactItem label="Loc" value={resume.location} />}
          {resume.website && <ContactItem label="Web" value={resume.website} />}
        </div>
      </header>

      <div style={{ padding: "14mm 22mm 22mm 22mm" }}>
        {/* Date + recipient as a single rounded card */}
        <div className="mb-8 rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-[0_2px_8px_-4px_rgba(70,72,212,0.08)]">
          <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-[10.5px] text-[#475569]">
            <span className="font-label text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#4648d4]">
              Sent
            </span>
            <span>{coverLetter.date || "—"}</span>

            <span className="font-label text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#4648d4]">
              To
            </span>
            <span>
              <span className="font-bold text-[#0f172a]">{coverLetter.recipientName || "—"}</span>
              {coverLetter.recipientTitle && (
                <span className="text-[#475569]"> · {coverLetter.recipientTitle}</span>
              )}
            </span>

            {coverLetter.recipientCompany && (
              <>
                <span className="font-label text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#4648d4]">
                  Company
                </span>
                <span className="font-semibold text-[#0f172a]">{coverLetter.recipientCompany}</span>
              </>
            )}

            {coverLetter.recipientAddress && (
              <>
                <span className="font-label text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#4648d4]">
                  Address
                </span>
                <span>{coverLetter.recipientAddress}</span>
              </>
            )}
          </div>
        </div>

        {coverLetter.subject && (
          <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-[#4648d4]/10 px-4 py-1.5 text-[11px] font-bold text-[#4648d4]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4648d4]" />
            {coverLetter.subject}
          </div>
        )}

        <div className="text-[11.5px] leading-[1.8] text-[#1e293b] whitespace-pre-wrap">
          {coverLetter.body || "Your letter body will appear here..."}
        </div>

        <div className="mt-14 text-[11.5px] text-[#1e293b]">
          <p>Warmly,</p>
          <p className="mt-6 text-[16px] font-extrabold text-[#0f172a]">{fullName}</p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#4648d4]">
            {resume.title || "Professional Title"}
          </p>
        </div>
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
