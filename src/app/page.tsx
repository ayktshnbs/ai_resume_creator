"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { PARAMETRIC_CONFIGS } from "@/components/cv-templates/parametric-template";
import { TemplateRenderer } from "@/components/cv-templates/template-renderer";
import { sampleResume } from "@/components/cv-templates/sample-data";
import { saveSelectedTemplate } from "@/lib/resume-storage";
import type { SelectedTemplate } from "@/types/resume";
import { cvTemplates, cvTemplateToSelectedTemplate } from "@/templates/cvTemplates";

type TemplateCard = SelectedTemplate & {
  text: string;
  category: string;
};

const handcraftedTemplates: TemplateCard[] = [
  { name: "Modern Minimalist", text: "Clean single-column with whitespace focus.", accent: "primary", layout: "single", category: "Single Column" },
  { name: "Professional Serif", text: "Traditional layout for executive roles.", accent: "ink", layout: "classic", category: "Classic" },
  { name: "Creative Tech", text: "Two-column layout for tech professionals.", accent: "secondary", layout: "twoColumn", category: "Two Column" },
  { name: "Lumina Compact", text: "Dense but breathable layout.", accent: "primaryBright", layout: "compact", category: "Compact" },
  { name: "Startup Operator", text: "Modern SaaS profile with metrics.", accent: "success", layout: "twoColumn", category: "Two Column" },
  { name: "Graduate Clean", text: "Entry-level template with clarity.", accent: "warning", layout: "single", category: "Single Column" },
  { name: "Executive Impact", text: "High-end for senior leadership.", accent: "ink", layout: "classic", category: "Classic" },
  { name: "Academic Classic", text: "Structured for researchers.", accent: "primary", layout: "single", category: "Single Column" },
  { name: "Obsidian Dark", text: "Dark-themed two-column design.", accent: "secondary", layout: "twoColumn", category: "Two Column" },
  { name: "Helix Modern", text: "Sleek contemporary layout.", accent: "primaryBright", layout: "single", category: "Single Column" },
];

const parametricCards: TemplateCard[] = PARAMETRIC_CONFIGS.map((c) => ({
  name: c.name,
  text: c.desc,
  accent: "primary",
  layout: c.pdfLayout,
  themeColor: c.color,
  category: "Parametric",
}));

const registryCards: TemplateCard[] = cvTemplates.map((template) => ({
  ...cvTemplateToSelectedTemplate(template),
  text: template.description,
  category: template.category,
}));

const ALL_TEMPLATES: TemplateCard[] = [...handcraftedTemplates, ...parametricCards, ...registryCards];

const features = [
  { title: "AI CV Enhancement", text: "Rewrite weak bullets into professional, ATS-friendly achievements with one click.", icon: "sparkle", gradient: "from-primary/10 to-primary/5" },
  { title: "Live Template Preview", text: "Edit your details while the CV preview updates beside the form in real time.", icon: "document", gradient: "from-secondary/10 to-secondary/5" },
  { title: "Cover Letter Generator", text: "Generate targeted cover letters from your saved CV data in seconds.", icon: "cl", gradient: "from-success/10 to-success/5" },
  { title: "PDF Export", text: "Export polished A4 PDFs that match your chosen template exactly.", icon: "pdf", gradient: "from-warning/10 to-warning/5" },
];

const savedCvs = [
  ["Product Manager CV", "Updated today", "ATS 92"],
  ["SaaS Founder Resume", "2 days ago", "ATS 88"],
  ["Consulting Cover Letter", "Draft", "AI"],
];

export default function Home() {
  const router = useRouter();
  const { lang, setLang } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouse({ x, y });
  }, []);

  function selectTemplate(t: TemplateCard) {
    saveSelectedTemplate({ templateId: t.templateId, name: t.name, layout: t.layout, accent: t.accent, themeColor: t.themeColor });
    router.push("/resume");
  }

  const marqueeTemplates = [...ALL_TEMPLATES, ...ALL_TEMPLATES];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f9fafb]" data-theme="light">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 120s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes float-up {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float { animation: float-up 6s ease-in-out infinite; }
        .animate-float-delay { animation: float-up 6s ease-in-out infinite 2s; }
        .card-hover {
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px) scale(1.015);
          box-shadow: 0 20px 60px rgba(99,102,241,0.15), 0 8px 24px rgba(0,0,0,0.08);
        }
        @keyframes balloon-float-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          20% { transform: translate(70px, -50px) rotate(4deg) scale(1.04); }
          40% { transform: translate(-30px, -90px) rotate(-3deg) scale(0.97); }
          60% { transform: translate(50px, -40px) rotate(2deg) scale(1.03); }
          80% { transform: translate(-50px, -20px) rotate(-2deg) scale(0.98); }
        }
        @keyframes balloon-float-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(-60px, -70px) rotate(-5deg) scale(1.06); }
          50% { transform: translate(40px, -30px) rotate(3deg) scale(0.95); }
          75% { transform: translate(-20px, -80px) rotate(-2deg) scale(1.02); }
        }
        @keyframes balloon-float-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1.02); }
          33% { transform: translate(90px, -60px) rotate(6deg) scale(0.94); }
          66% { transform: translate(-50px, -100px) rotate(-4deg) scale(1.05); }
        }
        @keyframes balloon-float-4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(0.98); }
          30% { transform: translate(-80px, -40px) rotate(-3deg) scale(1.05); }
          60% { transform: translate(60px, -70px) rotate(4deg) scale(0.96); }
        }
        @keyframes balloon-float-5 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          20% { transform: translate(40px, -80px) rotate(3deg) scale(1.03); }
          50% { transform: translate(-60px, -50px) rotate(-5deg) scale(0.97); }
          80% { transform: translate(30px, -30px) rotate(2deg) scale(1.01); }
        }
        @keyframes balloon-float-6 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1.01); }
          35% { transform: translate(-40px, -60px) rotate(-4deg) scale(0.95); }
          70% { transform: translate(70px, -40px) rotate(3deg) scale(1.04); }
        }
        @keyframes balloon-wobble {
          0%, 100% { border-radius: 50% 50% 50% 50%; }
          25% { border-radius: 48% 52% 53% 47%; }
          50% { border-radius: 52% 48% 47% 53%; }
          75% { border-radius: 47% 53% 52% 48%; }
        }
        .balloon {
          position: absolute;
          border-radius: 50%;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .balloon::before {
          content: '';
          position: absolute;
          top: 12%;
          left: 18%;
          width: 35%;
          height: 30%;
          background: radial-gradient(ellipse, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          transform: rotate(-30deg);
        }
        .balloon::after {
          content: '';
          position: absolute;
          bottom: 15%;
          right: 20%;
          width: 15%;
          height: 12%;
          background: radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%);
          border-radius: 50%;
        }
        .balloon-1 { animation: balloon-float-1 18s ease-in-out infinite, balloon-wobble 8s ease-in-out infinite; }
        .balloon-2 { animation: balloon-float-2 22s ease-in-out infinite, balloon-wobble 10s ease-in-out infinite 1s; }
        .balloon-3 { animation: balloon-float-3 20s ease-in-out infinite, balloon-wobble 9s ease-in-out infinite 2s; }
        .balloon-4 { animation: balloon-float-4 24s ease-in-out infinite, balloon-wobble 11s ease-in-out infinite 0.5s; }
        .balloon-5 { animation: balloon-float-5 19s ease-in-out infinite, balloon-wobble 7s ease-in-out infinite 1.5s; }
        .balloon-6 { animation: balloon-float-6 21s ease-in-out infinite, balloon-wobble 12s ease-in-out infinite 3s; }
        @keyframes hero-fade-up {
          0% { opacity: 0; transform: translateY(30px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes letter-drop {
          0% { opacity: 0; transform: translateY(-40px); }
          60% { opacity: 1; transform: translateY(4px); }
          80% { transform: translateY(-1px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-slide-in {
          0% { opacity: 0; transform: translateX(-40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes hero-scale-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .hero-fade-up { animation: hero-fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        .letter-drop { display: inline-block; animation: letter-drop 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards; opacity: 0; }
        .letter-accent { color: #6366f1; }
        .hero-delay-1 { animation-delay: 0.1s; }
        .hero-delay-2 { animation-delay: 0.25s; }
        .hero-delay-3 { animation-delay: 0.45s; }
        .hero-delay-4 { animation-delay: 0.65s; }
        .hero-delay-5 { animation-delay: 0.85s; }
        .hero-slide-in { animation: hero-slide-in 0.7s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        .hero-scale-in { animation: hero-scale-in 0.6s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        .shimmer-text {
          background: linear-gradient(90deg, #2563eb 0%, #6366f1 30%, #0ea5e9 50%, #6366f1 70%, #2563eb 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      <header className="sticky top-0 z-50">
        {/* Glassmorphic background with color tint */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(239,246,255,0.7),rgba(238,242,255,0.7))] backdrop-blur-2xl" />
        {/* Rainbow gradient bottom border */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#3b82f6]/0 via-[#6366f1]/40 to-[#ec4899]/0" />
        {/* Subtle top glow */}
        <div className="absolute inset-x-0 -bottom-8 h-8 bg-gradient-to-b from-[#6366f1]/[0.04] to-transparent" />
        <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-10">
          <a className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-[#111827]" href="#">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#3b82f6] text-xs font-extrabold text-white shadow-lg shadow-[#6366f1]/25">
              CV
            </span>
            <span className="bg-gradient-to-r from-[#111827] to-[#6366f1] bg-clip-text text-transparent">
              CV with AI
            </span>
          </a>
          <div className="hidden items-center md:flex">
            <div className="flex items-center gap-1 rounded-full border border-white/60 bg-white/40 px-2 py-1.5 shadow-sm backdrop-blur-sm">
              {[
                { label: "Features", href: "#features" },
                { label: "Builder", href: "/resume" },
                { label: "Templates", href: "/templates" },
                { label: "Pricing", href: "#pricing" },
              ].map((link) => (
                <a
                  key={link.label}
                  className="rounded-full px-4 py-1.5 text-sm font-medium text-[#4b5563] transition-all hover:bg-white/80 hover:text-[#111827] hover:shadow-sm"
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setLang(lang === "en" ? "tr" : "en")}
              className="rounded-full border border-white/50 bg-white/30 px-3 py-1.5 text-xs font-bold text-[#6b7280] backdrop-blur-sm transition-all hover:bg-white/60 hover:text-[#111827]"
            >
              {lang === "en" ? "TR" : "EN"}
            </button>
            <a className="hidden rounded-full px-4 py-2 text-sm font-bold text-[#4b5563] transition-all hover:text-[#111827] md:block" href="/signin">
              Sign in
            </a>
            <a className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 transition-all hover:shadow-xl hover:shadow-[#6366f1]/30 hover:brightness-105 active:scale-[0.97] sm:inline-flex" href="/signup">
              Get started free
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </a>
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/40 text-[#111827] backdrop-blur-sm transition hover:bg-white/70 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {/* Animated hamburger → X */}
              <span className="relative block h-3.5 w-5">
                <span
                  className={`absolute left-0 block h-[2px] w-full rounded-full bg-current transition-all duration-300 ${
                    mobileMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 block h-[2px] w-full -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[2px] w-full rounded-full bg-current transition-all duration-300 ${
                    mobileMenuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu — full-screen overlay with slide-down panel.
          Rendered outside the sticky <header> so the backdrop covers the page. */}
      <div
        className={`fixed inset-0 z-[60] md:hidden ${mobileMenuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          className={`absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <nav
          className={`absolute inset-x-3 top-3 origin-top rounded-3xl border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,255,0.96))] p-5 shadow-2xl ring-1 ring-black/[0.04] backdrop-blur-xl transition-all duration-300 ease-out ${
            mobileMenuOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-2 scale-[0.98] opacity-0"
          }`}
          aria-label="Primary"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-base font-bold text-[#111827]">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#3b82f6] text-[10px] font-extrabold text-white shadow-md shadow-[#6366f1]/25">
                CV
              </span>
              Menu
            </span>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#4b5563] transition hover:bg-[#e5e7eb] hover:text-[#111827]"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              type="button"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul className="space-y-1">
            {[
              { label: "Features", href: "#features", icon: "sparkle" as const },
              { label: "Builder", href: "/resume", icon: "document" as const },
              { label: "Templates", href: "/templates", icon: "document" as const },
              { label: "Pricing", href: "#pricing", icon: "sparkle" as const }
            ].map((link) => (
              <li key={link.label}>
                <a
                  className="group flex items-center justify-between rounded-2xl px-3 py-3.5 text-[15px] font-semibold text-[#111827] transition hover:bg-[#eef2ff]"
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef2ff] text-[#6366f1] transition group-hover:bg-white">
                      <SvgIcon className="h-4 w-4" name={link.icon} />
                    </span>
                    {link.label}
                  </span>
                  <SvgIcon className="h-4 w-4 text-[#9ca3af] transition group-hover:translate-x-0.5 group-hover:text-[#6366f1]" name="arrow-right" />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-2.5 border-t border-[#e5e7eb] pt-5">
            <a
              className="flex items-center justify-center rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-bold text-[#111827] transition hover:border-[#6366f1]/40 hover:bg-[#f8faff]"
              href="/signin"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign in
            </a>
            <a
              className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#3b82f6] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 transition hover:brightness-105 active:scale-[0.98]"
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get started free
              <SvgIcon className="h-3.5 w-3.5" name="arrow-right" />
            </a>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-8 pb-20 bg-[#f8faff]"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMouse({ x: 0, y: 0 })}
      >
        {/* 3D Water Balloons — softened so they read as ambient depth, not foreground noise */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-70">
          {/* Blue balloon — large */}
          <div
            className="balloon balloon-1"
            style={{
              left: "5%", top: "8%", width: 200, height: 200,
              background: "radial-gradient(circle at 38% 30%, rgba(147,197,253,0.9), rgba(59,130,246,0.7) 50%, rgba(29,78,216,0.5) 80%, rgba(30,64,175,0.3))",
              boxShadow: "inset 0 -20px 40px rgba(30,64,175,0.25), 0 20px 60px rgba(59,130,246,0.2)",
              transform: `translate(${mouse.x * 20}px, ${mouse.y * 15}px)`,
            }}
          />
          {/* Indigo balloon — medium */}
          <div
            className="balloon balloon-2"
            style={{
              right: "8%", top: "5%", width: 160, height: 160,
              background: "radial-gradient(circle at 35% 28%, rgba(199,210,254,0.9), rgba(129,140,248,0.7) 45%, rgba(99,102,241,0.5) 75%, rgba(79,70,229,0.3))",
              boxShadow: "inset 0 -18px 36px rgba(79,70,229,0.25), 0 18px 50px rgba(99,102,241,0.2)",
              transform: `translate(${mouse.x * -15}px, ${mouse.y * 20}px)`,
            }}
          />
          {/* Cyan balloon — large */}
          <div
            className="balloon balloon-3"
            style={{
              left: "25%", bottom: "5%", width: 180, height: 180,
              background: "radial-gradient(circle at 36% 32%, rgba(165,243,252,0.9), rgba(34,211,238,0.65) 48%, rgba(6,182,212,0.45) 78%, rgba(8,145,178,0.25))",
              boxShadow: "inset 0 -18px 38px rgba(8,145,178,0.2), 0 18px 55px rgba(6,182,212,0.18)",
              transform: `translate(${mouse.x * 25}px, ${mouse.y * -18}px)`,
            }}
          />
          {/* Pink balloon — small */}
          <div
            className="balloon balloon-4"
            style={{
              right: "20%", bottom: "15%", width: 120, height: 120,
              background: "radial-gradient(circle at 38% 30%, rgba(251,207,232,0.9), rgba(244,114,182,0.65) 48%, rgba(236,72,153,0.45) 78%, rgba(219,39,119,0.25))",
              boxShadow: "inset 0 -14px 30px rgba(219,39,119,0.2), 0 14px 40px rgba(236,72,153,0.15)",
              transform: `translate(${mouse.x * -30}px, ${mouse.y * 25}px)`,
            }}
          />
          {/* Purple balloon — medium */}
          <div
            className="balloon balloon-5"
            style={{
              left: "55%", top: "12%", width: 140, height: 140,
              background: "radial-gradient(circle at 36% 28%, rgba(233,213,255,0.9), rgba(192,132,252,0.65) 48%, rgba(168,85,247,0.45) 78%, rgba(147,51,234,0.25))",
              boxShadow: "inset 0 -16px 34px rgba(147,51,234,0.2), 0 16px 45px rgba(168,85,247,0.18)",
              transform: `translate(${mouse.x * -20}px, ${mouse.y * 30}px)`,
            }}
          />
          {/* Green balloon — small */}
          <div
            className="balloon balloon-6"
            style={{
              left: "12%", top: "50%", width: 100, height: 100,
              background: "radial-gradient(circle at 38% 30%, rgba(187,247,208,0.9), rgba(74,222,128,0.65) 48%, rgba(34,197,94,0.45) 78%, rgba(22,163,74,0.25))",
              boxShadow: "inset 0 -12px 26px rgba(22,163,74,0.2), 0 12px 35px rgba(34,197,94,0.15)",
              transform: `translate(${mouse.x * 18}px, ${mouse.y * -22}px)`,
            }}
          />
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(113,119,134,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(113,119,134,0.03)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-4 md:grid-cols-[1fr_1.1fr] md:px-10">
          <div className="flex flex-col justify-center py-10">
            <div className="hero-fade-up hero-delay-1 mb-6 inline-flex w-fit items-center gap-2.5 rounded-full border border-[#6366f1]/15 bg-white/70 py-1 pl-1 pr-3 shadow-sm backdrop-blur-sm">
              <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] px-2.5 py-1 font-label text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                <SvgIcon className="h-3 w-3" name="sparkle" />
                New
              </span>
              <span className="text-xs font-semibold text-[#374151]">AI Power-Up is live · 50k+ job seekers building</span>
            </div>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-[#111827] sm:text-5xl md:text-7xl">
              {(() => {
                const words = [
                  { text: "The", accent: false },
                  { text: "smarter", accent: true },
                  { text: "way", accent: false },
                  { text: "to", accent: false },
                  { text: "build", accent: false },
                  { text: "your", accent: false },
                  { text: "resume.", accent: false },
                ];
                let charIndex = 0;
                return words.map((word, wi) => (
                  <span key={wi} className="inline-block whitespace-nowrap">
                    {wi > 0 && <span className="inline-block">&nbsp;</span>}
                    {word.text.split("").map((char, ci) => {
                      const delay = charIndex * 0.045;
                      charIndex++;
                      return (
                        <span
                          key={ci}
                          className={`letter-drop ${word.accent ? "letter-accent" : ""}`}
                          style={{ animationDelay: `${delay}s` }}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                ));
              })()}
            </h1>
            <p className="hero-fade-up hero-delay-3 mt-8 max-w-xl text-lg leading-relaxed text-[#6b7280]">
              Stop fighting with Word. Use professional templates, AI-powered rewrites, and one-click export to land your next interview.
            </p>
            <div className="hero-fade-up hero-delay-4 mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                className="primary-gradient group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-8 py-4 text-center text-base font-bold text-white shadow-panel transition-all hover:shadow-[0_12px_40px_rgba(99,102,241,0.4)] hover:brightness-105 active:scale-[0.98]"
                href="/resume"
              >
                Create your resume — it&apos;s free
                <SvgIcon name="arrow-right" />
              </a>
              <a
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#e5e7eb] bg-white px-8 py-4 text-center text-base font-bold text-[#111827] transition-all hover:border-primary/40 hover:bg-[#f3f4f6] active:scale-[0.98]"
                href="/templates"
              >
                Browse templates
              </a>
            </div>
            <div className="hero-fade-up hero-delay-5 mt-12 flex items-center gap-8 border-t border-[#e5e7eb]/60 pt-8">
              <div className="flex -space-x-3">
                {["SM", "JK", "AR", "LW"].map((initials, i) => (
                  <div key={i} className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[#f8faff] bg-primary/10 text-[11px] font-bold text-primary shadow-sm">
                    {initials}
                  </div>
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[#f8faff] bg-primary text-[10px] font-bold text-white shadow-sm">50k+</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-warning">
                  {[1, 2, 3, 4, 5].map((i) => <SvgIcon key={i} className="h-4 w-4" name="star" />)}
                </div>
                <p className="mt-1 text-sm text-[#6b7280]"><strong className="text-[#111827]">4.9/5</strong> from our community</p>
              </div>
            </div>
          </div>
          <div className="relative hidden md:flex md:items-center md:justify-center" style={{ perspective: "1200px" }}>
            <div className="animate-float w-full max-w-[420px] lg:max-w-[460px]" style={{ transform: "rotateY(-6deg) rotateX(2deg)" }}>
              <HeroPreview />
            </div>
            <div className="absolute -left-12 bottom-12 h-32 w-32 animate-float-delay rounded-3xl bg-primary/10 blur-2xl" />
            <div className="absolute -right-8 top-12 h-40 w-40 animate-float rounded-full bg-secondary/10 blur-3xl" />
          </div>
        </div>
      </section>

      {/* All templates showcase — dark background */}
      <LazyTemplateMarquee templates={marqueeTemplates} onSelect={selectTemplate} totalCount={ALL_TEMPLATES.length} />

      {/* Features — Bento grid */}
      <section className="relative overflow-hidden py-28" id="features">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8faff] via-[#eef2ff] to-[#f8faff]" />
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-[#6366f1]/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-[#3b82f6]/[0.05] blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-10">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 px-4 py-1.5">
              <SvgIcon className="h-3.5 w-3.5 text-[#6366f1]" name="sparkle" />
              <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#6366f1]">Everything you need</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#111827] sm:text-5xl">Built for precision<br className="hidden sm:block" /> and speed.</h2>
            <p className="mt-5 text-lg leading-relaxed text-[#6b7280]">A streamlined workflow from draft to download — no learning curve.</p>
          </div>

          {/* Bento Grid */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 — AI Enhancement (large) */}
            <article className="card-hover group relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-8 shadow-lg backdrop-blur-sm lg:col-span-2">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#6366f1]/10 to-[#3b82f6]/5 blur-3xl transition-transform duration-700 group-hover:scale-150" />
              <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#3b82f6] shadow-lg shadow-[#6366f1]/25 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <SvgIcon className="h-7 w-7 text-white" name="sparkle" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#111827]">AI CV Enhancement</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">Rewrite weak bullets into professional, ATS-friendly achievements with one click. Our AI analyzes job descriptions and optimizes your content for maximum impact.</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["ATS Optimization", "Smart Rewrite", "Keyword Match"].map((tag) => (
                      <span key={tag} className="rounded-full bg-[#6366f1]/5 px-3 py-1 text-[11px] font-bold text-[#6366f1]">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Mini mockup */}
              <div className="relative z-10 mt-6 overflow-hidden rounded-2xl border border-[#e5e7eb]/50 bg-[#f8fafc] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/60" />
                  </div>
                  <div className="h-5 flex-1 rounded bg-[#e5e7eb]/50" />
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#fef2f2] p-3">
                    <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-[#ef4444]">Before</p>
                    <p className="text-[11px] leading-relaxed text-[#6b7280]">Managed social media accounts for the company.</p>
                  </div>
                  <div className="rounded-xl bg-[#f0fdf4] p-3">
                    <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-[#16a34a]">After — AI</p>
                    <p className="text-[11px] leading-relaxed text-[#111827]">Grew social engagement by 156% across 4 platforms in 6 months.</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 2 — Live Preview */}
            <article className="card-hover group relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-8 shadow-lg backdrop-blur-sm">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br from-[#8b5cf6]/10 to-[#6366f1]/5 blur-3xl transition-transform duration-700 group-hover:scale-150" />
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] shadow-lg shadow-[#8b5cf6]/25 transition-transform group-hover:scale-110 group-hover:-rotate-3">
                  <SvgIcon className="h-6 w-6 text-white" name="document" />
                </div>
                <h3 className="text-xl font-bold text-[#111827]">Live Template Preview</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">Edit your details while the CV preview updates beside the form in real time. What you see is what you export.</p>
                {/* Mini preview mockup */}
                <div className="mt-6 flex gap-2">
                  <div className="flex-1 rounded-xl border border-[#e5e7eb]/50 bg-[#f8fafc] p-3">
                    <div className="space-y-2">
                      <div className="h-2 w-3/4 rounded bg-[#e5e7eb]" />
                      <div className="h-2 w-full rounded bg-[#6366f1]/20" />
                      <div className="h-2 w-2/3 rounded bg-[#e5e7eb]" />
                    </div>
                  </div>
                  <div className="flex items-center text-[#6366f1]">
                    <SvgIcon className="h-4 w-4" name="arrow-right" />
                  </div>
                  <div className="flex-1 rounded-xl border border-[#6366f1]/20 bg-white p-3 shadow-sm">
                    <div className="space-y-2">
                      <div className="h-2 w-1/2 rounded bg-[#111827]" />
                      <div className="h-1.5 w-full rounded bg-[#e5e7eb]" />
                      <div className="h-1.5 w-4/5 rounded bg-[#e5e7eb]" />
                      <div className="h-1.5 w-3/5 rounded bg-[#e5e7eb]" />
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 3 — Cover Letter */}
            <article className="card-hover group relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-8 shadow-lg backdrop-blur-sm">
              <div className="absolute -left-16 -bottom-16 h-44 w-44 rounded-full bg-gradient-to-br from-[#10b981]/10 to-[#06b6d4]/5 blur-3xl transition-transform duration-700 group-hover:scale-150" />
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10b981] to-[#06b6d4] shadow-lg shadow-[#10b981]/25 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <SvgIcon className="h-6 w-6 text-white" name="cl" />
                </div>
                <h3 className="text-xl font-bold text-[#111827]">Cover Letter Generator</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">Generate targeted cover letters from your saved CV data in seconds. Perfectly matched to each job posting.</p>
                <div className="mt-6 space-y-2">
                  {["Paste job description", "AI generates draft", "Customize & export"].map((step, i) => (
                    <div key={step} className="flex items-center gap-3 rounded-xl bg-[#f0fdf4]/80 px-3 py-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-[10px] font-bold text-white">{i + 1}</span>
                      <span className="text-xs font-medium text-[#111827]">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* Card 4 — PDF Export (large) */}
            <article className="card-hover group relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-8 shadow-lg backdrop-blur-sm lg:col-span-2">
              <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#f59e0b]/10 to-[#f97316]/5 blur-3xl transition-transform duration-700 group-hover:scale-150" />
              <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#f97316] shadow-lg shadow-[#f59e0b]/25 transition-transform group-hover:scale-110 group-hover:-rotate-3">
                  <SvgIcon className="h-7 w-7 text-white" name="pdf" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#111827]">Pixel-perfect PDF Export</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">Export polished A4 PDFs that match your chosen template exactly. High-resolution output ready for recruiters and ATS systems.</p>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                      { label: "Resolution", value: "300 DPI" },
                      { label: "Format", value: "A4 PDF" },
                      { label: "Quality", value: "Print-ready" },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl bg-[#fffbeb]/80 p-3 text-center">
                        <p className="text-lg font-extrabold text-[#f59e0b]">{stat.value}</p>
                        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Before → After Showcase */}
      <section className="py-24" id="before-after">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">AI Power</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">See the difference AI makes.</h2>
            <p className="mt-4 text-lg text-[#6b7280]">One click transforms weak bullet points into professional, achievement-driven statements.</p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {/* Before */}
            <div className="relative rounded-3xl border border-[#fca5a5]/30 bg-[#fef2f2] p-8">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#fecaca]/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#dc2626]">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Before
              </div>
              <div className="space-y-5">
                {[
                  { title: "Work Experience", text: "Worked on marketing campaigns and helped the team with various projects and tasks." },
                  { title: "Skills", text: "Good at communication, teamwork, and problem solving. Used Excel and PowerPoint." },
                  { title: "Achievement", text: "Was responsible for social media accounts and posting content regularly." },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl bg-white/60 p-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9ca3af]">{item.title}</p>
                    <p className="text-sm leading-relaxed text-[#6b7280]">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#ef4444]">
                <span className="rounded-full bg-[#fecaca] px-3 py-1 text-xs">ATS Score: 34</span>
                <span className="text-xs text-[#9ca3af]">Likely filtered out</span>
              </div>
            </div>
            {/* After */}
            <div className="relative rounded-3xl border border-[#86efac]/30 bg-[#f0fdf4] p-8">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#bbf7d0]/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#16a34a]">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                After — AI Enhanced
              </div>
              <div className="space-y-5">
                {[
                  { title: "Work Experience", text: "Spearheaded 12 cross-channel marketing campaigns, driving a 34% increase in qualified leads and reducing CPA by 18%." },
                  { title: "Skills", text: "Strategic communications, cross-functional leadership, data-driven decision making. Proficient in Excel (VLOOKUP, pivot tables), PowerPoint, and HubSpot CRM." },
                  { title: "Achievement", text: "Grew organic social media engagement by 156% in 6 months, managing a content calendar of 40+ weekly posts across 4 platforms." },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl bg-white/60 p-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#6b7280]">{item.title}</p>
                    <p className="text-sm leading-relaxed text-[#111827]">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#16a34a]">
                <span className="rounded-full bg-[#bbf7d0] px-3 py-1 text-xs">ATS Score: 92</span>
                <span className="text-xs text-[#6b7280]">Interview-ready</span>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#3b82f6] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 transition-all hover:shadow-xl hover:brightness-105 active:scale-[0.98]" href="/resume">
              Try AI enhancement free
              <SvgIcon className="h-4 w-4" name="arrow-right" />
            </a>
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="relative overflow-hidden py-28" id="management">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]" />
        {/* Decorative blobs */}
        <div className="absolute left-0 top-1/4 h-[400px] w-[400px] rounded-full bg-[#6366f1]/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-[#3b82f6]/10 blur-[100px]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-10">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            {/* Left — text */}
            <div>
              <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
                <SvgIcon className="h-3.5 w-3.5 text-[#818cf8]" name="document" />
                <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#818cf8]">Smart Management</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Your career<br />command center.</h2>
              <p className="mt-6 text-lg leading-relaxed text-white/50">Save multiple versions of your CV for different roles. Manage, update, score, and export — all from one dashboard.</p>

              <div className="mt-10 grid grid-cols-3 gap-4">
                {[
                  { value: String(ALL_TEMPLATES.length), label: "Templates" },
                  { value: "92%", label: "Avg. ATS" },
                  { value: "2min", label: "Setup time" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
                    <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/40">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex gap-4">
                <a className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#3b82f6] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 transition-all hover:shadow-xl hover:brightness-105 active:scale-[0.98]" href="/resume">
                  Create new CV
                  <SvgIcon className="h-4 w-4" name="arrow-right" />
                </a>
                <a className="rounded-2xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white" href="/dashboard">
                  View dashboard
                </a>
              </div>
            </div>

            {/* Right — dashboard mockup */}
            <div className="relative">
              {/* Glow behind the card */}
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[#6366f1]/20 via-transparent to-[#3b82f6]/15 blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1e293b]/80 p-6 shadow-2xl backdrop-blur-xl">
                {/* Window controls */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#ef4444]/60" />
                    <div className="h-3 w-3 rounded-full bg-[#f59e0b]/60" />
                    <div className="h-3 w-3 rounded-full bg-[#22c55e]/60" />
                  </div>
                  <div className="rounded-lg bg-white/5 px-4 py-1">
                    <span className="text-[10px] font-medium text-white/30">cv-with-ai.com/dashboard</span>
                  </div>
                  <div className="w-14" />
                </div>

                {/* Stats row */}
                <div className="mb-5 grid grid-cols-3 gap-3">
                  {[
                    { label: "Resumes", value: "3", icon: "document", color: "from-[#6366f1] to-[#3b82f6]" },
                    { label: "Cover Letters", value: "2", icon: "cl", color: "from-[#10b981] to-[#06b6d4]" },
                    { label: "ATS Score", value: "92", icon: "sparkle", color: "from-[#f59e0b] to-[#f97316]" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${s.color}`}>
                        <SvgIcon className="h-3.5 w-3.5 text-white" name={s.icon} />
                      </div>
                      <p className="text-2xl font-extrabold text-white">{s.value}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Document list */}
                <div className="space-y-3">
                  {[
                    { title: "Product Manager CV", date: "Updated today", score: 92, progress: 92 },
                    { title: "SaaS Founder Resume", date: "2 days ago", score: 88, progress: 88 },
                    { title: "Consulting Cover Letter", date: "Draft", score: null, progress: 45 },
                  ].map((doc) => (
                    <div key={doc.title} className="group flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:border-[#6366f1]/30 hover:bg-white/[0.06]">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#3b82f6]/10">
                          <SvgIcon className="h-5 w-5 text-[#818cf8]" name="document" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{doc.title}</p>
                          <p className="mt-0.5 text-[11px] text-white/30">{doc.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {doc.score ? (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                              <div className="h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#10b981]" style={{ width: `${doc.progress}%` }} />
                            </div>
                            <span className="text-xs font-bold text-[#22c55e]">{doc.score}</span>
                          </div>
                        ) : (
                          <span className="rounded-full bg-[#f59e0b]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#f59e0b]">In Progress</span>
                        )}
                        <button className="rounded-lg bg-white/5 px-3 py-1.5 text-[11px] font-bold text-white/60 transition hover:bg-white/10 hover:text-white">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24" id="testimonials">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">Testimonials</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">Loved by job seekers worldwide.</h2>
            <p className="mt-4 text-lg text-[#6b7280]">See how professionals landed their dream jobs with CV with AI.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sarah Mitchell",
                role: "Product Manager at Spotify",
                text: "I went from zero callbacks to 5 interviews in two weeks. The AI rewrite feature transformed my bullet points from boring to impressive.",
                rating: 5,
                initials: "SM",
                color: "from-[#6366f1] to-[#3b82f6]",
              },
              {
                name: "James Park",
                role: "Software Engineer at Google",
                text: "The ATS score checker was a game-changer. I had no idea my resume was getting filtered out. After optimizing with CV with AI, I finally heard back.",
                rating: 5,
                initials: "JP",
                color: "from-[#ec4899] to-[#f43f5e]",
              },
              {
                name: "Elena Rodriguez",
                role: "Marketing Director at Shopify",
                text: "The cover letter generator saved me hours. It perfectly matched the job description and highlighted my most relevant experience.",
                rating: 5,
                initials: "ER",
                color: "from-[#14b8a6] to-[#06b6d4]",
              },
              {
                name: "David Chen",
                role: "Data Analyst at Amazon",
                text: "I tried 4 other CV builders before this one. The templates are actually modern and the live preview makes editing so much faster.",
                rating: 5,
                initials: "DC",
                color: "from-[#f59e0b] to-[#f97316]",
              },
              {
                name: "Aisha Okonkwo",
                role: "UX Designer at Meta",
                text: "As a career changer, I struggled to present my experience. The AI suggestions helped me frame my transferable skills perfectly.",
                rating: 5,
                initials: "AO",
                color: "from-[#8b5cf6] to-[#a855f7]",
              },
              {
                name: "Marcus Weber",
                role: "Finance Analyst at JPMorgan",
                text: "Clean, professional, and incredibly fast. I built my resume during lunch break and had a PDF ready to send by end of day.",
                rating: 5,
                initials: "MW",
                color: "from-[#10b981] to-[#34d399]",
              },
            ].map((t) => (
              <article key={t.name} className="card-hover flex flex-col rounded-3xl bg-white p-7 shadow-ambient">
                <div className="mb-4 flex items-center gap-1 text-[#f59e0b]">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <SvgIcon key={i} className="h-4 w-4" name="star" />
                  ))}
                </div>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-[#4b5563]">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 border-t border-[#e5e7eb]/40 pt-5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-xs font-bold text-white shadow-sm`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">{t.name}</p>
                    <p className="text-xs text-[#6b7280]">{t.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      <footer className="border-t border-[#e5e7eb]/20 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:px-10">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <a className="text-xl font-bold tracking-tight text-[#111827]" href="#">
              CV with AI
            </a>
            <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-[#6b7280]">
              <a className="hover:text-primary" href="/resume">Builder</a>
              <a className="hover:text-primary" href="/templates">Templates</a>
              <a className="hover:text-primary" href="/pricing">Pricing</a>
              <a className="hover:text-primary" href="/signin">Sign in</a>
              <a className="hover:text-primary" href="/signup">Sign up</a>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 border-t border-[#e5e7eb]/20 pt-8 text-xs font-medium text-[#6b7280]">
            <a className="hover:text-primary" href="/privacy">Privacy Policy</a>
            <a className="hover:text-primary" href="/terms">Terms of Service</a>
            <a className="hover:text-primary" href="/refund">Refund Policy</a>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-[#6b7280] md:flex-row">
            <p>© 2026 CV with AI. All rights reserved.</p>
            <p>Made with precision for modern professionals.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function LazyTemplateMarquee({ templates, onSelect, totalCount }: { templates: TemplateCard[]; onSelect: (t: TemplateCard) => void; totalCount: number }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[#0f1117] py-20" id="templates">
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-xl">
            <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">Templates</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">Designed for every career stage.</h2>
            <p className="mt-3 text-sm text-white/50">{totalCount} professionally crafted templates, ready to use.</p>
          </div>
          <a className="group flex items-center gap-2 text-sm font-bold text-white/70 hover:text-primary" href="/templates">
            View all {totalCount} templates
            <SvgIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" name="arrow-right" />
          </a>
        </div>
      </div>

      <div className="relative mt-8" style={{ minHeight: 340 }}>
        {visible ? (
          <>
            <div className="flex animate-marquee gap-6" style={{ width: "max-content" }}>
              {templates.map((tmpl, i) => (
                <div key={`${tmpl.name}-${i}`} className="w-[180px] flex-shrink-0 cursor-pointer sm:w-[240px]" onClick={() => onSelect(tmpl)}>
                  <div className="group relative aspect-[1/1.38] overflow-hidden rounded-2xl border border-white/10 bg-white transition-all duration-300 hover:-translate-y-3 hover:border-primary/60 hover:shadow-[0_20px_60px_rgba(99,102,241,0.3)]">
                    <div className="absolute inset-0 overflow-hidden">
                      <div style={{ width: "210mm", minHeight: "297mm", transform: "scale(0.302)", transformOrigin: "top left" }}>
                        <TemplateRenderer resume={sampleResume} templateName={tmpl.name} />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                      <p className="text-sm font-bold text-white drop-shadow-lg">{tmpl.name}</p>
                      <p className="mt-1 text-xs font-semibold text-primary">Use this template →</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#0f1117] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#0f1117] to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-primary" />
          </div>
        )}
      </div>
    </section>
  );
}

const A4_W = 793;

function HeroPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [scaledHeight, setScaledHeight] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const cw = el.clientWidth;
      if (cw > 0) setScale(cw / A4_W);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (scale <= 0) return;
    const content = contentRef.current;
    if (!content) return;
    const update = () => setScaledHeight(Math.ceil(content.scrollHeight * scale));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(content);
    return () => ro.disconnect();
  }, [scale]);

  return (
    <div className="relative">
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-secondary/20 blur-[100px]" />

      <div className="relative rounded-3xl border border-white/80 bg-white/40 p-3 shadow-2xl backdrop-blur-2xl ring-1 ring-black/[0.05]">
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden rounded-2xl border border-[#e5e7eb]/30 bg-white shadow-panel"
          style={{
            boxSizing: "content-box",
            height: scaledHeight > 0 ? scaledHeight : undefined,
            aspectRatio: scaledHeight > 0 ? undefined : "210 / 297",
          }}
        >
          {scale > 0 && (
            <div
              ref={contentRef}
              style={{
                width: A4_W,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <TemplateRenderer resume={sampleResume} templateName="Academic Classic" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-10" id="pricing">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">Simple, honest pricing.</h2>
        <p className="mt-4 text-lg text-[#6b7280]">Start for free, upgrade when you need the competitive edge.</p>
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#e5e7eb]/40 bg-[#f3f4f6] p-1.5">
          <button
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${!yearly ? "bg-white text-[#111827] shadow-sm" : "text-[#6b7280]"}`}
            onClick={() => setYearly(false)}
            type="button"
          >
            Monthly
          </button>
          <button
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${yearly ? "bg-white text-[#111827] shadow-sm" : "text-[#6b7280]"}`}
            onClick={() => setYearly(true)}
            type="button"
          >
            Yearly
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">Save 30%</span>
          </button>
        </div>
      </div>
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <PricingCard
          cta="Start free"
          href="/signup"
          features={["1 CV + 1 cover letter", "All standard templates", "Live preview"]}
          name="Basic"
          price="$0"
          period=""
        />
        <PricingCard
          cta="Get started with Pro"
          href="/signup?plan=pro"
          featured
          features={["Unlimited CVs & cover letters", "AI rewrite & optimization", "AI cover letter generator", "Resume analysis & scoring", "High-res PDF exports", "Priority support"]}
          name="Pro"
          price={yearly ? "€2.10" : "€3"}
          originalPrice={yearly ? "€4.20" : "€6"}
          period={yearly ? "/mo — billed €25.20/year" : "/month"}
        />
      </div>
    </section>
  );
}

function PricingCard({ cta, featured = false, features, href, name, price, originalPrice, period }: { cta: string; featured?: boolean; features: string[]; href: string; name: string; price: string; originalPrice?: string; period: string }) {
  return (
    <article className={`card-hover relative flex flex-col rounded-3xl bg-white p-8 shadow-ambient ${featured ? "border-2 border-primary ring-4 ring-primary/10" : "border border-[#e5e7eb]/30"}`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
          Recommended
        </div>
      )}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-[#111827]">{name}</h3>
          {originalPrice && (
            <span className="rounded-full bg-gradient-to-r from-[#ef4444] to-[#f97316] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm">
              50% OFF · LIMITED
            </span>
          )}
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          {originalPrice && (
            <span className="text-xl font-bold text-[#9ca3af] line-through decoration-[#ef4444]/70 decoration-2">{originalPrice}</span>
          )}
          <span className="text-4xl font-extrabold text-[#111827]">{price}</span>
          <span className="text-sm font-medium text-[#6b7280]">{period || "/month"}</span>
        </div>
      </div>
      <ul className="mb-10 flex-1 space-y-4 text-sm text-[#6b7280]">
        {features.map((feature) => (
          <li className="flex items-center gap-3" key={feature}>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
              <SvgIcon className="h-3 w-3" name="sparkle" />
            </div>
            {feature}
          </li>
        ))}
      </ul>
      <a
        href={href}
        className={`block w-full rounded-2xl px-6 py-4 text-center text-sm font-bold transition-all ${
          featured ? "primary-gradient text-white shadow-lg hover:brightness-105" : "bg-[#f3f4f6] text-[#111827] hover:bg-[#e5e7eb]/20"
        }`}
      >
        {cta}
      </a>
    </article>
  );
}


function SvgIcon({ className = "h-5 w-5", name }: { className?: string; name: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {name === "arrow-right" && <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />}
      {name === "sparkle" && <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />}
      {name === "document" && <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />}
      {name === "cl" && <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />}
      {name === "pdf" && <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />}
      {name === "star" && <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" fill="currentColor" />}
    </svg>
  );
}
