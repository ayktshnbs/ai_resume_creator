"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    if (!password.trim()) {
      setError("Enter your password.");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,88,188,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(70,72,212,0.12),transparent_24%),linear-gradient(180deg,#f9f9ff_0%,#eef2ff_45%,#f9f9ff_100%)] px-4 py-6 text-ink md:px-8 md:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="soft-card flex flex-col justify-between overflow-hidden rounded-2xl p-6 md:p-8 lg:p-10">
          <div>
            <Link className="inline-flex items-center gap-3 text-lg font-bold tracking-tight text-primary" href="/">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-ambient">CV</span>
              CVForge AI
            </Link>
            <p className="mt-8 max-w-xl text-4xl font-extrabold leading-tight tracking-normal text-ink md:text-5xl">
              Build a job-winning CV with AI.
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted md:text-lg">
              Sign in to save your resumes, improve your content with AI, and export professional PDFs.
            </p>

            <ul className="mt-8 grid gap-3 text-sm font-medium text-ink sm:grid-cols-2">
              <FeatureItem text="Save unlimited drafts" />
              <FeatureItem text="Improve summaries and bullets with AI" />
              <FeatureItem text="Choose professional templates" />
              <FeatureItem text="Export clean PDFs" />
            </ul>
          </div>

          <div className="mt-10">
            <MockResumeCard />
          </div>
        </section>

        <section className="flex items-center">
          <div className="soft-card w-full rounded-2xl p-6 shadow-panel md:p-8 lg:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-normal text-ink">Welcome back</h1>
              <p className="mt-2 text-sm leading-6 text-muted">Sign in to continue building your resume.</p>
            </div>

            <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
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
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    autoComplete="current-password"
                    className="field pr-20"
                    id="password"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-xs font-bold text-primary hover:bg-primary/10"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-muted">
                  <input className="h-4 w-4 rounded border-outline/70 text-primary focus:ring-primary" type="checkbox" />
                  Remember me
                </label>
                <Link className="font-semibold text-primary hover:underline" href="/forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button
                className="primary-gradient flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
                type="submit"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <Divider />

              <div className="grid gap-3">
                <SocialButton label="Sign in with Google" onClick={() => void signIn("google", { callbackUrl: "/dashboard" })}>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </SocialButton>
              </div>

              <p className="pt-2 text-center text-sm text-muted">
                Don't have an account?{" "}
                <Link className="font-semibold text-primary hover:underline" href="/signup">
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-outline/40 bg-surface/70 px-4 py-3 shadow-sm">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">+</span>
      <span>{text}</span>
    </li>
  );
}

function MockResumeCard() {
  return (
    <div className="max-w-md rounded-2xl border border-white/70 bg-surface/80 p-4 shadow-panel backdrop-blur-xl">
      <div className="rounded-2xl border border-outline/40 bg-surface-soft p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="h-4 w-40 rounded bg-ink/85" />
            <div className="mt-3 h-2.5 w-28 rounded bg-primary" />
          </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">ATS 94</span>
        </div>
        <div className="mt-5 space-y-4">
          <div>
            <div className="mb-2 h-2.5 w-24 rounded bg-ink/80" />
            <div className="space-y-1.5">
              <div className="h-1.5 rounded bg-outline/40" />
              <div className="h-1.5 rounded bg-outline/30" />
              <div className="h-1.5 w-5/6 rounded bg-outline/30" />
            </div>
          </div>
          <div>
            <div className="mb-2 h-2.5 w-28 rounded bg-primary/70" />
            <div className="space-y-1.5">
              <div className="h-1.5 rounded bg-outline/40" />
              <div className="h-1.5 rounded bg-outline/30" />
              <div className="h-1.5 w-4/5 rounded bg-outline/30" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Strategy", "Leadership", "AI writing"].map((skill) => (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-outline/70 bg-surface px-4 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft"
      onClick={onClick}
      type="button"
    >
      {children}
      {label}
    </button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
      <span className="h-px flex-1 bg-outline/50" />
      or continue with
      <span className="h-px flex-1 bg-outline/50" />
    </div>
  );
}
