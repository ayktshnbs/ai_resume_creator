import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Templates",
  description:
    "Browse 50+ professionally designed resume templates. Modern, classic, and creative layouts optimized for ATS compatibility.",
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
