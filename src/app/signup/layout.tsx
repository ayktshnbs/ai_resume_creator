import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a free CV with AI account. Build professional resumes, generate cover letters, and export polished PDFs.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
