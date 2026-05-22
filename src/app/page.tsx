"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PARAMETRIC_CONFIGS } from "@/components/cv-templates/parametric-template";
import { TemplateRenderer } from "@/components/cv-templates/template-renderer";
import { sampleResume } from "@/components/cv-templates/sample-data";
import { saveSelectedTemplate } from "@/lib/resume-storage";
import type { SelectedTemplate } from "@/types/resume";

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

const ALL_TEMPLATES: TemplateCard[] = [...handcraftedTemplates, ...parametricCards];

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function selectTemplate(t: TemplateCard) {
    saveSelectedTemplate({ name: t.name, layout: t.layout, accent: t.accent, themeColor: t.themeColor });
    router.push("/resume");
  }

  const marqueeTemplates = [...ALL_TEMPLATES, ...ALL_TEMPLATES];

  return (
    <main className="min-h-screen overflow-x-hidden">
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
      `}</style>

      <header className="sticky top-0 z-50 border-b border-outline/50 bg-surface/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-10">
          <a className="text-xl font-bold tracking-tight text-ink" href="#">
            <span className="text-primary">AI</span> CV Builder
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
            <a className="transition-colors hover:text-primary" href="#features">Features</a>
            <a className="transition-colors hover:text-primary" href="/resume">Builder</a>
            <a className="transition-colors hover:text-primary" href="/templates">Templates</a>
            <a className="transition-colors hover:text-primary" href="#pricing">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <a className="hidden rounded-xl px-4 py-2 text-sm font-bold text-ink transition-all hover:bg-surface-soft md:block" href="/signin">
              Sign in
            </a>
            <a className="hidden primary-gradient rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-ambient transition-all hover:shadow-panel hover:brightness-105 active:scale-[0.98] sm:inline-flex" href="/signup">
              Get started free
            </a>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl text-ink transition hover:bg-surface-soft md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
              )}
            </button>
          </div>
        </nav>
        {mobileMenuOpen && (
          <div className="border-t border-outline/30 bg-surface/95 backdrop-blur-xl md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {[
                { label: "Features", href: "#features" },
                { label: "Builder", href: "/resume" },
                { label: "Templates", href: "/templates" },
                { label: "Pricing", href: "#pricing" },
              ].map((link) => (
                <a
                  key={link.label}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-ink transition hover:bg-surface-soft"
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-outline/30 pt-4">
                <a className="rounded-xl px-4 py-3 text-center text-sm font-bold text-ink transition hover:bg-surface-soft" href="/signin">
                  Sign in
                </a>
                <a className="primary-gradient rounded-xl px-4 py-3 text-center text-sm font-bold text-white" href="/signup">
                  Get started free
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-8 pb-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(0,112,235,0.08),transparent_40%),radial-gradient(circle_at_78%_10%,rgba(70,72,212,0.07),transparent_35%),linear-gradient(180deg,#ffffff_0%,#f8faff_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(113,119,134,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(113,119,134,0.04)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
        <div className="mx-auto grid max-w-7xl gap-16 px-4 md:grid-cols-[1fr_1.1fr] md:px-10">
          <div className="flex flex-col justify-center py-10">
            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                New: AI Power-Up
              </span>
              <span className="h-1 w-1 rounded-full bg-outline" />
              <span className="text-xs font-medium text-muted">Trusted by 50k+ job seekers</span>
            </div>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl md:text-7xl">
              The <span className="gradient-text">smarter</span> way to build your resume.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
              Stop fighting with Word. Use professional templates, AI-powered rewrites, and one-click export to land your next interview.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                className="primary-gradient group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-8 py-4 text-center text-base font-bold text-white shadow-panel transition-all hover:shadow-[0_12px_40px_rgba(99,102,241,0.4)] hover:brightness-105 active:scale-[0.98]"
                href="/resume"
              >
                Create your resume — it&apos;s free
                <SvgIcon name="arrow-right" />
              </a>
            </div>
            <div className="mt-12 flex items-center gap-8 border-t border-outline/30 pt-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-4 border-white bg-surface-soft shadow-sm" />
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-primary text-[10px] font-bold text-white shadow-sm">+</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-warning">
                  {[1, 2, 3, 4, 5].map((i) => <SvgIcon key={i} className="h-4 w-4" name="star" />)}
                </div>
                <p className="mt-1 text-sm text-muted"><strong>4.9/5</strong> from our community</p>
              </div>
            </div>
          </div>
          <div className="relative hidden perspective-1000 md:flex md:items-center md:justify-center">
            <div className="animate-float w-full max-w-[380px] lg:max-w-[420px]">
              <HeroPreview />
            </div>
            <div className="absolute -left-12 bottom-12 h-32 w-32 animate-float-delay rounded-3xl bg-primary/10 blur-2xl" />
            <div className="absolute -right-8 top-12 h-40 w-40 animate-float rounded-full bg-secondary/10 blur-3xl" />
          </div>
        </div>
      </section>

      {/* All templates showcase — dark background */}
      <section className="overflow-hidden bg-[#0f1117] py-20" id="templates">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="max-w-xl">
              <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">Templates</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">Designed for every career stage.</h2>
              <p className="mt-3 text-sm text-white/50">{ALL_TEMPLATES.length} professionally crafted templates, ready to use.</p>
            </div>
            <a className="group flex items-center gap-2 text-sm font-bold text-white/70 hover:text-primary" href="/templates">
              View all {ALL_TEMPLATES.length} templates
              <SvgIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" name="arrow-right" />
            </a>
          </div>
        </div>

        <div className="relative mt-8">
          <div className="flex animate-marquee gap-6" style={{ width: "max-content" }}>
            {marqueeTemplates.map((tmpl, i) => (
              <div
                key={`${tmpl.name}-${i}`}
                className="w-[180px] flex-shrink-0 cursor-pointer sm:w-[240px]"
                onClick={() => selectTemplate(tmpl)}
              >
                <div className="group relative aspect-[1/1.38] overflow-hidden rounded-2xl border border-white/10 bg-surface transition-all duration-300 hover:-translate-y-3 hover:border-primary/60 hover:shadow-[0_20px_60px_rgba(99,102,241,0.3)]">
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
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface-soft py-24" id="features">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">Everything you need</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Built for precision and speed.</h2>
            <p className="mt-4 text-lg text-muted">A streamlined workflow from draft to download.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article className="card-hover group rounded-3xl bg-surface p-8 shadow-ambient" key={feature.title}>
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} transition-transform group-hover:scale-110`}>
                  <SvgIcon className="h-6 w-6 text-primary" name={feature.icon} />
                </div>
                <h3 className="text-xl font-bold text-ink">{feature.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="py-24" id="management">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-[1fr_1.5fr] md:px-10">
          <div className="flex flex-col justify-center">
            <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-muted">Management</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Keep your career history in one place.</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">Save multiple versions of your CV for different roles. Our dashboard makes it easy to manage, update, and export your documents.</p>
            <div className="mt-10 flex gap-4">
              <a className="primary-gradient rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-panel" href="/resume">
                Create new CV
              </a>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-outline/30 bg-surface-soft p-6 shadow-panel">
            {savedCvs.map(([title, date, score]) => (
              <div className="flex flex-col justify-between gap-4 rounded-2xl bg-surface p-5 shadow-ambient sm:flex-row sm:items-center" key={title}>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <SvgIcon name="document" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink">{title}</h3>
                    <p className="text-xs text-muted">{date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">ATS {score}</span>
                  <div className="h-8 w-px bg-outline/30" />
                  <a className="text-sm font-bold text-primary hover:underline" href="/resume">Edit</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      <footer className="border-t border-outline/20 bg-surface py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:px-10">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <a className="text-xl font-bold tracking-tight text-ink" href="#">
              <span className="text-primary">AI</span> CV Builder
            </a>
            <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-muted">
              <a className="hover:text-primary" href="/resume">Builder</a>
              <a className="hover:text-primary" href="/templates">Templates</a>
              <a className="hover:text-primary" href="/signin">Sign in</a>
              <a className="hover:text-primary" href="/signup">Sign up</a>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-outline/20 pt-8 text-xs text-muted md:flex-row">
            <p>© 2026 AI CV Builder. All rights reserved.</p>
            <p>Made with precision for modern professionals.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

const A4_W = 793;

function HeroPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / A4_W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative">
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-secondary/20 blur-[100px]" />

      <div className="relative rounded-3xl border border-white/80 bg-surface/40 p-3 shadow-2xl backdrop-blur-2xl ring-1 ring-black/[0.05]">
        <div ref={containerRef} className="relative aspect-[1/1.38] w-full overflow-hidden rounded-2xl border border-outline/30 bg-surface shadow-panel">
          {scale > 0 && (
            <div
              style={{
                width: A4_W,
                minHeight: Math.round(A4_W * 1.414),
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
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Simple, honest pricing.</h2>
        <p className="mt-4 text-lg text-muted">Start for free, upgrade when you need the competitive edge.</p>
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-outline/40 bg-surface-soft p-1.5">
          <button
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${!yearly ? "bg-surface text-ink shadow-sm" : "text-muted"}`}
            onClick={() => setYearly(false)}
            type="button"
          >
            Monthly
          </button>
          <button
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${yearly ? "bg-surface text-ink shadow-sm" : "text-muted"}`}
            onClick={() => setYearly(true)}
            type="button"
          >
            Yearly
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">Save 37%</span>
          </button>
        </div>
      </div>
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <PricingCard
          cta="Start free"
          href="/signup"
          features={["1 saved CV", "All standard templates", "Live preview"]}
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
          price={yearly ? "$5" : "$8"}
          period={yearly ? "/mo — billed $60/year" : "/month"}
        />
      </div>
    </section>
  );
}

function PricingCard({ cta, featured = false, features, href, name, price, period }: { cta: string; featured?: boolean; features: string[]; href: string; name: string; price: string; period: string }) {
  return (
    <article className={`card-hover relative flex flex-col rounded-3xl bg-surface p-8 shadow-ambient ${featured ? "border-2 border-primary ring-4 ring-primary/10" : "border border-outline/30"}`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
          Recommended
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-ink">{name}</h3>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-ink">{price}</span>
          <span className="text-sm font-medium text-muted">{period || "/month"}</span>
        </div>
      </div>
      <ul className="mb-10 flex-1 space-y-4 text-sm text-muted">
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
          featured ? "primary-gradient text-white shadow-lg hover:brightness-105" : "bg-surface-soft text-ink hover:bg-outline/20"
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
