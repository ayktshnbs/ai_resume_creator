const features = [
  {
    title: "AI CV enhancement",
    text: "Rewrite weak bullets into professional, ATS-friendly achievements with structured JSON-ready outputs.",
    icon: "AI"
  },
  {
    title: "Live template preview",
    text: "Edit personal details, experience, education, and skills while the CV preview updates beside the form.",
    icon: "CV"
  },
  {
    title: "Cover letter generator",
    text: "Generate targeted cover letters from a job title, posting context, and saved CV data.",
    icon: "CL"
  },
  {
    title: "PDF export",
    text: "Export polished A4 or Letter PDFs using Puppeteer or React-PDF when the backend is connected.",
    icon: "PDF"
  }
];

const savedCvs = [
  ["Product Manager CV", "Updated today", "ATS 92"],
  ["SaaS Founder Resume", "2 days ago", "ATS 88"],
  ["Consulting Cover Letter", "Draft", "AI"]
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-outline/50 bg-background/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-10">
          <a className="text-lg font-bold tracking-tight text-primary" href="#">
            AI CV Builder
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
            <a className="hover:text-primary" href="#features">
              Features
            </a>
            <a className="hover:text-primary" href="/resume">
              Builder
            </a>
            <a className="hover:text-primary" href="#architecture">
              Architecture
            </a>
            <a className="hover:text-primary" href="#pricing">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-primary hover:bg-surface-soft md:block" href="/signin">
              Login
            </a>
            <a className="primary-gradient rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-ambient" href="/resume">
              Start free
            </a>
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(0,112,235,0.14),transparent_30%),radial-gradient(circle_at_78%_10%,rgba(70,72,212,0.12),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f1f3ff_58%,#f9f9ff_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(113,119,134,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(113,119,134,0.08)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 md:grid-cols-[0.88fr_1.12fr] md:px-10 md:py-20">
        <div className="flex flex-col justify-center">
          <p className="mb-4 w-fit rounded-full border border-outline/70 bg-surface px-3 py-1 font-label text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            Production-ready SaaS MVP
          </p>
          <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-normal text-ink md:text-6xl">
            Build a job-winning CV in minutes with <span className="gradient-text">AI</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            A clean Next.js CV builder with Supabase auth, AI rewriting, cover letter generation, real-time templates, PDF export, and a dashboard for saved resumes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="primary-gradient rounded-xl px-6 py-3 text-center text-sm font-bold text-white shadow-panel" href="/resume">
              Open builder
            </a>
            <a className="rounded-xl border border-outline/70 bg-surface px-6 py-3 text-center text-sm font-bold text-ink shadow-ambient" href="#architecture">
              View roadmap
            </a>
          </div>
        </div>

        <HeroPreview />
        </div>
      </section>

      <section className="bg-surface-soft py-20" id="features">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <div className="mb-10 max-w-2xl">
            <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-primary">Core MVP</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink md:text-4xl">Everything needed for the first SaaS release.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article className="soft-card rounded-2xl p-6 transition hover:-translate-y-0.5 hover:shadow-panel" key={feature.title}>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 font-label text-sm font-bold text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-ink">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-20 md:grid-cols-[320px_1fr] md:px-10" id="management">
        <aside className="soft-card rounded-2xl p-5">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-muted">Management</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Manage saved documents</h2>
          <p className="mt-3 text-sm leading-6 text-muted">Supabase auth and database records keep each resume connected to the user account.</p>
          <a className="primary-gradient mt-6 block w-full rounded-xl px-4 py-3 text-center text-sm font-bold text-white" href="/resume">Create new CV</a>
        </aside>
        <div className="grid gap-4" id="builder">
          {savedCvs.map(([title, date, score]) => (
            <div className="soft-card flex flex-col justify-between gap-4 rounded-2xl p-5 sm:flex-row sm:items-center" key={title}>
              <div>
                <h3 className="text-lg font-bold text-ink">{title}</h3>
                <p className="text-sm text-muted">{date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{score}</span>
                <a className="rounded-xl border border-outline/70 bg-white px-4 py-2 text-sm font-bold text-ink" href="/resume">Edit</a>
                <button className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white">Export PDF</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-20 text-white" id="architecture">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:px-10">
          <div>
            <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-blue-200">Architecture</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">Simple now, scalable later.</h2>
            <p className="mt-5 leading-7 text-blue-100">
              The product starts with a clean App Router structure, API routes for AI and PDF work, Supabase for auth/database, and reusable UI modules for templates and form sections.
            </p>
          </div>
          <div className="grid gap-3 text-sm">
            {["src/app - routes, layout, pages, API handlers", "src/components - reusable builder, dashboard, preview UI", "src/lib/supabase - browser and server clients", "src/services/ai - OpenAI prompts and structured responses", "src/services/pdf - Puppeteer or React-PDF export", "src/types - CV, user, template, AI response types"].map((item) => (
              <div className="rounded-xl border border-white/10 bg-white/7 px-4 py-3" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-10" id="pricing">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-normal text-ink md:text-4xl">Transparent MVP pricing</h2>
          <p className="mt-4 text-muted">Start with free CV creation, then monetize AI improvements, premium exports, and templates.</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <PricingCard
            cta="Start free"
            features={["1 saved CV", "Standard template", "Watermarked PDF export"]}
            name="Basic"
            price="$0"
          />
          <PricingCard
            cta="Upgrade to Pro"
            featured
            features={["Unlimited CVs", "AI rewrite and cover letters", "Premium templates", "Clean PDF exports"]}
            name="Pro"
            price="$12"
          />
        </div>
      </section>

      <footer className="border-t border-outline/50 bg-surface py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-10">
          <strong className="text-primary">AI CV Builder</strong>
          <span>Precision through Simplicity. Built for a step-by-step SaaS launch.</span>
        </div>
      </footer>
    </main>
  );
}

function HeroPreview() {
  return (
    <div className="relative min-h-[560px]">
      <div className="absolute inset-x-4 bottom-4 top-8 rounded-[28px] bg-primary/10 blur-3xl" />
      <div className="relative grid gap-5 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-panel backdrop-blur-xl lg:grid-cols-[1fr_220px]">
        <div className="rounded-2xl border border-outline/40 bg-surface-soft p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-muted">Live Preview</p>
              <h2 className="text-lg font-bold text-ink">Modern Minimalist</h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 font-label text-xs font-semibold text-primary">ATS 94</span>
          </div>
          <div className="mx-auto aspect-[0.707/1] max-h-[470px] min-h-[420px] w-full max-w-[335px] rounded bg-white p-8 shadow-panel ring-1 ring-outline/30">
            <div className="border-b border-outline/40 pb-5 text-center">
              <div className="mx-auto mb-3 h-5 w-44 rounded bg-ink/85" />
              <div className="mx-auto mb-4 h-2.5 w-32 rounded bg-primary" />
              <div className="mx-auto h-1.5 w-52 rounded bg-outline/45" />
            </div>
            <div className="mt-6 space-y-6">
              <HeroResumeSection rows={4} titleWidth="w-20" />
              <HeroResumeRole />
              <HeroResumeRole muted />
              <div>
                <div className="mb-3 h-2.5 w-16 rounded bg-ink/75" />
                <div className="flex flex-wrap gap-2">
                  {["w-16", "w-12", "w-20", "w-14", "w-10"].map((width, index) => (
                    <div className={`h-5 rounded-full ${width} ${index % 2 === 0 ? "bg-primary/10" : "bg-surface-soft"}`} key={`${width}-${index}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <aside className="grid gap-4 lg:content-start">
          <div className="rounded-2xl border border-outline/40 bg-white p-4 shadow-ambient">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-xs font-bold text-white">AI</span>
              <div>
                <h3 className="text-sm font-bold text-ink">Rewrite ready</h3>
                <p className="text-xs text-muted">Summary and bullets</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 rounded bg-outline/35" />
              <div className="h-2 rounded bg-outline/25" />
              <div className="h-2 w-4/5 rounded bg-outline/25" />
            </div>
            <a className="primary-gradient mt-4 block rounded-xl px-4 py-2 text-center text-sm font-bold text-white" href="/resume">
              Try builder
            </a>
          </div>
          <div className="rounded-2xl border border-outline/40 bg-white p-4 shadow-ambient">
            <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-muted">Templates</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["bg-primary", "bg-ink", "bg-secondary"].map((color) => (
                <div className="rounded-lg border border-outline/30 bg-surface-soft p-2" key={color}>
                  <div className={`mb-2 h-1.5 rounded ${color}`} />
                  <div className="space-y-1">
                    <div className="h-1 rounded bg-outline/40" />
                    <div className="h-1 rounded bg-outline/30" />
                    <div className="h-1 w-4/5 rounded bg-outline/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-outline/40 bg-ink p-4 text-white shadow-ambient">
            <p className="text-sm font-bold">One-click PDF export</p>
            <p className="mt-1 text-xs text-white/70">Print-ready A4 layout</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function HeroResumeSection({ rows, titleWidth }: { rows: number; titleWidth: string }) {
  return (
    <div>
      <div className={`mb-3 h-2.5 rounded bg-ink/75 ${titleWidth}`} />
      <div className="space-y-1.5">
        {Array.from({ length: rows }).map((_, index) => (
          <div className={`h-1.5 rounded ${index === rows - 1 ? "w-4/5 bg-outline/30" : "w-full bg-outline/40"}`} key={index} />
        ))}
      </div>
    </div>
  );
}

function HeroResumeRole({ muted = false }: { muted?: boolean }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <div className={`h-2.5 w-24 rounded ${muted ? "bg-outline/50" : "bg-primary/60"}`} />
        <div className="h-2 w-16 rounded bg-outline/35" />
      </div>
      <div className="space-y-1.5">
        <div className="h-1.5 rounded bg-outline/40" />
        <div className="h-1.5 rounded bg-outline/30" />
        <div className="h-1.5 w-5/6 rounded bg-outline/30" />
      </div>
    </div>
  );
}

function PricingCard({
  cta,
  featured = false,
  features,
  name,
  price
}: {
  cta: string;
  featured?: boolean;
  features: string[];
  name: string;
  price: string;
}) {
  return (
    <article className={`soft-card rounded-2xl p-7 ${featured ? "border-primary ring-2 ring-primary/15" : ""}`}>
      {featured && <p className="mb-3 w-fit rounded-full bg-primary px-3 py-1 font-label text-xs font-bold uppercase tracking-[0.12em] text-white">Most popular</p>}
      <h3 className="text-xl font-bold text-ink">{name}</h3>
      <p className="mt-4 text-5xl font-extrabold text-ink">
        {price}
        <span className="text-base font-medium text-muted">/mo</span>
      </p>
      <ul className="mt-6 space-y-3 text-sm text-muted">
        {features.map((feature) => (
          <li className="flex items-center gap-3" key={feature}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <button className={`mt-7 w-full rounded-xl px-4 py-3 text-sm font-bold ${featured ? "primary-gradient text-white" : "bg-surface-soft text-ink"}`}>
        {cta}
      </button>
    </article>
  );
}
