import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

const SITE_URL = "https://cv-with-ai.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CV with AI — Build ATS-Friendly Resumes in Minutes",
    template: "%s | CV with AI",
  },
  description:
    "Create professional, ATS-optimized resumes and cover letters with AI-powered tools. 50+ templates, live preview, one-click PDF export. Start free.",
  keywords: [
    "CV builder",
    "resume builder",
    "AI resume",
    "ATS-friendly resume",
    "cover letter generator",
    "professional CV",
    "resume templates",
    "PDF resume",
    "job application",
    "career tools",
  ],
  authors: [{ name: "CV with AI" }],
  creator: "CV with AI",
  publisher: "CV with AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "CV with AI",
    title: "CV with AI — Build ATS-Friendly Resumes in Minutes",
    description:
      "Create professional, ATS-optimized resumes and cover letters with AI-powered tools. 50+ templates, live preview, one-click PDF export.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CV with AI — Professional Resume Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CV with AI — Build ATS-Friendly Resumes in Minutes",
    description:
      "Create professional, ATS-optimized resumes and cover letters with AI-powered tools. Start free.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "CV with AI",
              url: SITE_URL,
              description:
                "Create professional, ATS-optimized resumes and cover letters with AI-powered tools.",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Any",
              offers: [
                {
                  "@type": "Offer",
                  name: "Basic",
                  price: "0",
                  priceCurrency: "EUR",
                  description: "1 CV + 1 cover letter, all standard templates, live preview",
                },
                {
                  "@type": "Offer",
                  name: "Pro",
                  price: "6",
                  priceCurrency: "EUR",
                  description:
                    "Unlimited CVs & cover letters, AI rewrite, cover letter generator, resume scoring, PDF exports",
                },
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "50000",
                bestRating: "5",
              },
            }),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
