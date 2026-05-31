"use client";

import { useEffect, useRef, useState } from "react";
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

const ISSUE_DATE = "VOL. MMXXVI · NO. 01";

export default function Home() {
  const router = useRouter();
  const { lang, setLang } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function selectTemplate(t: TemplateCard) {
    saveSelectedTemplate({ templateId: t.templateId, name: t.name, layout: t.layout, accent: t.accent, themeColor: t.themeColor });
    router.push("/resume");
  }

  const marqueeTemplates = [...ALL_TEMPLATES, ...ALL_TEMPLATES];

  return (
    <main className="min-h-screen overflow-x-hidden noise-paper text-ink-deep" data-theme="light" style={{ fontFamily: "var(--sans)" }}>
      {/* ─────────── MASTHEAD ─────────── */}
      <header className="relative z-50 noise-paper">
        {/* Top thin date strip */}
        <div className="border-b border-ink-deep/15">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-soft md:px-12">
            <span className="hidden md:inline">{ISSUE_DATE}</span>
            <span className="font-serif italic tracking-normal text-saffron normal-case">— Hand-set for ambitious careers —</span>
            <span className="hidden md:inline">Worldwide · Print &amp; Web</span>
          </div>
        </div>

        {/* Big newspaper masthead */}
        <div className="border-b-[3px] border-ink-deep">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 pt-6 pb-4 md:px-12 md:pt-8 md:pb-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-serif text-[11px] italic text-ink-soft md:text-xs">The Resumé Press</p>
                <a href="#" className="block font-serif text-[44px] font-medium leading-[0.92] tracking-[-0.04em] text-ink-deep sm:text-[60px] md:text-[84px] lg:text-[104px]">
                  CV <em className="italic text-saffron">with</em> AI
                </a>
              </div>
              <div className="hidden flex-col items-end gap-2 pt-2 md:flex">
                <span className="font-serif text-xs italic text-ink-soft">Est. 2026 · Worldwide circulation</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLang(lang === "en" ? "tr" : "en")}
                    className="border border-ink-deep px-3 py-1.5 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-ink-deep transition hover:bg-ink-deep hover:text-paper-soft"
                  >
                    {lang === "en" ? "TR" : "EN"}
                  </button>
                  <a href="/signin" className="border border-ink-deep px-4 py-1.5 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-ink-deep transition hover:bg-ink-deep hover:text-paper-soft">
                    Sign in
                  </a>
                  <a href="/signup" className="bg-ink-deep px-4 py-1.5 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-paper-soft transition hover:bg-saffron">
                    Subscribe →
                  </a>
                </div>
              </div>
              <button
                className="md:hidden inline-flex h-10 w-10 items-center justify-center border border-ink-deep text-ink-deep"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                <span className="relative block h-3.5 w-5">
                  <span className={`absolute left-0 block h-[2px] w-full bg-current transition-all ${mobileMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
                  <span className={`absolute left-0 top-1/2 block h-[2px] w-full -translate-y-1/2 bg-current transition-opacity ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
                  <span className={`absolute left-0 block h-[2px] w-full bg-current transition-all ${mobileMenuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`} />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Nav strip */}
        <div className="border-b border-ink-deep/30">
          <div className="mx-auto hidden max-w-[1400px] items-center justify-between px-12 py-2.5 md:flex">
            <nav className="flex items-center gap-7">
              {[
                { label: "Front Page", href: "#hero", marker: "01" },
                { label: "Anthology", href: "#templates", marker: "02" },
                { label: "Toolkit", href: "#features", marker: "03" },
                { label: "Field Notes", href: "#before-after", marker: "04" },
                { label: "The Desk", href: "#management", marker: "05" },
                { label: "Letters", href: "#testimonials", marker: "06" },
                { label: "Subscribe", href: "#pricing", marker: "07" },
              ].map((link) => (
                <a key={link.label} href={link.href} className="group inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-deep transition hover:text-saffron">
                  <span className="font-serif text-[11px] italic text-saffron normal-case tracking-normal">{link.marker} /</span>
                  {link.label}
                </a>
              ))}
            </nav>
            <span className="font-serif text-xs italic text-ink-soft">A daily edition · One reader at a time</span>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-[60] md:hidden ${mobileMenuOpen ? "" : "pointer-events-none"}`} aria-hidden={!mobileMenuOpen}>
        <div className={`absolute inset-0 bg-ink-deep/40 transition-opacity ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMobileMenuOpen(false)} />
        <nav className={`absolute inset-x-3 top-3 noise-paper border-2 border-ink-deep p-6 transition-all ${mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}>
          <div className="mb-4 flex items-center justify-between border-b border-ink-deep pb-3">
            <p className="font-serif text-2xl text-ink-deep">Menu</p>
            <button className="font-edit text-xs font-bold uppercase tracking-[0.18em] text-ink-deep" onClick={() => setMobileMenuOpen(false)}>Close ×</button>
          </div>
          <ul className="space-y-3">
            {[
              { label: "Front Page", href: "#hero", marker: "01" },
              { label: "Anthology", href: "#templates", marker: "02" },
              { label: "Toolkit", href: "#features", marker: "03" },
              { label: "Field Notes", href: "#before-after", marker: "04" },
              { label: "The Desk", href: "#management", marker: "05" },
              { label: "Letters", href: "#testimonials", marker: "06" },
              { label: "Subscribe", href: "#pricing", marker: "07" },
            ].map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={() => setMobileMenuOpen(false)} className="flex items-baseline gap-3 border-b border-ink-deep/20 py-2.5">
                  <span className="font-serif text-sm italic text-saffron">{link.marker}</span>
                  <span className="font-serif text-2xl text-ink-deep">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-2">
            <a href="/signin" onClick={() => setMobileMenuOpen(false)} className="flex-1 border border-ink-deep px-4 py-3 text-center font-edit text-xs font-bold uppercase tracking-[0.18em] text-ink-deep">Sign in</a>
            <a href="/signup" onClick={() => setMobileMenuOpen(false)} className="flex-1 bg-ink-deep px-4 py-3 text-center font-edit text-xs font-bold uppercase tracking-[0.18em] text-paper-soft">Subscribe</a>
          </div>
        </nav>
      </div>

      {/* ─────────── HERO ─────────── */}
      <section id="hero" className="relative noise-paper">
        <div className="mx-auto max-w-[1400px] px-6 pt-10 pb-16 md:px-12 md:pt-16 md:pb-24">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div className="flex flex-col justify-center">
              {/* Eyebrow with rule */}
              <div className="ink-reveal mb-7 flex items-center gap-4">
                <div className="h-px w-12 bg-ink-deep" />
                <p className="font-serif text-sm italic text-saffron">No. 01 — The Front Page</p>
                <div className="h-px flex-1 bg-ink-deep/30" />
              </div>

              <h1 className="ink-reveal headline-editorial text-[56px] sm:text-[80px] md:text-[104px] lg:text-[116px]" style={{ animationDelay: "0.1s" }}>
                The <em>smarter</em><br />way to build<br />your résumé.
              </h1>

              <p className="ink-reveal mt-9 max-w-xl font-serif text-[19px] leading-[1.45] text-ink-soft" style={{ animationDelay: "0.25s" }}>
                <span className="font-serif italic text-saffron">Stop fighting with Word.</span> Use a print-grade typesetter,
                AI editorials that rewrite your bullets, and one-click export to land your next interview —
                set in the same press that designed this page.
              </p>

              {/* CTAs */}
              <div className="ink-reveal mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.4s" }}>
                <a href="/resume" className="btn-editorial group">
                  Start a new manuscript
                  <span className="font-serif text-base italic">→</span>
                </a>
                <a href="/templates" className="btn-editorial btn-editorial-ghost">
                  Browse the anthology
                </a>
              </div>

              {/* Editorial stats strip */}
              <div className="ink-reveal mt-12 grid grid-cols-3 gap-0 border-y-2 border-ink-deep py-5" style={{ animationDelay: "0.55s" }}>
                {[
                  { num: "50K+", label: "subscribers writing" },
                  { num: "4.9", label: "average reader rating" },
                  { num: String(ALL_TEMPLATES.length), label: "templates in press" },
                ].map((stat, i) => (
                  <div key={stat.label} className={`flex flex-col gap-1 px-4 ${i > 0 ? "border-l border-ink-deep/30" : ""}`}>
                    <p className="font-serif text-[40px] leading-none text-ink-deep md:text-[52px]">{stat.num}</p>
                    <p className="font-serif text-xs italic text-ink-soft">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Byline */}
              <p className="byline mt-6">
                Reported and typeset for ambitious professionals — Worldwide · {new Date().getFullYear()}.
              </p>
            </div>

            {/* Right: framed preview */}
            <div className="relative flex flex-col items-center">
              <div className="w-full max-w-[460px]">
                <div className="mb-2 flex items-end justify-between">
                  <p className="font-serif text-xs italic text-ink-soft">Plate I — Academic Classic, set in Fraunces &amp; Geist</p>
                  <p className="font-serif text-[10px] italic text-saffron">No. 01</p>
                </div>
                <div className="thumb-frame p-3 border-2">
                  <HeroPreview />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="font-serif text-[11px] italic text-ink-soft">— Hand-set example —</p>
                  <p className="font-serif text-[11px] italic text-ink-soft">A4 · 210 × 297 mm</p>
                </div>

                {/* margin notes */}
                <div className="mt-10 grid grid-cols-2 gap-4">
                  <div className="border-l-2 border-saffron pl-3">
                    <p className="font-serif text-[10px] uppercase tracking-[0.2em] text-saffron">Marginalia</p>
                    <p className="font-serif mt-1 text-sm italic text-ink-deep">"Edited my CV during a coffee — landed three callbacks the next week."</p>
                    <p className="mt-2 font-serif text-[11px] italic text-ink-soft">— S. Mitchell, Spotify</p>
                  </div>
                  <div className="border-l-2 border-moss pl-3">
                    <p className="font-serif text-[10px] uppercase tracking-[0.2em] text-moss">Press notes</p>
                    <p className="font-serif mt-1 text-sm italic text-ink-deep">"Finally, a builder that doesn't look generic. The press aesthetic just hits."</p>
                    <p className="mt-2 font-serif text-[11px] italic text-ink-soft">— D. Chen, Amazon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* big rule */}
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="rule-double" />
        </div>
      </section>

      {/* ─────────── ANTHOLOGY (Templates marquee, dark) ─────────── */}
      <LazyTemplateMarquee templates={marqueeTemplates} onSelect={selectTemplate} totalCount={ALL_TEMPLATES.length} />

      {/* ─────────── TOOLKIT (Features) ─────────── */}
      <section id="features" className="noise-paper">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
          {/* Section heading */}
          <div className="mb-14 grid gap-6 md:grid-cols-[2fr_3fr] md:items-end">
            <div>
              <p className="font-serif text-sm italic text-saffron">No. 03 — The Toolkit</p>
              <h2 className="headline-editorial mt-3 text-[44px] sm:text-[60px] md:text-[72px]">
                Built for <em>precision</em><br />and speed.
              </h2>
            </div>
            <div className="md:pl-12">
              <p className="font-serif text-lg italic leading-snug text-ink-soft">
                A streamlined newsroom workflow — from blank page to polished print. No learning curve, no marketing fluff, no purple gradients.
              </p>
              <div className="mt-4 h-px w-full bg-ink-deep/30" />
              <p className="mt-3 font-serif text-xs italic text-ink-soft">Filed under: AI · Typography · Export · Live preview</p>
            </div>
          </div>

          {/* Editorial newspaper bento — 12-col grid */}
          <div className="grid grid-cols-12 gap-px bg-ink-deep border-2 border-ink-deep">
            {/* Feature 01 — AI Editor (big, 8 cols, taller) */}
            <article className="col-span-12 lg:col-span-8 noise-paper p-7 md:p-10">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-sm italic text-saffron">Feature № 01</span>
                <span className="smallcaps text-ink-soft">AI desk</span>
              </div>
              <h3 className="headline-editorial mt-4 text-[40px] leading-[0.95] md:text-[56px]">
                The <em>AI Editor</em><br />rewrites your draft.
              </h3>
              <p className="font-serif dropcap mt-6 max-w-2xl text-[17px] leading-[1.5] text-ink-soft">
                One click and weak bullets become ATS-friendly, achievement-driven sentences. The AI reads the job
                description, hunts for the keywords that pass automated screens, then sets the language so a hiring
                manager actually wants to read it.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="border border-oxblood/30 bg-oxblood/[0.05] p-4">
                  <p className="smallcaps text-oxblood">Before · Manuscript</p>
                  <p className="mt-2 font-serif text-[15px] italic leading-snug text-ink-soft">
                    "Managed social media accounts for the company and posted regularly."
                  </p>
                </div>
                <div className="border border-moss/30 bg-moss/[0.05] p-4">
                  <p className="smallcaps text-moss">After · AI Edit</p>
                  <p className="mt-2 font-serif text-[15px] italic leading-snug text-ink-deep">
                    "Grew social engagement <em className="not-italic text-saffron">+156%</em> across 4 platforms in six months, managing a 40-post weekly cadence."
                  </p>
                </div>
              </div>
            </article>

            {/* Feature 02 — Live Preview (4 cols) */}
            <article className="col-span-12 sm:col-span-6 lg:col-span-4 noise-paper p-7 md:p-10">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-sm italic text-saffron">№ 02</span>
                <span className="smallcaps text-ink-soft">Live press</span>
              </div>
              <h3 className="headline-editorial mt-4 text-[28px] md:text-[34px]">
                Live <em>preview</em>, like a working printer's proof.
              </h3>
              <p className="font-serif mt-4 text-[15px] leading-[1.5] text-ink-soft">
                Edit on the left, watch the page ink itself on the right. What you set is exactly what gets exported.
              </p>
              <div className="mt-6 flex gap-2">
                <div className="flex-1 border border-rule-soft bg-paper p-3">
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-3/4 bg-ink-deep/50" />
                    <div className="h-1.5 w-full bg-saffron/50" />
                    <div className="h-1.5 w-2/3 bg-ink-deep/30" />
                  </div>
                </div>
                <span className="self-center font-serif text-2xl italic text-saffron">→</span>
                <div className="flex-1 border-2 border-ink-deep bg-paper-soft p-3">
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-1/2 bg-ink-deep" />
                    <div className="h-1 w-full bg-ink-deep/30" />
                    <div className="h-1 w-4/5 bg-ink-deep/30" />
                    <div className="h-1 w-3/5 bg-ink-deep/30" />
                  </div>
                </div>
              </div>
            </article>

            {/* Feature 03 — Cover letter */}
            <article className="col-span-12 sm:col-span-6 lg:col-span-4 noise-paper p-7 md:p-10">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-sm italic text-saffron">№ 03</span>
                <span className="smallcaps text-ink-soft">Correspondence</span>
              </div>
              <h3 className="headline-editorial mt-4 text-[28px] md:text-[34px]">
                Tailored <em>cover letters</em>, dictated in seconds.
              </h3>
              <ol className="mt-6 space-y-3">
                {["Paste the listing", "AI drafts your letter", "Edit, sign, post."].map((step, i) => (
                  <li key={step} className="flex items-baseline gap-3 border-b border-ink-deep/15 pb-2.5">
                    <span className="font-serif text-base italic text-saffron">{(i + 1).toString().padStart(2, "0")}</span>
                    <span className="font-serif text-[15px] text-ink-deep">{step}</span>
                  </li>
                ))}
              </ol>
            </article>

            {/* Feature 04 — PDF Export (big, 8 cols) */}
            <article className="col-span-12 lg:col-span-8 noise-paper p-7 md:p-10">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-sm italic text-saffron">Feature № 04</span>
                <span className="smallcaps text-ink-soft">The Press</span>
              </div>
              <h3 className="headline-editorial mt-4 text-[36px] md:text-[48px]">
                Pixel-perfect <em>PDF</em> — printed on the same press as your favourite magazine.
              </h3>
              <p className="font-serif mt-5 max-w-2xl text-[16px] leading-[1.5] text-ink-soft">
                A4 PDFs that match the on-screen preview character-by-character. Hand off to recruiters or feed straight
                into ATS readers — every kern and ligature intact.
              </p>
              <div className="mt-8 grid grid-cols-3 divide-x divide-ink-deep/20 border-y border-ink-deep">
                {[
                  { value: "300", unit: "dpi", label: "Resolution" },
                  { value: "A4", unit: "210×297", label: "Format" },
                  { value: "100%", unit: "vector", label: "Sharpness" },
                ].map((stat) => (
                  <div key={stat.label} className="px-5 py-4 text-center">
                    <p className="font-serif text-[38px] leading-none text-ink-deep md:text-[48px]">{stat.value}</p>
                    <p className="font-serif text-[12px] italic text-saffron">{stat.unit}</p>
                    <p className="smallcaps mt-1 text-ink-soft">{stat.label}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ─────────── FIELD NOTES (Before / After) ─────────── */}
      <section id="before-after" className="relative noise-paper">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
          <div className="mb-12 text-center">
            <p className="font-serif text-sm italic text-saffron">No. 04 — Field Notes</p>
            <h2 className="headline-editorial mx-auto mt-3 max-w-3xl text-[44px] sm:text-[60px] md:text-[76px]">
              See the <em>difference</em><br />a single edit makes.
            </h2>
            <p className="byline mt-4">One click. Same words, transformed into achievement-driven copy.</p>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_auto_1fr]">
            {/* Manuscript */}
            <article className="border-2 border-oxblood/40 bg-oxblood/[0.04] p-7 md:p-10">
              <div className="mb-6 flex items-baseline justify-between">
                <p className="smallcaps text-oxblood">Manuscript · Before</p>
                <p className="font-serif text-xs italic text-oxblood">ATS · 34/100</p>
              </div>
              <div className="space-y-6">
                {[
                  { title: "Work Experience", text: "Worked on marketing campaigns and helped the team with various projects and tasks." },
                  { title: "Skills", text: "Good at communication, teamwork, and problem solving. Used Excel and PowerPoint." },
                  { title: "Achievement", text: "Was responsible for social media accounts and posting content regularly." },
                ].map((item, i) => (
                  <div key={item.title} className={i > 0 ? "border-t border-oxblood/20 pt-5" : ""}>
                    <p className="font-serif text-[11px] italic text-oxblood">§{(i + 1).toString().padStart(2, "0")} — {item.title}</p>
                    <p className="font-serif mt-2 text-[16px] leading-[1.45] italic text-ink-soft">{item.text}</p>
                  </div>
                ))}
              </div>
              <p className="byline mt-6 text-oxblood">— Likely filtered out by automated readers.</p>
            </article>

            {/* Separator with arrow */}
            <div className="my-6 flex items-center justify-center lg:my-0 lg:flex-col lg:px-4">
              <div className="hidden h-px w-full bg-ink-deep lg:h-full lg:w-px" />
              <div className="bg-paper border-2 border-ink-deep px-5 py-3">
                <p className="font-serif text-base italic text-ink-deep">edited by AI <em className="not-italic text-saffron">→</em></p>
              </div>
              <div className="hidden h-px w-full bg-ink-deep lg:h-full lg:w-px" />
            </div>

            {/* AI Edit */}
            <article className="border-2 border-moss/40 bg-moss/[0.04] p-7 md:p-10">
              <div className="mb-6 flex items-baseline justify-between">
                <p className="smallcaps text-moss">After · AI Edit</p>
                <p className="font-serif text-xs italic text-moss">ATS · 92/100</p>
              </div>
              <div className="space-y-6">
                {[
                  { title: "Work Experience", text: "Spearheaded 12 cross-channel campaigns, driving a 34% increase in qualified leads and reducing CPA by 18%." },
                  { title: "Skills", text: "Strategic communications, cross-functional leadership, data-driven decisioning. Proficient in Excel (VLOOKUP, pivot tables), HubSpot CRM." },
                  { title: "Achievement", text: "Grew organic social engagement by 156% in 6 months, managing a content calendar of 40+ weekly posts across 4 platforms." },
                ].map((item, i) => (
                  <div key={item.title} className={i > 0 ? "border-t border-moss/20 pt-5" : ""}>
                    <p className="font-serif text-[11px] italic text-moss">§{(i + 1).toString().padStart(2, "0")} — {item.title}</p>
                    <p className="font-serif mt-2 text-[16px] leading-[1.45] text-ink-deep">{item.text}</p>
                  </div>
                ))}
              </div>
              <p className="byline mt-6 text-moss">— Interview-ready. Sent straight to the recruiter.</p>
            </article>
          </div>

          <div className="mt-12 text-center">
            <a href="/resume" className="btn-editorial btn-editorial-saffron inline-flex">
              Try the AI editor — it&apos;s free
              <span className="font-serif text-base italic">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─────────── THE DESK (Dashboard preview) — dark ─────────── */}
      <section id="management" className="relative bg-paper-deep text-paper-soft">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(180,83,10,0.18),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(63,91,71,0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <p className="font-serif text-sm italic text-saffron-bright">No. 05 — The Desk</p>
              <h2 className="headline-editorial mt-3 text-[44px] text-paper-soft sm:text-[60px] md:text-[80px]" style={{ color: "var(--paper-soft)" }}>
                Your career, <em style={{ color: "var(--saffron-bright)" }}>filed</em><br />and ready to send.
              </h2>
              <p className="font-serif mt-6 max-w-md text-[18px] italic leading-[1.45] text-paper-soft/75">
                Save versions for every role. Manage, edit, score and export — all from one dashboard, designed to feel
                like a writer's desk rather than a software product.
              </p>

              <div className="mt-8 grid grid-cols-3 divide-x divide-paper-soft/15 border-y border-paper-soft/25 py-4">
                {[
                  { value: String(ALL_TEMPLATES.length), label: "Templates" },
                  { value: "92%", label: "Avg ATS" },
                  { value: "2 min", label: "Setup time" },
                ].map((stat, i) => (
                  <div key={stat.label} className={`flex flex-col items-center gap-1 ${i > 0 ? "px-4" : "pr-4"}`}>
                    <p className="font-serif text-[38px] leading-none text-paper-soft">{stat.value}</p>
                    <p className="font-serif text-xs italic text-paper-soft/55">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <a href="/resume" className="btn-editorial-saffron btn-editorial">
                  Start a new draft
                  <span className="font-serif text-base italic">→</span>
                </a>
                <a href="/dashboard" className="btn-editorial inline-flex border-paper-soft/40 bg-transparent text-paper-soft hover:bg-paper-soft hover:text-ink-deep">
                  View dashboard
                </a>
              </div>
            </div>

            {/* Dashboard editorial mockup */}
            <div className="relative">
              <div className="absolute -inset-4 border border-saffron/30" />
              <div className="relative border-2 border-paper-soft bg-paper p-6 text-ink-deep shadow-[12px_12px_0_0_rgba(180,83,10,0.5)]">
                {/* Mock masthead */}
                <div className="mb-5 flex items-baseline justify-between border-b-2 border-ink-deep pb-3">
                  <div>
                    <p className="font-serif text-[10px] italic text-saffron">The Desk · cv-with-ai.com/dashboard</p>
                    <p className="font-serif text-2xl text-ink-deep">Welcome back, Aykut.</p>
                  </div>
                  <p className="smallcaps text-ink-soft">Mon · Today</p>
                </div>

                {/* Stat row */}
                <div className="mb-5 grid grid-cols-3 divide-x divide-ink-deep/20 border border-ink-deep">
                  {[
                    { label: "Résumés", value: "3" },
                    { label: "Letters", value: "2" },
                    { label: "ATS score", value: "92" },
                  ].map((s) => (
                    <div key={s.label} className="px-4 py-3">
                      <p className="smallcaps text-ink-soft">{s.label}</p>
                      <p className="font-serif text-3xl text-ink-deep">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Document table */}
                <div className="border border-ink-deep">
                  <div className="grid grid-cols-[1.6fr_1fr_auto] gap-4 border-b-2 border-ink-deep bg-paper-warm px-4 py-2">
                    <p className="smallcaps text-ink-soft">Title</p>
                    <p className="smallcaps text-ink-soft">Modified</p>
                    <p className="smallcaps text-ink-soft">Score</p>
                  </div>
                  {[
                    { title: "Product Manager CV", date: "Updated today", score: 92 },
                    { title: "SaaS Founder Résumé", date: "Two days ago", score: 88 },
                    { title: "Consulting Cover Letter", date: "Draft", score: null },
                  ].map((doc, i, arr) => (
                    <div key={doc.title} className={`grid grid-cols-[1.6fr_1fr_auto] items-center gap-4 px-4 py-3 ${i < arr.length - 1 ? "border-b border-ink-deep/20" : ""}`}>
                      <p className="font-serif text-[17px] italic text-ink-deep">{doc.title}</p>
                      <p className="font-serif text-sm italic text-ink-soft">{doc.date}</p>
                      <p className="font-serif text-lg text-ink-deep">
                        {doc.score !== null ? <><em className="text-saffron not-italic">{doc.score}</em>/100</> : <span className="italic text-ink-soft">in progress</span>}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="byline mt-4">— A daily edition of you. —</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── LETTERS TO THE EDITOR (Testimonials) ─────────── */}
      <section id="testimonials" className="noise-paper">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
          <div className="mb-12 grid gap-6 md:grid-cols-[1.6fr_2.4fr] md:items-end">
            <div>
              <p className="font-serif text-sm italic text-saffron">No. 06 — Letters to the Editor</p>
              <h2 className="headline-editorial mt-3 text-[44px] sm:text-[60px] md:text-[76px]">
                Loved by <em>readers</em><br />in 92 countries.
              </h2>
            </div>
            <p className="font-serif text-lg italic leading-snug text-ink-soft md:pl-12">
              Postmarked from the people who used the press, signed off, and landed the job. Names redacted only where
              the recruiter is still being polite.
            </p>
          </div>

          {/* Magazine grid */}
          <div className="grid grid-cols-12 gap-px bg-ink-deep border-2 border-ink-deep">
            {[
              {
                name: "Sarah Mitchell",
                role: "Product Manager · Spotify",
                quote: "I went from zero callbacks to five interviews in two weeks. The AI rewrite turned my bullets from boring to impressive.",
                initials: "SM",
                col: "col-span-12 md:col-span-6 lg:col-span-5",
              },
              {
                name: "James Park",
                role: "Software Engineer · Google",
                quote: "The ATS scorer was a game-changer. I had no idea my résumé was getting filtered. After editing, I finally heard back.",
                initials: "JP",
                col: "col-span-12 md:col-span-6 lg:col-span-4",
              },
              {
                name: "Elena Rodriguez",
                role: "Marketing Director · Shopify",
                quote: "The cover letter generator saved me hours. It matched the job posting and highlighted exactly the right experience.",
                initials: "ER",
                col: "col-span-12 md:col-span-6 lg:col-span-3",
              },
              {
                name: "David Chen",
                role: "Data Analyst · Amazon",
                quote: "I tried four other CV builders. Templates here actually look like a magazine, not a corporate slide deck.",
                initials: "DC",
                col: "col-span-12 md:col-span-6 lg:col-span-4",
              },
              {
                name: "Aisha Okonkwo",
                role: "UX Designer · Meta",
                quote: "As a career changer, presenting my experience was hard. The AI helped me frame transferable skills perfectly.",
                initials: "AO",
                col: "col-span-12 md:col-span-6 lg:col-span-5",
              },
              {
                name: "Marcus Weber",
                role: "Finance Analyst · JPMorgan",
                quote: "Clean, professional, fast. I built my résumé over lunch and sent it the same afternoon.",
                initials: "MW",
                col: "col-span-12 md:col-span-12 lg:col-span-3",
              },
            ].map((t) => (
              <article key={t.name} className={`${t.col} noise-paper p-7 md:p-9 flex flex-col`}>
                <p className="font-serif text-[60px] leading-none text-saffron">"</p>
                <p className="font-serif mt-1 flex-1 text-[18px] italic leading-[1.35] text-ink-deep md:text-[20px]">
                  {t.quote}
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-ink-deep pt-4">
                  <div className="flex h-10 w-10 items-center justify-center bg-ink-deep font-serif text-sm italic text-paper-soft">{t.initials}</div>
                  <div>
                    <p className="font-serif text-[15px] text-ink-deep">{t.name}</p>
                    <p className="font-serif text-xs italic text-ink-soft">{t.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Stars summary */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-ink-deep/40" />
            <p className="font-serif text-lg italic text-ink-deep">
              ★ ★ ★ ★ ★ &nbsp; <em className="not-italic text-saffron">4.9</em> from 1,240 verified subscribers
            </p>
            <div className="h-px flex-1 bg-ink-deep/40" />
          </div>
        </div>
      </section>

      {/* ─────────── SUBSCRIBE (Pricing) ─────────── */}
      <PricingSection />

      {/* ─────────── COLOPHON (Footer) ─────────── */}
      <footer className="border-t-[3px] border-ink-deep bg-paper noise-paper">
        <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-12 md:py-20">
          <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div>
              <p className="font-serif text-[11px] italic text-ink-soft">The Resumé Press, est. 2026</p>
              <p className="font-serif text-[44px] leading-none text-ink-deep md:text-[60px]">
                CV <em className="text-saffron">with</em> AI
              </p>
              <p className="font-serif mt-4 max-w-sm text-[15px] italic leading-snug text-ink-soft">
                A typeset newsroom for ambitious careers. Set in Fraunces &amp; Geist, printed on a press of cream &amp; ink.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <a href="/signup" className="btn-editorial">
                  Subscribe — start free
                </a>
                <a href="/signin" className="btn-editorial btn-editorial-ghost">
                  Sign in
                </a>
              </div>
            </div>

            <FooterCol title="The Paper" links={[
              { label: "Builder", href: "/resume" },
              { label: "Templates", href: "/templates" },
              { label: "Cover letters", href: "/cover-letter" },
              { label: "Dashboard", href: "/dashboard" },
            ]} />
            <FooterCol title="Subscription" links={[
              { label: "Pricing", href: "/pricing" },
              { label: "Sign in", href: "/signin" },
              { label: "Subscribe", href: "/signup" },
            ]} />
            <FooterCol title="Imprint" links={[
              { label: "Privacy policy", href: "/privacy" },
              { label: "Terms of service", href: "/terms" },
              { label: "Refund policy", href: "/refund" },
            ]} />
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink-deep/30 pt-6 md:flex-row">
            <p className="font-serif text-xs italic text-ink-soft">
              © {new Date().getFullYear()} CV with AI. All rights reserved. Hand-set with care.
            </p>
            <p className="font-serif text-xs italic text-ink-soft">
              {ISSUE_DATE} · Worldwide circulation
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="font-serif text-sm italic text-saffron">{title}</p>
      <div className="mt-2 h-px w-8 bg-ink-deep" />
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="font-serif text-[16px] text-ink-deep transition hover:italic hover:text-saffron">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────── Templates marquee (editorial style) ─────────── */
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
    <section ref={sectionRef} id="templates" className="relative bg-paper-deep py-20 text-paper-soft md:py-24">
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_30%_30%,rgba(180,83,10,0.16),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(63,91,71,0.12),transparent_50%)]" />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mb-12 flex flex-col items-end gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-serif text-sm italic text-saffron-bright">No. 02 — The Anthology</p>
            <h2 className="headline-editorial mt-3 text-[44px] text-paper-soft sm:text-[60px] md:text-[76px]" style={{ color: "var(--paper-soft)" }}>
              Designed for <em style={{ color: "var(--saffron-bright)" }}>every</em><br />career stage.
            </h2>
            <p className="font-serif mt-4 text-lg italic text-paper-soft/65">
              {totalCount} typeset templates, anthology-grade — from entry-level to executive.
            </p>
          </div>
          <a href="/templates" className="group inline-flex items-center gap-2 border border-paper-soft/40 px-5 py-3 font-edit text-xs font-bold uppercase tracking-[0.18em] text-paper-soft transition hover:bg-paper-soft hover:text-ink-deep">
            View all {totalCount} templates
            <span className="font-serif text-base italic">→</span>
          </a>
        </div>
      </div>

      <div className="relative mt-6" style={{ minHeight: 340 }}>
        {visible ? (
          <>
            <div className="flex editorial-marquee gap-6 px-6 md:px-12" style={{ width: "max-content" }}>
              {templates.map((tmpl, i) => (
                <div key={`${tmpl.name}-${i}`} className="w-[180px] flex-shrink-0 cursor-pointer sm:w-[220px]" onClick={() => onSelect(tmpl)}>
                  <div className="group relative aspect-[1/1.38] overflow-hidden bg-paper-soft border border-paper-soft/30 transition-all duration-300 hover:border-saffron-bright">
                    <div className="absolute inset-0 overflow-hidden">
                      <div style={{ width: "210mm", minHeight: "297mm", transform: "scale(0.302)", transformOrigin: "top left" }}>
                        <TemplateRenderer resume={sampleResume} templateName={tmpl.name} />
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-ink-deep/90 px-3 py-2 transition-transform duration-300 group-hover:translate-y-0">
                      <p className="font-serif text-sm italic text-paper-soft">{tmpl.name}</p>
                      <p className="font-serif text-[10px] italic text-saffron-bright">Set this template →</p>
                    </div>
                  </div>
                  <p className="mt-2 font-serif text-[11px] italic text-paper-soft/55">Plate {(i % 99 + 1).toString().padStart(2, "0")} · {tmpl.category}</p>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-paper-deep to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-paper-deep to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-paper-soft/20 border-t-saffron-bright" />
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────── Hero preview (paper frame) ─────────── */
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
    const container = containerRef.current;
    if (!content || !container) return;
    const update = () => {
      const borderY = container.offsetHeight - container.clientHeight;
      setScaledHeight(Math.ceil(content.scrollHeight * scale) + borderY);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(content);
    return () => ro.disconnect();
  }, [scale]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white"
      style={{
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
  );
}

/* ─────────── Pricing (editorial style) ─────────── */
function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="noise-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">
        <div className="mb-12 text-center">
          <p className="font-serif text-sm italic text-saffron">No. 07 — Subscription</p>
          <h2 className="headline-editorial mt-3 text-[44px] sm:text-[60px] md:text-[76px]">
            Simple, <em>honest</em><br />pricing.
          </h2>
          <p className="byline mt-4">Start free. Upgrade only when you need the press behind you.</p>

          <div className="mt-8 inline-flex items-center gap-0 border-2 border-ink-deep">
            <button
              className={`px-6 py-2.5 font-edit text-xs font-bold uppercase tracking-[0.18em] transition ${!yearly ? "bg-ink-deep text-paper-soft" : "bg-paper-soft text-ink-deep"}`}
              onClick={() => setYearly(false)}
              type="button"
            >
              Monthly
            </button>
            <div className="h-8 w-px bg-ink-deep" />
            <button
              className={`px-6 py-2.5 font-edit text-xs font-bold uppercase tracking-[0.18em] transition ${yearly ? "bg-ink-deep text-paper-soft" : "bg-paper-soft text-ink-deep"}`}
              onClick={() => setYearly(true)}
              type="button"
            >
              Yearly
              <span className="ml-2 bg-saffron px-1.5 py-0.5 text-[9px] text-paper-soft">Save 30%</span>
            </button>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-0 border-2 border-ink-deep md:grid-cols-2">
          <PricingCard
            cta="Start free"
            href="/signup"
            features={["1 CV + 1 cover letter", "All standard templates", "Live preview", "PDF export"]}
            name="Basic"
            tagline="The cub reporter."
            price="€0"
            period="forever"
          />
          <PricingCard
            cta="Subscribe to Pro"
            href="/signup?plan=pro"
            featured
            features={[
              "Unlimited CVs & cover letters",
              "AI Editor — rewrite & optimise",
              "AI cover letter generator",
              "Résumé scoring (ATS)",
              "High-res PDF exports",
              "Priority editorial support",
            ]}
            name="Pro"
            tagline="The full press."
            price={yearly ? "€2.10" : "€3"}
            originalPrice={yearly ? "€4.20" : "€6"}
            period={yearly ? "/mo · billed €25.20/year" : "/month"}
          />
        </div>

        <p className="mt-8 text-center font-serif text-xs italic text-ink-soft">
          All prices in EUR. Cancel anytime. The free plan stays free, no card required.
        </p>
      </div>
    </section>
  );
}

function PricingCard({ cta, featured = false, features, href, name, tagline, price, originalPrice, period }: { cta: string; featured?: boolean; features: string[]; href: string; name: string; tagline: string; price: string; originalPrice?: string; period: string }) {
  return (
    <article className={`relative flex flex-col p-8 md:p-10 ${featured ? "bg-ink-deep text-paper-soft md:border-l-2 md:border-ink-deep" : "bg-paper-soft text-ink-deep border-b-2 border-ink-deep md:border-b-0 md:border-r-2"}`}>
      {featured && (
        <div className="absolute -top-px right-6 bg-saffron px-3 py-1 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-paper-soft">
          Recommended
        </div>
      )}
      <p className={`font-serif text-sm italic ${featured ? "text-saffron-bright" : "text-saffron"}`}>{tagline}</p>
      <h3 className={`headline-editorial mt-2 text-[44px] ${featured ? "text-paper-soft" : "text-ink-deep"}`} style={featured ? { color: "var(--paper-soft)" } : {}}>
        {name}
      </h3>

      <div className={`mt-5 flex items-baseline gap-2 border-y py-4 ${featured ? "border-paper-soft/25" : "border-ink-deep/25"}`}>
        {originalPrice && (
          <span className={`font-serif text-2xl italic line-through ${featured ? "text-paper-soft/40 decoration-saffron-bright" : "text-ink-quiet decoration-saffron"} decoration-2`}>
            {originalPrice}
          </span>
        )}
        <span className={`font-serif text-[56px] leading-none ${featured ? "text-paper-soft" : "text-ink-deep"}`}>{price}</span>
        <span className={`font-serif text-sm italic ${featured ? "text-paper-soft/60" : "text-ink-soft"}`}>{period || "/month"}</span>
      </div>

      <ul className={`my-8 flex-1 space-y-3 ${featured ? "text-paper-soft/85" : "text-ink-soft"}`}>
        {features.map((feature) => (
          <li key={feature} className={`flex items-baseline gap-3 border-b py-2 ${featured ? "border-paper-soft/15" : "border-ink-deep/12"}`}>
            <span className={`font-serif text-base italic ${featured ? "text-saffron-bright" : "text-saffron"}`}>✓</span>
            <span className="font-serif text-[16px]">{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={href}
        className={`mt-2 inline-flex items-center justify-center gap-2 px-6 py-4 font-edit text-xs font-bold uppercase tracking-[0.2em] transition ${
          featured
            ? "bg-saffron text-paper-soft hover:bg-paper-soft hover:text-ink-deep"
            : "bg-ink-deep text-paper-soft hover:bg-saffron"
        }`}
      >
        {cta} <span className="font-serif text-base italic">→</span>
      </a>
    </article>
  );
}
