import { TemplateCarousel } from "@/components/cv-templates/template-carousel";
import { OnyxPreview } from "@/components/cv-templates/onyx-preview";
import { sampleResume } from "@/components/cv-templates/sample-data";
import { PaymentButton } from "@/components/payment-button";

const features = [
  {
    title: "AI CV Enhancement",
    text: "Rewrite weak bullets into professional, ATS-friendly achievements with one click.",
    icon: "AI",
    gradient: "from-primary/10 to-primary/5"
  },
  {
    title: "Live Template Preview",
    text: "Edit your details while the CV preview updates beside the form in real time.",
    icon: "CV",
    gradient: "from-secondary/10 to-secondary/5"
  },
  {
    title: "Cover Letter Generator",
    text: "Generate targeted cover letters from your saved CV data in seconds.",
    icon: "CL",
    gradient: "from-success/10 to-success/5"
  },
  {
    title: "PDF Export",
    text: "Export polished A4 PDFs that match your chosen template exactly.",
    icon: "PDF",
    gradient: "from-warning/10 to-warning/5"
  }
];

const savedCvs = [
  ["Product Manager CV", "Updated today", "ATS 92"],
  ["SaaS Founder Resume", "2 days ago", "ATS 88"],
  ["Consulting Cover Letter", "Draft", "AI"]
];

const slidingTemplates = [
  { name: "Modern Minimalist", accent: "bg-primary", label: "Single Column" },
  { name: "Professional Serif", accent: "bg-ink", label: "Classic Layout" },
  { name: "Creative Tech", accent: "bg-secondary", label: "Two Column" },
  { name: "Lumina Compact", accent: "bg-primary-bright", label: "Compact" },
  { name: "Startup Operator", accent: "bg-success", label: "Metrics Focus" },
  { name: "Graduate Clean", accent: "bg-warning", label: "Entry Level" },
  { name: "Executive Impact", accent: "bg-ink", label: "Leadership" },
  { name: "Academic Classic", accent: "bg-primary", label: "Research" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
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

      <header className="sticky top-0 z-50 border-b border-outline/50 bg-background/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-10">
          <a className="text-lg font-bold tracking-tight text-primary" href="#">
            CVForge AI
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
            <a className="transition-colors hover:text-primary" href="#features">Features</a>
            <a className="transition-colors hover:text-primary" href="/resume">Builder</a>
            <a className="transition-colors hover:text-primary" href="/templates">Templates</a>
            <a className="transition-colors hover:text-primary" href="#pricing">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <a
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/10 md:block"
              href="/signin"
            >
              Sign in
            </a>
            <a
              className="primary-gradient rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-ambient transition-all hover:shadow-panel hover:brightness-105"
              href="/signup"
            >
              Get started free
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
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
              Professional templates, AI-powered rewrites, cover letter generation, and one-click PDF export — all free to start.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="primary-gradient group relative overflow-hidden rounded-xl px-6 py-3 text-center text-sm font-bold text-white shadow-panel transition-all hover:shadow-[0_8px_32px_rgba(99,102,241,0.4)] hover:brightness-105"
                href="/resume"
              >
                Open builder
              </a>
              <a
                className="rounded-xl border border-outline/70 bg-surface px-6 py-3 text-center text-sm font-bold text-ink shadow-ambient transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-panel"
                href="/templates"
              >
                Browse templates
              </a>
            </div>
            <div className="mt-10 flex items-center gap-5">
              <div className="flex -space-x-2">
                {["bg-primary", "bg-secondary", "bg-success", "bg-warning"].map((color, i) => (
                  <div key={i} className={`h-8 w-8 rounded-full border-2 border-white ${color} flex items-center justify-center text-[10px] font-bold text-white`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted"><strong className="text-ink">2,400+</strong> resumes built this month</p>
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      {/* Cinematic sliding templates showcase */}
      <section className="overflow-hidden border-y border-outline/30 bg-surface-soft py-12">
        <div className="mb-6 px-4 text-center md:px-10">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-muted">Template Gallery</p>
          <h2 className="mt-2 text-xl font-bold text-ink">8 professionally designed templates</h2>
        </div>
        <div className="relative">
          <div className="flex animate-marquee gap-5" style={{ width: "max-content" }}>
            {[...slidingTemplates, ...slidingTemplates].map((tmpl, i) => (
              <a
                key={i}
                href="/templates"
                className="group flex-shrink-0 w-52 cursor-pointer overflow-hidden rounded-2xl border border-outline/30 bg-white shadow-ambient transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-panel"
              >
                <div className={`h-1.5 w-full ${tmpl.accent}`} />
                <div className="p-4">
                  <SlidingTemplateMiniPreview accent={tmpl.accent} />
                  <p className="mt-3 text-sm font-bold text-ink">{tmpl.name}</p>
                  <p className="text-xs text-muted">{tmpl.label}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface-soft to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface-soft to-transparent" />
        </div>
      </section>

      {/* Features */}
      <section className="py-20" id="features">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <div className="mb-10 max-w-2xl">
            <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-primary">Core features</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink md:text-4xl">
              Everything for a job-winning application.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                className="card-hover soft-card cursor-default rounded-2xl p-6"
                key={feature.title}
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} font-label text-sm font-bold text-primary ring-1 ring-primary/10`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-ink">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="bg-surface-soft py-20" id="management">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-[320px_1fr] md:px-10">
          <aside className="soft-card rounded-2xl p-5">
            <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-muted">Management</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">Manage saved documents</h2>
            <p className="mt-3 text-sm leading-6 text-muted">Auth and database keep each resume connected to your account.</p>
            <a
              className="primary-gradient mt-6 block w-full rounded-xl px-4 py-3 text-center text-sm font-bold text-white transition-all hover:brightness-105"
              href="/resume"
            >
              Create new CV
            </a>
          </aside>
          <div className="grid gap-4">
            {savedCvs.map(([title, date, score]) => (
              <div
                className="card-hover soft-card flex flex-col justify-between gap-4 rounded-2xl p-5 sm:flex-row sm:items-center"
                key={title}
              >
                <div>
                  <h3 className="text-lg font-bold text-ink">{title}</h3>
                  <p className="text-sm text-muted">{date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{score}</span>
                  <a className="rounded-xl border border-outline/70 bg-white px-4 py-2 text-sm font-bold text-ink transition-all hover:border-primary/40 hover:text-primary" href="/resume">
                    Edit
                  </a>
                  <button className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white transition-all hover:bg-ink/80">
                    Export PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="bg-ink py-20 text-white" id="architecture">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:px-10">
          <div>
            <p className="font-label text-xs font-semibold uppercase tracking-[0.12em] text-blue-200">Architecture</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">Simple now, scalable later.</h2>
            <p className="mt-5 leading-7 text-blue-100">
              Clean App Router structure, API routes for AI work, auth for account management, and reusable UI modules for templates and form sections.
            </p>
          </div>
          <div className="grid gap-3 text-sm">
            {[
              "src/app — routes, layout, pages, API handlers",
              "src/components — reusable builder, dashboard, preview UI",
              "src/app/api/auth — NextAuth with Google OAuth",
              "src/services/ai — OpenAI prompts and structured responses",
              "src/services/pdf — React-PDF template export",
              "src/types — CV, user, template, AI response types"
            ].map((item) => (
              <div
                className="rounded-xl border border-white/10 bg-white/7 px-4 py-3 transition-all hover:border-white/20 hover:bg-white/10"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-10" id="pricing">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-normal text-ink md:text-4xl">Transparent pricing</h2>
          <p className="mt-4 text-muted">Start free with full builder access, then unlock AI and premium templates.</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <PricingCard
            cta="Start free"
            features={["1 saved CV", "All standard templates", "Cover letter generator", "Watermarked PDF export"]}
            name="Basic"
            price="$0"
          />
          <PricingCard
            cta="Upgrade to Pro"
            featured
            features={["Unlimited CVs & cover letters", "AI rewrite & optimization", "Premium templates", "Clean PDF exports", "Priority support"]}
            name="Pro"
            price="$12"
          />
        </div>
      </section>

      <footer className="border-t border-outline/50 bg-surface py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-10">
          <strong className="text-primary">AI CV Builder</strong>
          <div className="flex gap-6">
            <a className="hover:text-primary" href="/signin">Sign in</a>
            <a className="hover:text-primary" href="/signup">Sign up</a>
            <a className="hover:text-primary" href="/templates">Templates</a>
          </div>
          <span>Precision through Simplicity.</span>
        </div>
      </footer>
    </main>
  );
}

function SlidingTemplateMiniPreview({ accent }: { accent: string }) {
  return (
    <div className="space-y-1.5">
      <div className={`h-2 w-24 rounded ${accent} opacity-80`} />
      <div className="h-1 w-32 rounded bg-outline/40" />
      <div className="h-1 w-28 rounded bg-outline/30" />
      <div className="mt-2 h-px bg-outline/20" />
      <div className="h-1 w-full rounded bg-outline/20" />
      <div className="h-1 w-5/6 rounded bg-outline/20" />
      <div className="h-1 w-4/5 rounded bg-outline/15" />
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="relative min-h-[600px]">
      <div className="absolute inset-x-6 bottom-6 top-10 rounded-[32px] bg-[radial-gradient(circle_at_30%_30%,rgba(0,112,235,0.18),transparent_60%),radial-gradient(circle_at_75%_70%,rgba(70,72,212,0.16),transparent_55%)] blur-3xl" />
      <div className="relative grid gap-5 rounded-3xl border border-white/70 bg-white/60 p-4 shadow-panel backdrop-blur-xl lg:grid-cols-[1fr_236px]">
        <div className="relative overflow-hidden rounded-2xl border border-outline/30 bg-[linear-gradient(180deg,#eef2ff_0%,#f7f8ff_100%)] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#fb7185]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
            </div>
            <div className="flex flex-1 items-center gap-2">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Live preview</p>
              <span className="text-[10px] text-muted/70">·</span>
              <p className="text-[10px] font-bold text-ink">Modern Minimalist</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-label text-[10px] font-bold tracking-wide text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              ATS 94
            </span>
          </div>
          <HeroResumeStage />
          <div className="pointer-events-none absolute -bottom-3 -right-3 hidden rotate-[2deg] md:block">
            <div className="rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-panel backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-[11px] font-bold text-white shadow-sm">AI</span>
                <div>
                  <p className="text-[11px] font-bold text-ink">Rewriting bullet 3…</p>
                  <p className="text-[10px] text-muted">+18% impact wording</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <aside className="grid gap-4 lg:content-start">
          <div className="rounded-2xl border border-outline/40 bg-white p-4 shadow-ambient">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">AI</span>
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
            <a className="primary-gradient mt-4 block rounded-xl px-4 py-2 text-center text-sm font-bold text-white transition-all hover:brightness-105" href="/resume">
              Try builder
            </a>
          </div>
          <div className="rounded-2xl border border-outline/40 bg-white p-4 shadow-ambient">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Templates</p>
              <span className="font-label text-[10px] font-bold text-primary">10 styles</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[{tint:"bg-[#0058bc]"},{tint:"bg-[#0f172a]"},{tint:"bg-[#4648d4]"},{tint:"bg-[#0b3d5a]"},{tint:"bg-[#6b5235]"},{tint:"bg-[#0d9488]"}].map((t, i) => (
                <div key={i} className="relative overflow-hidden rounded-lg border border-outline/20 bg-white p-1.5 shadow-sm">
                  <div className={`mb-1 h-1 w-2/3 rounded-full ${t.tint}`} />
                  <div className="space-y-0.5">
                    <div className="h-0.5 rounded bg-outline/45" />
                    <div className="h-0.5 rounded bg-outline/35" />
                    <div className="h-0.5 w-5/6 rounded bg-outline/30" />
                    <div className="mt-1 h-0.5 w-1/2 rounded bg-outline/35" />
                    <div className="h-0.5 rounded bg-outline/25" />
                    <div className="h-0.5 w-4/5 rounded bg-outline/25" />
                  </div>
                </div>
              ))}
            </div>
            <a className="mt-3 block rounded-xl border border-outline/40 px-4 py-2 text-center text-xs font-bold text-ink hover:bg-surface-soft" href="/templates">Browse all templates</a>
          </div>
          <div className="rounded-2xl border border-ink/20 bg-gradient-to-br from-ink to-[#1e293b] p-4 text-white shadow-ambient">
            <p className="text-sm font-bold">One-click PDF export</p>
            <p className="mt-1 text-xs text-white/70">Print-ready A4, no watermark</p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-white/80">
              <span className="rounded bg-white/10 px-2 py-0.5 font-mono">.pdf</span>
              <span className="rounded bg-white/10 px-2 py-0.5">A4</span>
              <span className="rounded bg-white/10 px-2 py-0.5">300dpi</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function HeroResumeStage() {
  return (
    <div
      className="relative mx-auto overflow-hidden rounded bg-white shadow-[0_18px_40px_-18px_rgba(15,23,42,0.35)] ring-1 ring-outline/25"
      style={{ width: 285, height: 403 }}
    >
      <div style={{ width: "210mm", minHeight: "297mm", transform: "scale(0.36)", transformOrigin: "top left" }}>
        <OnyxPreview resume={sampleResume} />
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
    <article className={`card-hover soft-card rounded-2xl p-7 ${featured ? "border-primary ring-2 ring-primary/15" : ""}`}>
      {featured && (
        <p className="mb-3 w-fit rounded-full bg-primary px-3 py-1 font-label text-xs font-bold uppercase tracking-[0.12em] text-white">
          Most popular
        </p>
      )}
      <h3 className="text-xl font-bold text-ink">{name}</h3>
      <p className="mt-4 text-5xl font-extrabold text-ink">
        {price}
        <span className="text-base font-medium text-muted">/mo</span>
      </p>
      <ul className="mt-6 space-y-3 text-sm text-muted">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`mt-7 w-full rounded-xl px-4 py-3 text-sm font-bold transition-all ${
          featured
            ? "primary-gradient text-white hover:brightness-105 hover:shadow-panel"
            : "bg-surface-soft text-ink hover:bg-outline/20"
        }`}
      >
        {cta}
      </button>
    </article>
  );
}
