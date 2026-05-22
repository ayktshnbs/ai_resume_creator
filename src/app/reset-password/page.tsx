"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent, Suspense } from "react";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error || "Something went wrong.");
        return;
      }

      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Invalid reset link</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          This password reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-surface-soft px-4 py-3 text-sm font-bold text-ink transition hover:bg-outline/20"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Password updated</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Link
          href="/signin"
          className="primary-gradient mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-105"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Set new password</h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        Choose a strong password for your account.
      </p>

      <form className="mt-6 space-y-5" onSubmit={(e) => void handleSubmit(e)}>
        {error && (
          <p className="rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-semibold text-error" role="alert">
            {error}
          </p>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="password">
            New password
          </label>
          <div className="relative">
            <input
              autoComplete="new-password"
              className="field pr-20"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-xs font-bold text-primary hover:bg-primary/10"
              onClick={() => setShowPassword((v) => !v)}
              type="button"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            autoComplete="new-password"
            className={`field ${confirmPassword && password !== confirmPassword ? "border-error ring-1 ring-error/30" : ""}`}
            id="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="mt-1 text-xs font-semibold text-error">Passwords do not match</p>
          )}
        </div>

        <button
          className="primary-gradient flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
          type="submit"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,88,188,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(70,72,212,0.12),transparent_24%),linear-gradient(180deg,#f9f9ff_0%,#eef2ff_45%,#f9f9ff_100%)] px-4 py-6 text-ink md:px-8 md:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md items-center">
        <div className="soft-card w-full rounded-2xl p-6 shadow-panel md:p-10">
          <Link className="mb-8 inline-flex items-center gap-3 text-lg font-bold tracking-tight text-primary" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-ambient">
              CV
            </span>
            CV with AI
          </Link>
          <Suspense fallback={<div className="py-8 text-center text-sm text-muted">Loading...</div>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
