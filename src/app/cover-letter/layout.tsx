import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cover Letter Generator",
  description:
    "Generate targeted, professional cover letters from your resume data in seconds. AI-powered writing tailored to each job description.",
};

export default function CoverLetterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
