import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your resumes, cover letters, and career documents. Track ATS scores and export professional PDFs.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
