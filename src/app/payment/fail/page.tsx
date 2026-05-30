"use client";

import { AppShell } from "@/components/app-sidebar";
import { Icon } from "@/components/icon";
import Link from "next/link";

export default function PaymentFailPage() {
  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 px-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-error/10 text-error">
          <Icon name="bolt" className="text-4xl" />
        </div>
        <h1 className="text-3xl font-bold">Payment Unsuccessful</h1>
        <p className="text-muted text-lg">Your transaction could not be completed. This might be due to a 3D Secure failure or insufficient funds.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/pricing" className="primary-gradient rounded-xl px-8 py-3 font-bold text-white transition hover:brightness-105">
            Try Again
          </Link>
          <Link href="/dashboard" className="rounded-xl border border-outline px-8 py-3 font-bold text-ink transition hover:bg-surface-soft">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
