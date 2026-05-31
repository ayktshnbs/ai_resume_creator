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
        <p className="font-serif text-sm italic text-oxblood">— Invalid link —</p>
        <h1 className="headline-editorial mt-3 text-[40px] md:text-[52px]">
          Invalid <em>reset</em> link.
        </h1>
        <p className="font-serif mt-4 text-base italic leading-snug text-ink-soft">
          This password reset link is invalid or has expired. Request a fresh one.
        </p>
        <Link href="/forgot-password" className="btn-editorial mt-8 w-full justify-center">
          Request a new link →
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <p className="font-serif text-sm italic text-moss">— Updated. —</p>
        <h1 className="headline-editorial mt-3 text-[40px] md:text-[52px]">
          Password <em>updated</em>.
        </h1>
        <p className="font-serif mt-4 text-base italic leading-snug text-ink-soft">
          Your password has been reset. Sign in with the new one and pick up where you left off.
        </p>
        <Link href="/signin" className="btn-editorial mt-8 w-full justify-center">
          Sign in →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="font-serif text-sm italic text-saffron">— Set a new password —</p>
      <h1 className="headline-editorial mt-3 text-[40px] md:text-[52px]">
        Set a <em>new</em> password.
      </h1>
      <p className="font-serif mt-4 text-base italic leading-snug text-ink-soft">
        Choose something strong — at least 8 characters.
      </p>

      <form className="mt-7 space-y-5" onSubmit={(e) => void handleSubmit(e)}>
        {error && (
          <p className="border-2 border-oxblood bg-oxblood/[0.06] px-4 py-3 font-serif text-sm italic text-oxblood" role="alert">
            — {error}
          </p>
        )}

        <div>
          <label className="block font-edit text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft" htmlFor="password">
            New password
          </label>
          <div className="relative mt-1.5">
            <input
              autoComplete="new-password"
              className="w-full border-b-2 border-ink-deep bg-transparent py-2 pr-16 font-serif text-[17px] text-ink-deep outline-none placeholder:text-ink-quiet/60 focus:border-saffron"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-0 top-1/2 -translate-y-1/2 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep"
              onClick={() => setShowPassword((v) => !v)}
              type="button"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-edit text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft" htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            autoComplete="new-password"
            className={`mt-1.5 w-full border-b-2 bg-transparent py-2 font-serif text-[17px] text-ink-deep outline-none placeholder:text-ink-quiet/60 focus:border-saffron ${confirmPassword && password !== confirmPassword ? "border-oxblood" : "border-ink-deep"}`}
            id="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="mt-1 font-serif text-xs italic text-oxblood">— Passwords do not match.</p>
          )}
        </div>

        <button
          className="btn-editorial w-full justify-center"
          disabled={loading}
          type="submit"
        >
          {loading ? "Resetting ..." : "Reset password →"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen noise-paper text-ink-deep">
      <div className="border-b border-ink-deep/15">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-soft md:px-12">
          <Link href="/signin" className="hover:text-saffron">← Back to sign-in</Link>
          <span className="font-serif italic normal-case tracking-normal text-saffron">— Reset password —</span>
          <span className="hidden md:inline">The Resumé Press</span>
        </div>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md items-center px-6">
        <div className="w-full">
          <Link className="block" href="/">
            <p className="font-serif text-[10px] italic text-ink-soft">The Resumé Press</p>
            <p className="font-serif text-[36px] leading-[0.95] text-ink-deep md:text-[48px]">
              CV <em className="italic text-saffron">with</em> AI
            </p>
          </Link>

          <div className="my-7 rule-thin" />

          <Suspense fallback={<p className="py-8 text-center font-serif italic text-ink-soft">Loading ...</p>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
