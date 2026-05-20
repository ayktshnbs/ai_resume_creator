"use client";

import { AppShell } from "@/components/app-sidebar";
import { Icon } from "@/components/icon";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { PaymentButton } from "@/components/payment-button";

export default function DashboardPage() {
  const { data: session } = useSession();
  const isPro = false; // TODO: Connect to backend status

  return (
    <AppShell active="dashboard">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 md:px-10 md:py-12">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-normal text-ink md:text-4xl">Elevate Your Professional Narrative</h1>
            <p className="mt-2 text-lg text-muted">Your executive workspace for high-impact resumes and strategic career documents.</p>
          </div>
          {!isPro && (
            <PaymentButton
              price="149"
              className="primary-gradient rounded-xl px-6 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-105"
            >
              Upgrade to Pro
            </PaymentButton>
          )}
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <Link
            className="soft-card group relative overflow-hidden rounded-2xl p-8 transition hover:-translate-y-0.5 hover:shadow-panel lg:col-span-2"
            href="/resume"
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl transition group-hover:bg-primary/10" />
            <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-start">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                  <Icon name="add" />
                </div>
                <h2 className="text-2xl font-bold text-ink">New Professional Document</h2>
                <p className="mt-3 max-w-xl leading-7 text-muted">
                  Draft a results-driven resume from scratch or use AI-powered optimization to refine your expertise for the market.
                </p>
              </div>
              <span className="primary-gradient rounded-xl px-5 py-3 text-sm font-bold text-white">Launch Builder</span>
            </div>
          </Link>

          <div className="soft-card rounded-2xl bg-surface-soft p-6">
            <div className="mb-4 flex items-center gap-3">
              <Icon className="text-primary" name="analytics" />
              <h3 className="font-bold text-ink">Portfolio Overview</h3>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-extrabold text-primary">0</span>
              <span className="mb-2 text-sm font-bold text-muted">Documents</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">Your curated documents will appear here once you authenticate and save your first executive draft.</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-outline/30">
              <div className="h-full w-0 rounded-full bg-primary" />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink">Executive Portfolio</h2>
            <Link className="flex items-center gap-1 text-sm font-bold text-primary" href="/templates">
              View designs <Icon className="h-4 w-4" name="arrowRight" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link className="soft-card flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-dashed p-8 text-center transition hover:border-primary hover:bg-surface-soft" href="/resume">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-soft text-primary">
                <Icon className="h-7 w-7" name="document" />
              </div>
              <h3 className="font-bold text-ink">No documents yet</h3>
              <p className="mt-2 max-w-64 text-sm leading-6 text-muted">Begin by creating a new professional resume or selecting a high-fidelity template.</p>
              <span className="primary-gradient mt-6 rounded-xl px-4 py-2 text-sm font-bold text-white">New Resume</span>
            </Link>
            <Link className="soft-card flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-dashed p-8 text-center transition hover:border-primary hover:bg-surface-soft" href="/templates">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-soft text-primary">
                <Icon className="h-7 w-7" name="palette" />
              </div>
              <h3 className="font-bold text-ink">Browse designs</h3>
              <p className="mt-2 max-w-64 text-sm leading-6 text-muted">Explore our gallery of ATS-optimized layouts tailored for various career stages.</p>
              <span className="mt-6 rounded-xl border border-outline/70 bg-white px-4 py-2 text-sm font-bold text-ink">View Designs</span>
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
