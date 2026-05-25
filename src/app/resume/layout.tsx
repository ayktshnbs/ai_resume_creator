import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Builder",
  description:
    "Build your professional resume with AI-powered tools, live preview, and 100 ATS-friendly templates. Export polished PDFs in one click.",
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
