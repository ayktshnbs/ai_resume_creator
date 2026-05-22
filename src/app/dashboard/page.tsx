"use client";

import { useSession } from "next-auth/react";
import { AppShell } from "@/components/app-sidebar";
import { Icon, type IconName } from "@/components/icon";
import { useProStatus } from "@/lib/use-pro-status";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { PaymentButton } from "@/components/payment-button";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { isPro, resumeCount, coverLetterCount, loaded } = useProStatus();
  const { t } = useI18n();

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
            <Link href="/signin" className="rounded-xl primary-gradient px-6 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-110">{t("nav.signIn")}</Link>
            <Link href="/signup" className="rounded-xl border border-outline/70 bg-surface px-6 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft">{t("auth.signUpBtn")}</Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const totalDocs = resumeCount + coverLetterCount;
  const maxDocs = isPro ? Infinity : 2;
  const usagePercent = isPro ? 100 : Math.min((totalDocs / maxDocs) * 100, 100);

  return (
    <AppShell active="dashboard">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-10 md:py-12">

        {/* Header */}
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-muted">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Welcome back, {session.user?.name?.split(" ")[0] || "there"}
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/resume"
              className="primary-gradient flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-105"
            >
              <Icon name="add" className="text-lg" />
              New Resume
            </Link>
            <Link
              href="/cover-letter"
              className="flex items-center gap-2 rounded-xl border border-outline/50 bg-surface px-5 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft"
            >
              <Icon name="subject" className="text-lg" />
              Cover Letter
            </Link>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon="document"
            label="Resumes"
            value={loaded ? String(resumeCount) : "—"}
            sub={isPro ? "Unlimited" : `${resumeCount}/1 used`}
            color="primary"
          />
          <StatCard
            icon="subject"
            label="Cover Letters"
            value={loaded ? String(coverLetterCount) : "—"}
            sub={isPro ? "Unlimited" : `${coverLetterCount}/1 used`}
            color="secondary"
          />
          <StatCard
            icon="analytics"
            label="Total Documents"
            value={loaded ? String(totalDocs) : "—"}
            sub="In your portfolio"
            color="success"
          />
          <StatCard
            icon="sparkle"
            label="Plan"
            value={isPro ? "Pro" : "Free"}
            sub={isPro ? "All features unlocked" : "Basic features"}
            color={isPro ? "warning" : "muted"}
          />
        </section>

        {/* Upgrade Banner (Free users) */}
        {!isPro && loaded && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-panel md:p-8">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
            <div className="relative z-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
              <div>
                <h3 className="text-xl font-bold">Unlock your full potential</h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80">
                  Upgrade to Pro for unlimited resumes, AI rewriting, cover letter generator, ATS scoring, and high-res PDF exports.
                </p>
              </div>
              <PaymentButton
                price="6"
                className="shrink-0 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary shadow-lg transition hover:bg-white/90"
              >
                Upgrade to Pro — €6/mo
              </PaymentButton>
            </div>
          </div>
        )}

        {/* Usage Progress (Free users) */}
        {!isPro && loaded && (
          <div className="rounded-2xl border border-outline/30 bg-surface-soft p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-ink">Usage</p>
              <p className="text-xs font-medium text-muted">{totalDocs}/{maxDocs} documents</p>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-outline/20">
              <div
                className={`h-full rounded-full transition-all ${usagePercent >= 100 ? "bg-error" : "bg-primary"}`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            {usagePercent >= 100 && (
              <p className="mt-2 text-xs font-semibold text-error">You&apos;ve reached your free plan limit. Upgrade to create more documents.</p>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <section>
          <h2 className="mb-5 text-xl font-bold text-ink">Quick Actions</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard
              href="/resume"
              icon="edit"
              title="Create Resume"
              description="Start from scratch or import your LinkedIn profile. AI helps you write professional content."
              gradient="from-primary/10 to-primary/5"
              iconColor="text-primary"
            />
            <QuickActionCard
              href="/cover-letter"
              icon="subject"
              title="Cover Letter"
              description="Generate a targeted cover letter from your saved CV data in seconds."
              gradient="from-secondary/10 to-secondary/5"
              iconColor="text-secondary"
            />
            <QuickActionCard
              href="/templates"
              icon="palette"
              title="Browse Templates"
              description="Choose from 50+ professionally designed templates for every career stage."
              gradient="from-success/10 to-success/5"
              iconColor="text-success"
            />
          </div>
        </section>

        {/* Getting Started Tips */}
        <section className="rounded-2xl border border-outline/30 bg-surface-soft p-6 md:p-8">
          <h2 className="mb-5 text-lg font-bold text-ink">Getting Started</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "1", title: "Choose a template", desc: "Pick from 50+ modern designs", done: totalDocs > 0 },
              { step: "2", title: "Fill in your details", desc: "Or import from LinkedIn", done: resumeCount > 0 },
              { step: "3", title: "Enhance with AI", desc: "Optimize for ATS systems", done: false },
              { step: "4", title: "Export PDF", desc: "Download and start applying", done: false },
            ].map((tip) => (
              <div key={tip.step} className="flex items-start gap-3 rounded-xl bg-surface p-4">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${tip.done ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                  {tip.done ? "✓" : tip.step}
                </div>
                <div>
                  <p className={`text-sm font-bold ${tip.done ? "text-success" : "text-ink"}`}>{tip.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: IconName; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="soft-card rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <Icon name={icon} className={`text-${color} text-xl`} />
        <span className="text-xs font-medium text-muted">{label}</span>
      </div>
      <p className="text-3xl font-extrabold text-ink">{value}</p>
      <p className="mt-1 text-xs text-muted">{sub}</p>
    </div>
  );
}

function QuickActionCard({ href, icon, title, description, gradient, iconColor }: { href: string; icon: IconName; title: string; description: string; gradient: string; iconColor: string }) {
  return (
    <Link
      href={href}
      className="soft-card group relative overflow-hidden rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-panel"
    >
      <div className={`absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${gradient} blur-2xl transition group-hover:scale-150`} />
      <div className="relative z-10">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} ${iconColor}`}>
          <Icon name={icon} className="text-xl" />
        </div>
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      </div>
    </Link>
  );
}
