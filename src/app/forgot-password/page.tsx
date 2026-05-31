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
    <main className="min-h-screen noise-paper text-ink-deep">
      <div className="border-b border-ink-deep/15">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-soft md:px-12">
          <Link href="/signin" className="hover:text-saffron">← Back to sign-in</Link>
          <span className="font-serif italic normal-case tracking-normal text-saffron">— Forgot password —</span>
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

          {sent ? (
            <div>
              <p className="font-serif text-sm italic text-saffron">— Sent. Check your inbox. —</p>
              <h1 className="headline-editorial mt-3 text-[40px] md:text-[52px]">
                Check your <em>email</em>.
              </h1>
              <p className="font-serif mt-4 text-base italic leading-snug text-ink-soft">
                If an account exists for <span className="not-italic font-semibold text-ink-deep">{email}</span>, we&apos;ve posted a password reset link. Check your inbox — and the spam folder, just in case.
              </p>
              <Link href="/signin" className="btn-editorial btn-editorial-ghost mt-8 w-full justify-center">
                Back to sign-in →
              </Link>
            </div>
          ) : (
            <div>
              <p className="font-serif text-sm italic text-saffron">— Lost the key? —</p>
              <h1 className="headline-editorial mt-3 text-[40px] md:text-[52px]">
                Forgot your <em>password</em>?
              </h1>
              <p className="font-serif mt-4 text-base italic leading-snug text-ink-soft">
                Enter your email and we&apos;ll post you a fresh reset link.
              </p>

              <form className="mt-7 space-y-5" onSubmit={(e) => void handleSubmit(e)}>
                {error && (
                  <p className="border-2 border-oxblood bg-oxblood/[0.06] px-4 py-3 font-serif text-sm italic text-oxblood" role="alert">
                    — {error}
                  </p>
                )}

                <div>
                  <label className="block font-edit text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft" htmlFor="email">
                    Email
                  </label>
                  <input
                    autoComplete="email"
                    className="mt-1.5 w-full border-b-2 border-ink-deep bg-transparent py-2 font-serif text-[17px] text-ink-deep outline-none placeholder:text-ink-quiet/60 focus:border-saffron"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                  />
                </div>

                <button
                  className="btn-editorial w-full justify-center"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Sending ..." : "Send reset link →"}
                </button>

                <p className="text-center font-serif text-sm italic text-ink-soft">
                  Remembered it?{" "}
                  <Link className="font-edit not-italic text-[11px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep" href="/signin">
                    Sign in →
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
