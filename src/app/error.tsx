"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";

/**
 * Segment-level error boundary. Catches render/runtime errors thrown anywhere
 * in a route subtree and shows a branded recovery screen instead of the bare
 * Next.js default. `reset()` re-renders the segment so a transient failure can
 * be retried without a full reload.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 text-center text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.08),transparent_55%)]"
      />
      <div className="relative z-10 flex max-w-lg flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 text-error">
          <Icon name="bolt" className="text-[32px]" />
        </div>
        <h1 className="mt-6 text-2xl font-bold md:text-3xl">Something went wrong</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted">
          An unexpected error interrupted this page. Your saved work is safe — try again, or head
          back home.
        </p>
        {error?.digest && (
          <p className="mt-3 font-mono text-xs text-muted/70">Reference: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="primary-gradient rounded-xl px-6 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-105"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-outline/60 bg-surface px-6 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
