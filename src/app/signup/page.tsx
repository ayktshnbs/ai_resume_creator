"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useI18n } from "@/lib/i18n";

export default function SignUpPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error || "Something went wrong.");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but sign-in failed. Please sign in manually.");
        router.push("/signin");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const strengthLevels = [
    { label: "weak", color: "bg-oxblood" },
    { label: "fair", color: "bg-saffron" },
    { label: "good", color: "bg-moss-bright" },
    { label: "strong", color: "bg-moss" },
  ];

  return (
    <main className="min-h-screen noise-paper text-ink-deep">
      {/* Top strip */}
      <div className="border-b border-ink-deep/15">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-soft md:px-12">
          <Link href="/" className="hover:text-saffron">← Back to the Press</Link>
          <span className="font-serif italic normal-case tracking-normal text-saffron">— New subscription —</span>
          <span className="hidden md:inline">VOL. MMXXVI · NO. 01</span>
        </div>
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1400px] gap-0 md:grid-cols-[1.05fr_0.95fr]">
        {/* Left — editorial pitch */}
        <section className="hidden flex-col justify-between border-r-2 border-ink-deep px-8 py-10 md:flex md:px-12 md:py-14">
          <div>
            <Link className="block" href="/">
              <p className="font-serif text-[10px] italic text-ink-soft">The Resumé Press</p>
              <p className="font-serif text-[40px] leading-[0.95] text-ink-deep md:text-[56px]">
                CV <em className="italic text-saffron">with</em> AI
              </p>
            </Link>

            <div className="my-8 rule-thin" />

            <p className="font-serif text-sm italic text-saffron">No. 01 — Apply for a subscription</p>
            <h1 className="headline-editorial mt-3 text-[44px] leading-[0.95] md:text-[60px]">
              Start your <em>career</em><br />story today.
            </h1>
            <p className="font-serif mt-6 max-w-md text-[17px] italic leading-snug text-ink-soft">
              Free forever, no card required. Save drafts, generate cover letters, export polished PDFs — all on
              The Desk.
            </p>

            <ul className="mt-8 grid gap-1.5">
              {[
                { m: "§01", t: "Free forever — no credit card" },
                { m: "§02", t: "100 typeset templates from the anthology" },
                { m: "§03", t: "1 CV + 1 cover letter on the free desk" },
                { m: "§04", t: "Live preview & in-line editing" },
                { m: "§05", t: "AI editor & PDF export — Pro" },
                { m: "§06", t: "ATS scoring — Pro" },
              ].map((f) => (
                <li key={f.m} className="flex items-baseline gap-3 border-b border-ink-deep/15 py-2">
                  <span className="font-serif text-sm italic text-saffron">{f.m}</span>
                  <span className="font-serif text-[15px] text-ink-deep">{f.t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <MockResumeCard />
          </div>
        </section>

        {/* Right — form */}
        <section className="flex items-center px-6 py-10 md:px-12 md:py-14">
          <div className="w-full max-w-md">
            <div className="mb-7">
              <p className="font-serif text-sm italic text-saffron">— Subscription application —</p>
              <h2 className="headline-editorial mt-2 text-[40px] md:text-[48px]">
                {t("auth.createAccount")}
              </h2>
              <p className="font-serif mt-3 text-base italic text-ink-soft">
                {t("auth.hasAccount")}{" "}
                <Link className="font-edit not-italic text-[11px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep" href="/signin">
                  {t("auth.signInBtn")} →
                </Link>
              </p>
            </div>

            <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
              {error && (
                <p className="border-2 border-oxblood bg-oxblood/[0.06] px-4 py-3 font-serif text-sm italic text-oxblood" role="alert">
                  — {error}
                </p>
              )}

              <EditorialField label={t("auth.name")} id="fullName">
                <input
                  autoComplete="name"
                  className="w-full border-b-2 border-ink-deep bg-transparent py-2 font-serif text-[17px] text-ink-deep outline-none placeholder:text-ink-quiet/60 focus:border-saffron"
                  id="fullName"
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alexandra Chen"
                  type="text"
                  value={fullName}
                />
              </EditorialField>

              <EditorialField label={t("auth.email")} id="email">
                <input
                  autoComplete="email"
                  className="w-full border-b-2 border-ink-deep bg-transparent py-2 font-serif text-[17px] text-ink-deep outline-none placeholder:text-ink-quiet/60 focus:border-saffron"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                />
              </EditorialField>

              <EditorialField label={t("auth.password")} id="password">
                <div className="relative">
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
                {password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      {strengthLevels.map((s, i) => (
                        <div
                          key={s.label}
                          className={`h-[3px] w-10 ${password.length >= (i + 1) * 3 ? s.color : "bg-ink-deep/15"}`}
                        />
                      ))}
                    </div>
                    <p className="font-serif text-[11px] italic text-ink-soft">
                      {password.length < 3 ? "" : password.length < 6 ? "weak" : password.length < 9 ? "fair" : password.length < 12 ? "good" : "strong"}
                    </p>
                  </div>
                )}
              </EditorialField>

              <EditorialField label={t("auth.confirmPassword")} id="confirmPassword">
                <input
                  autoComplete="new-password"
                  className={`w-full border-b-2 bg-transparent py-2 font-serif text-[17px] text-ink-deep outline-none placeholder:text-ink-quiet/60 focus:border-saffron ${confirmPassword && password !== confirmPassword ? "border-oxblood" : "border-ink-deep"}`}
                  id="confirmPassword"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 font-serif text-xs italic text-oxblood">— Passwords do not match.</p>
                )}
              </EditorialField>

              <p className="font-serif text-xs italic leading-snug text-ink-soft">
                By signing up you agree to our{" "}
                <a className="text-saffron hover:text-ink-deep" href="/terms">Terms of Service</a>{" "}
                and{" "}
                <a className="text-saffron hover:text-ink-deep" href="/privacy">Privacy Policy</a>.
              </p>

              <button
                className="btn-editorial w-full justify-center"
                disabled={loading}
                type="submit"
              >
                {loading ? `${t("auth.creating")} ...` : `${t("auth.createAccount")} →`}
              </button>

              <Divider />

              <SocialButton
                label={t("auth.googleSignUp")}
                onClick={() => void signIn("google", { callbackUrl: "/dashboard" })}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </SocialButton>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function EditorialField({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-edit text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft" htmlFor={id}>
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function MockResumeCard() {
  return (
    <div className="thumb-frame border-2 p-3">
      <div className="bg-paper-soft p-5">
        <div className="border-b-2 border-ink-deep pb-3">
          <p className="font-serif text-[10px] italic text-saffron">— CURRICULUM VITAE —</p>
          <p className="mt-1 font-serif text-2xl text-ink-deep">Alexandra Mitchell</p>
          <p className="font-serif text-xs italic text-ink-soft">Senior Product Manager</p>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <p className="font-serif text-[10px] uppercase tracking-[0.18em] text-ink-soft">§01 — Profile</p>
            <div className="mt-1.5 space-y-1">
              <div className="h-1.5 w-full bg-ink-deep/20" />
              <div className="h-1.5 w-5/6 bg-ink-deep/15" />
              <div className="h-1.5 w-4/5 bg-ink-deep/15" />
            </div>
          </div>
          <div>
            <p className="font-serif text-[10px] uppercase tracking-[0.18em] text-saffron">§02 — Experience</p>
            <div className="mt-1.5 space-y-1">
              <div className="h-1.5 w-full bg-ink-deep/20" />
              <div className="h-1.5 w-4/5 bg-ink-deep/15" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 border-t border-ink-deep/15 pt-3">
            {["Strategy", "Leadership", "AI writing"].map((skill) => (
              <span className="border border-ink-deep px-2 py-0.5 font-edit text-[9px] font-bold uppercase tracking-[0.18em] text-ink-deep" key={skill}>
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
      className="flex w-full items-center justify-center gap-3 border-2 border-ink-deep bg-paper-soft px-4 py-3 font-edit text-[12px] font-bold uppercase tracking-[0.18em] text-ink-deep transition hover:bg-ink-deep hover:text-paper-soft"
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
    <div className="flex items-center gap-3 py-1 font-serif text-xs italic text-ink-soft">
      <span className="h-px flex-1 bg-ink-deep/40" />
      or continue with
      <span className="h-px flex-1 bg-ink-deep/40" />
    </div>
  );
}
