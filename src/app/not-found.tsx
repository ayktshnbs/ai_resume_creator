import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 text-center text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,88,188,0.10),transparent_55%)]"
      />
      <div className="relative z-10 flex max-w-lg flex-col items-center">
        <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
          Error 404
        </span>
        <p className="gradient-text mt-3 text-7xl font-extrabold leading-none">404</p>
        <h1 className="mt-6 text-2xl font-bold md:text-3xl">This page took a different path</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you
          back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="primary-gradient rounded-xl px-6 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-105"
          >
            Back to home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-outline/60 bg-surface px-6 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
