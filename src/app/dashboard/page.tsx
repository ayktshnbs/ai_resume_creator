"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AppShell } from "@/components/app-sidebar";
import { Icon, type IconName } from "@/components/icon";
import { useProStatus } from "@/lib/use-pro-status";
import { useI18n } from "@/lib/i18n";
import { PaymentButton } from "@/components/payment-button";
import { MagneticButton } from "@/components/magnetic-button";
import type { ResumeData, SelectedTemplate } from "@/types/resume";

type RecentResume = {
  id: string;
  title: string;
  data: ResumeData;
  template: SelectedTemplate | null;
  updatedAt: string;
};

type RecentCoverLetter = {
  id: string;
  title: string;
  templateId: string | null;
  updatedAt: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { isPro, resumeCount, coverLetterCount, loaded } = useProStatus();
  const { t } = useI18n();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [resumes, setResumes] = useState<RecentResume[]>([]);
  const [coverLetters, setCoverLetters] = useState<RecentCoverLetter[]>([]);
  const [docsLoaded, setDocsLoaded] = useState(false);
  const [tab, setTab] = useState<"all" | "resumes" | "letters">("all");

  useEffect(() => {
    if (loaded && !localStorage.getItem("onboarding_seen")) {
      setShowOnboarding(true);
    }
  }, [loaded]);

  useEffect(() => {
    if (!session?.user) return;
    let cancelled = false;
    Promise.all([
      fetch("/api/user/resumes").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/user/cover-letters").then((r) => (r.ok ? r.json() : []))
    ])
      .then(([rs, cls]) => {
        if (cancelled) return;
        setResumes(Array.isArray(rs) ? rs : []);
        setCoverLetters(Array.isArray(cls) ? cls : []);
        setDocsLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setDocsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  if (status === "loading") {
    return (
      <AppShell active="dashboard">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  if (!session) {
    return (
      <AppShell active="dashboard">
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon name="dashboard" className="text-[32px]" />
          </div>
          <h1 className="text-2xl font-bold text-ink">{t("gate.signInDashboard")}</h1>
          <p className="max-w-md text-muted">{t("gate.signInDashboardDesc")}</p>
          <div className="flex gap-3">
            <Link href="/signin" className="rounded-xl primary-gradient px-6 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-110">
              {t("nav.signIn")}
            </Link>
            <Link href="/signup" className="rounded-xl border border-outline/70 bg-surface px-6 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft">
              {t("auth.signUpBtn")}
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const firstName = session.user?.name?.split(" ")[0] || "there";
  const totalDocs = resumeCount + coverLetterCount;
  const resumeLimit = isPro ? Infinity : 1;
  const letterLimit = isPro ? Infinity : 1;

  return (
    <AppShell active="dashboard">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-10 md:py-12">

        {/* Hero header */}
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-label text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="headline-xl text-4xl text-ink md:text-5xl">
                Welcome back, {firstName}
              </h1>
              <PlanBadge isPro={isPro} loaded={loaded} />
            </div>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              Your career documents, all in one place. Pick up where you left off or start something new.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <MagneticButton
              as="a"
              href="/resume"
              className="btn-glow primary-gradient flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-ambient"
            >
              <Icon name="add" className="text-lg" />
              New Resume
            </MagneticButton>
            <MagneticButton
              as="a"
              href="/cover-letter"
              className="btn-spring flex items-center gap-2 rounded-xl border border-outline/60 bg-surface px-5 py-3 text-sm font-bold text-ink"
            >
              <Icon name="subject" className="text-lg" />
              New Cover Letter
            </MagneticButton>
          </div>
        </header>

        {/* Usage strip */}
        <section className="soft-card rounded-2xl p-1.5">
          <div className="grid divide-y divide-outline/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <UsageCell
              icon="document"
              label="Resumes"
              count={resumeCount}
              limit={resumeLimit}
              isPro={isPro}
              loaded={loaded}
              accent="primary"
              href="/resume"
            />
            <UsageCell
              icon="subject"
              label="Cover letters"
              count={coverLetterCount}
              limit={letterLimit}
              isPro={isPro}
              loaded={loaded}
              accent="secondary"
              href="/cover-letter"
            />
            <PlanCell isPro={isPro} loaded={loaded} totalDocs={totalDocs} />
          </div>
        </section>

        {/* Upgrade Banner (Free users only) */}
        {!isPro && loaded && (
          <UpgradeBanner totalDocs={totalDocs} resumeCount={resumeCount} coverLetterCount={coverLetterCount} />
        )}

        {/* Recent Documents */}
        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="section-title text-2xl font-bold text-ink">Recent documents</h2>
              <p className="mt-1.5 text-sm text-muted">Pick up where you left off — or create something new.</p>
            </div>
            <DocTabs
              value={tab}
              onChange={setTab}
              counts={{ all: resumes.length + coverLetters.length, resumes: resumes.length, letters: coverLetters.length }}
            />
          </div>

          <RecentDocs
            tab={tab}
            resumes={resumes}
            coverLetters={coverLetters}
            loaded={docsLoaded}
          />
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="section-title mb-5 text-2xl font-bold text-ink">Quick actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ActionTile
              href="/templates"
              icon="palette"
              title="Browse templates"
              description="100 designs for every career stage."
              accent="primary"
            />
            <ActionTile
              href="/resume"
              icon="sparkle"
              title="AI optimize"
              description="Refine summary, bullets, and skills."
              accent="secondary"
              proOnly={!isPro}
            />
            <ActionTile
              href="/cover-letter"
              icon="edit"
              title="Tailored cover letter"
              description="Generate from a job description."
              accent="success"
              proOnly={!isPro}
            />
            <ActionTile
              href="/resume"
              icon="upload"
              title="Import from LinkedIn"
              description="Auto-fill from your existing profile."
              accent="warning"
            />
          </div>
        </section>

        {/* Onboarding Modal */}
        {showOnboarding && (
          <OnboardingModal onClose={() => {
            setShowOnboarding(false);
            localStorage.setItem("onboarding_seen", "1");
          }} />
        )}
      </div>
    </AppShell>
  );
}

/* ── Plan Badge ─────────────────────────────────────────── */
function PlanBadge({ isPro, loaded }: { isPro: boolean; loaded: boolean }) {
  if (!loaded) return null;
  if (isPro) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-warning/20 to-warning/10 px-3 py-1 text-xs font-bold text-warning">
        <Icon name="sparkle" className="text-sm" />
        Pro
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-outline/60 bg-surface px-3 py-1 text-xs font-bold text-muted">
      Free plan
    </span>
  );
}

/* ── Usage Cell ─────────────────────────────────────────── */
function UsageCell({
  icon, label, count, limit, isPro, loaded, accent, href
}: {
  icon: IconName;
  label: string;
  count: number;
  limit: number;
  isPro: boolean;
  loaded: boolean;
  accent: "primary" | "secondary";
  href: string;
}) {
  const percent = isPro ? 100 : Math.min((count / Math.max(limit, 1)) * 100, 100);
  const limitText = isPro ? "Unlimited" : `${count} of ${limit}`;
  const accentBg = accent === "primary" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary";
  const barColor = accent === "primary" ? "bg-primary" : "bg-secondary";

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl px-5 py-4 transition hover:bg-surface-soft sm:px-6 sm:py-5"
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentBg}`}>
        <Icon name={icon} className="text-[20px]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-2xl font-bold tracking-tight text-ink">
            {loaded ? count : "—"}
          </p>
          <p className="text-xs font-semibold text-muted">{loaded ? limitText : ""}</p>
        </div>
        {!isPro && loaded && (
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-outline/30">
            <div
              className={`h-full rounded-full transition-all ${percent >= 100 ? "bg-error" : barColor}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        )}
      </div>
      <Icon name="arrowRight" className="opacity-0 transition group-hover:opacity-100 text-muted text-lg" />
    </Link>
  );
}

/* ── Plan Cell ─────────────────────────────────────────── */
function PlanCell({ isPro, loaded, totalDocs }: { isPro: boolean; loaded: boolean; totalDocs: number }) {
  if (!loaded) {
    return (
      <div className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-soft">
          <Icon name="sparkle" className="text-[20px] text-muted" />
        </div>
        <div>
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Plan</p>
          <p className="mt-1 text-2xl font-bold text-muted">—</p>
        </div>
      </div>
    );
  }

  if (isPro) {
    return (
      <div className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10 text-warning">
          <Icon name="sparkle" className="text-[20px]" />
        </div>
        <div>
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Plan</p>
          <p className="mt-1 text-xl font-bold tracking-tight text-ink">Pro</p>
          <p className="mt-0.5 text-xs font-semibold text-muted">All features unlocked</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-soft text-muted">
          <Icon name="sparkle" className="text-[20px]" />
        </div>
        <div>
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Plan</p>
          <p className="mt-1 text-xl font-bold tracking-tight text-ink">Free</p>
          <p className="mt-0.5 text-xs font-semibold text-muted">{totalDocs}/2 used</p>
        </div>
      </div>
      <PaymentButton
        price="6"
        className="badge-shimmer hidden shrink-0 rounded-xl bg-ink px-3 py-2 text-xs font-bold text-background lg:inline-flex"
      >
        Upgrade
      </PaymentButton>
    </div>
  );
}

/* ── Upgrade Banner ─────────────────────────────────────── */
function UpgradeBanner({ totalDocs, resumeCount, coverLetterCount }: { totalDocs: number; resumeCount: number; coverLetterCount: number }) {
  const atLimit = resumeCount >= 1 && coverLetterCount >= 1;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary via-primary to-secondary text-white shadow-panel">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="relative z-10 grid gap-6 p-6 lg:grid-cols-[1.5fr_1fr] lg:gap-10 lg:p-8">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.14em]">
            <Icon name="sparkle" className="text-sm" />
            {atLimit ? "You've hit the free limit" : "Get more with Pro"}
          </div>
          <h3 className="text-2xl font-bold leading-tight md:text-3xl">
            {atLimit
              ? "Unlock unlimited documents — €6/month"
              : `${totalDocs}/2 documents used. Go unlimited.`}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/80">
            Create unlimited resumes and cover letters, unlock AI rewriting, ATS scoring, and high-resolution PDF exports.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Unlimited documents", "AI optimization", "ATS scoring", "High-res PDF"].map((feature) => (
              <span key={feature} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                <Icon name="check" className="text-sm" />
                {feature}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-stretch justify-center gap-3 lg:items-end">
          <PaymentButton
            price="6"
            className="btn-glow rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-primary shadow-lg transition hover:scale-[1.02]"
          >
            Upgrade to Pro — €6/mo
          </PaymentButton>
          <p className="text-center text-xs text-white/70 lg:text-right">Cancel anytime. No commitment.</p>
        </div>
      </div>
    </div>
  );
}

/* ── Document Tabs ──────────────────────────────────────── */
function DocTabs({
  value, onChange, counts
}: {
  value: "all" | "resumes" | "letters";
  onChange: (v: "all" | "resumes" | "letters") => void;
  counts: { all: number; resumes: number; letters: number };
}) {
  const tabs: Array<{ id: "all" | "resumes" | "letters"; label: string; count: number }> = [
    { id: "all", label: "All", count: counts.all },
    { id: "resumes", label: "Resumes", count: counts.resumes },
    { id: "letters", label: "Cover letters", count: counts.letters }
  ];
  return (
    <div className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-outline/40 bg-surface p-1">
      {tabs.map((tab) => {
        const active = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              active ? "bg-ink text-background shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
            <span className={`min-w-[18px] rounded-full px-1.5 text-[10px] ${active ? "bg-background/20 text-background" : "bg-surface-soft text-muted"}`}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Recent Documents Grid ─────────────────────────────── */
function RecentDocs({
  tab, resumes, coverLetters, loaded
}: {
  tab: "all" | "resumes" | "letters";
  resumes: RecentResume[];
  coverLetters: RecentCoverLetter[];
  loaded: boolean;
}) {
  const items = useMemo(() => {
    const r = resumes.map((d) => ({ kind: "resume" as const, doc: d }));
    const l = coverLetters.map((d) => ({ kind: "letter" as const, doc: d }));
    if (tab === "resumes") return r;
    if (tab === "letters") return l;
    return [...r, ...l].sort((a, b) => new Date(b.doc.updatedAt).getTime() - new Date(a.doc.updatedAt).getTime());
  }, [resumes, coverLetters, tab]);

  if (!loaded) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="soft-card animate-pulse rounded-2xl p-5">
            <div className="aspect-[3/4] rounded-xl bg-outline/15" />
            <div className="mt-4 h-4 w-2/3 rounded bg-outline/15" />
            <div className="mt-2 h-3 w-1/2 rounded bg-outline/10" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyState tab={tab} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.slice(0, 6).map((item) =>
        item.kind === "resume" ? (
          <ResumeDocCard key={`r-${item.doc.id}`} doc={item.doc} />
        ) : (
          <LetterDocCard key={`l-${item.doc.id}`} doc={item.doc} />
        )
      )}
    </div>
  );
}

/* ── Resume Doc Card ───────────────────────────────────── */
function ResumeDocCard({ doc }: { doc: RecentResume }) {
  const name = [doc.data.firstName, doc.data.lastName].filter(Boolean).join(" ") || doc.title || "Untitled";
  const title = doc.data.title || "—";
  const templateName = doc.template?.name || "Modern Minimalist";
  const accent = "#0058bc";

  return (
    <Link
      href="/resume"
      className="card-tilt soft-card group flex h-full flex-col overflow-hidden rounded-2xl transition hover:border-primary/40"
    >
      <div
        className="relative flex aspect-[3/4] items-end overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accent}0d, ${accent}22)` }}
      >
        <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-ink shadow-sm backdrop-blur">
          <Icon name="document" className="text-sm" />
          Resume
        </div>
        <div className="absolute inset-x-0 top-1/3 px-5">
          <p className="truncate text-lg font-bold tracking-tight text-ink">{name}</p>
          <p className="mt-1 truncate text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
            {title}
          </p>
          <div className="mt-2 h-px w-12" style={{ background: accent }} />
        </div>
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink">{templateName}</p>
          <p className="mt-0.5 text-xs text-muted">Updated {formatRelativeTime(doc.updatedAt)}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition group-hover:bg-primary group-hover:text-white">
          Open <Icon name="arrowRight" className="text-sm" />
        </span>
      </div>
    </Link>
  );
}

/* ── Letter Doc Card ───────────────────────────────────── */
function LetterDocCard({ doc }: { doc: RecentCoverLetter }) {
  const accent = "#4648d4";
  return (
    <Link
      href="/cover-letter"
      className="card-tilt soft-card group flex h-full flex-col overflow-hidden rounded-2xl transition hover:border-secondary/40"
    >
      <div
        className="relative flex aspect-[3/4] items-end overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accent}0d, ${accent}22)` }}
      >
        <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-ink shadow-sm backdrop-blur">
          <Icon name="subject" className="text-sm" />
          Cover letter
        </div>
        <div className="absolute inset-x-0 top-1/4 px-5">
          <div className="space-y-2">
            <div className="h-2 w-24 rounded-full" style={{ background: accent + "44" }} />
            <div className="h-2 w-40 rounded-full" style={{ background: accent + "22" }} />
            <div className="h-2 w-32 rounded-full" style={{ background: accent + "22" }} />
            <div className="mt-4 h-px w-10" style={{ background: accent }} />
            <div className="h-2 w-36 rounded-full" style={{ background: accent + "44" }} />
            <div className="h-2 w-44 rounded-full" style={{ background: accent + "22" }} />
            <div className="h-2 w-28 rounded-full" style={{ background: accent + "22" }} />
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink">{doc.title || "Cover letter"}</p>
          <p className="mt-0.5 text-xs text-muted">Updated {formatRelativeTime(doc.updatedAt)}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-lg bg-secondary/10 px-3 py-1.5 text-xs font-bold text-secondary transition group-hover:bg-secondary group-hover:text-white">
          Open <Icon name="arrowRight" className="text-sm" />
        </span>
      </div>
    </Link>
  );
}

/* ── Empty State ───────────────────────────────────────── */
function EmptyState({ tab }: { tab: "all" | "resumes" | "letters" }) {
  const config = {
    all: { icon: "sparkle" as IconName, title: "Nothing here yet", desc: "Start with a resume or a cover letter — your work autosaves and lives here.", primary: { href: "/resume", label: "Create resume" }, secondary: { href: "/cover-letter", label: "Cover letter" } },
    resumes: { icon: "document" as IconName, title: "No resumes yet", desc: "Build your first resume in minutes. Import from LinkedIn or start blank.", primary: { href: "/resume", label: "Create resume" }, secondary: { href: "/templates", label: "Browse templates" } },
    letters: { icon: "subject" as IconName, title: "No cover letters yet", desc: "Pair every application with a tailored cover letter — pick a template to begin.", primary: { href: "/cover-letter", label: "Create cover letter" }, secondary: { href: "/templates", label: "Browse templates" } }
  }[tab];

  return (
    <div className="soft-card flex flex-col items-center gap-4 rounded-2xl px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon name={config.icon} className="text-[28px]" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-ink">{config.title}</h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-muted">{config.desc}</p>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-2.5">
        <Link href={config.primary.href} className="primary-gradient rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-ambient">
          {config.primary.label}
        </Link>
        <Link href={config.secondary.href} className="rounded-xl border border-outline/60 bg-surface px-5 py-2.5 text-sm font-bold text-ink">
          {config.secondary.label}
        </Link>
      </div>
    </div>
  );
}

/* ── Action Tile ───────────────────────────────────────── */
function ActionTile({
  href, icon, title, description, accent, proOnly
}: {
  href: string;
  icon: IconName;
  title: string;
  description: string;
  accent: "primary" | "secondary" | "success" | "warning";
  proOnly?: boolean;
}) {
  const colorMap = {
    primary: { bg: "bg-primary/10", text: "text-primary", glow: "from-primary/15 to-primary/0" },
    secondary: { bg: "bg-secondary/10", text: "text-secondary", glow: "from-secondary/15 to-secondary/0" },
    success: { bg: "bg-success/10", text: "text-success", glow: "from-success/15 to-success/0" },
    warning: { bg: "bg-warning/10", text: "text-warning", glow: "from-warning/15 to-warning/0" }
  }[accent];

  return (
    <Link
      href={href}
      className="card-tilt soft-card group relative overflow-hidden rounded-2xl p-5 transition hover:border-outline/60"
    >
      <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${colorMap.glow} blur-2xl transition-transform duration-500 group-hover:scale-150`} />
      <div className="relative z-10 flex items-start gap-3">
        <div className={`icon-bounce flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorMap.bg} ${colorMap.text}`}>
          <Icon name={icon} className="text-[20px]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold text-ink">{title}</h3>
            {proOnly && (
              <span className="rounded-full bg-warning/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-warning">Pro</span>
            )}
          </div>
          <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
        </div>
      </div>
    </Link>
  );
}

/* ── Utilities ─────────────────────────────────────────── */
function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/* ── Onboarding Modal (unchanged) ──────────────────────── */
function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: "sparkle" as IconName,
      title: "Welcome to CV with AI",
      description: "Build professional, ATS-optimized resumes and cover letters in minutes. Our AI helps you craft content that gets noticed by recruiters.",
      gradient: "from-primary to-secondary"
    },
    {
      icon: "edit" as IconName,
      title: "Create your resume",
      description: "Choose from 100 templates, fill in your details, and let AI optimize your content for maximum impact. Import from LinkedIn to save time.",
      gradient: "from-secondary to-primary"
    },
    {
      icon: "subject" as IconName,
      title: "Generate cover letters",
      description: "Paste a job description and our AI generates a tailored cover letter that matches your experience to the role requirements.",
      gradient: "from-primary to-success"
    },
    {
      icon: "analytics" as IconName,
      title: "Score & export",
      description: "Get your resume scored for ATS compatibility, then export high-resolution PDFs ready to submit. You're all set to land your dream job!",
      gradient: "from-success to-primary"
    }
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md overflow-hidden rounded-3xl bg-surface shadow-2xl">
        <div className="flex justify-center gap-2 px-8 pt-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-8 bg-primary" : i < step ? "w-4 bg-primary/40" : "w-4 bg-outline/30"
              }`}
            />
          ))}
        </div>

        <div className="px-8 pb-4 pt-8 text-center">
          <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${current.gradient} shadow-lg`}>
            <Icon name={current.icon} className="text-[36px] text-white" />
          </div>
          <h2 className="text-2xl font-bold text-ink">{current.title}</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {current.description}
          </p>
        </div>

        <div className="flex gap-3 px-8 pb-8 pt-4">
          {step > 0 ? (
            <button
              className="flex-1 rounded-xl border border-outline/50 bg-surface px-5 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft"
              onClick={() => setStep(step - 1)}
              type="button"
            >
              Back
            </button>
          ) : (
            <button
              className="flex-1 rounded-xl border border-outline/50 bg-surface px-5 py-3 text-sm font-bold text-muted transition hover:bg-surface-soft"
              onClick={onClose}
              type="button"
            >
              Skip
            </button>
          )}
          <button
            className="flex-1 primary-gradient rounded-xl px-5 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-105"
            onClick={() => {
              if (isLast) {
                onClose();
              } else {
                setStep(step + 1);
              }
            }}
            type="button"
          >
            {isLast ? "Get started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
