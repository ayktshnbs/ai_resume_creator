"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error || "Something went wrong.");
        return;
      }

      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,88,188,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(70,72,212,0.12),transparent_24%),linear-gradient(180deg,#f9f9ff_0%,#eef2ff_45%,#f9f9ff_100%)] px-4 py-6 text-ink md:px-8 md:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md items-center">
        <div className="soft-card w-full rounded-2xl p-6 shadow-panel md:p-10">
          <Link className="mb-8 inline-flex items-center gap-3 text-lg font-bold tracking-tight text-primary" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-ambient">
              CV
            </span>
            CVForge AI
          </Link>

          {sent ? (
            <div>
              <h1 className="text-2xl font-extrabold text-ink">Check your email</h1>
              <p className="mt-3 text-sm leading-6 text-muted">
                If an account exists for <strong className="text-ink">{email}</strong>, we sent a password reset link. Check your inbox and spam folder.
              </p>
              <Link
                href="/signin"
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-surface-soft px-4 py-3 text-sm font-bold text-ink transition hover:bg-outline/20"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-extrabold text-ink">Forgot your password?</h1>
              <p className="mt-2 text-sm leading-6 text-muted">
                Enter your email and we'll send you a link to reset your password.
              </p>

              <form className="mt-6 space-y-5" onSubmit={(e) => void handleSubmit(e)}>
                {error && (
                  <p className="rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-semibold text-error" role="alert">
                    {error}
                  </p>
                )}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="email">
                    Email
                  </label>
                  <input
                    autoComplete="email"
                    className="field"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                  />
                </div>

                <button
                  className="primary-gradient flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <p className="text-center text-sm text-muted">
                  Remember your password?{" "}
                  <Link className="font-semibold text-primary hover:underline" href="/signin">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
