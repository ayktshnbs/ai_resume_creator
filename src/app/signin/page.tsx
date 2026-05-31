"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useI18n } from "@/lib/i18n";

export default function SignInPage() {
  const router = useRouter();
  const { status } = useSession();
  const { t } = useI18n();
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
    <main className="min-h-screen noise-paper text-ink-deep">
      {/* Top date strip */}
      <div className="border-b border-ink-deep/15">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-soft md:px-12">
          <Link href="/" className="hover:text-saffron">← Back to the Press</Link>
          <span className="font-serif italic normal-case tracking-normal text-saffron">— Subscriber sign-in —</span>
          <span className="hidden md:inline">VOL. MMXXVI · NO. 01</span>
        </div>
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1400px] gap-0 px-0 md:grid-cols-[1.05fr_0.95fr]">
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

            <p className="font-serif text-sm italic text-saffron">No. 01 — Subscriber portal</p>
            <h1 className="headline-editorial mt-3 text-[44px] leading-[0.95] md:text-[64px]">
              Pick up <em>where</em><br />you left off.
            </h1>
            <p className="font-serif mt-6 max-w-md text-[17px] italic leading-snug text-ink-soft">
              Your drafts, anthology and AI editor — all waiting in The Desk. Sign in to publish tomorrow's edition.
            </p>

            <ul className="mt-8 space-y-2">
              <FeatureItem marker="§01" text="Save unlimited drafts to your desk" />
              <FeatureItem marker="§02" text="Send your copy to the AI editor" />
              <FeatureItem marker="§03" text="Choose from the typeset anthology" />
              <FeatureItem marker="§04" text="Export hi-res, recruiter-ready PDFs" />
            </ul>
          </div>

          <div className="mt-10">
            <MockResumeCard />
          </div>
        </section>

        {/* Right — sign in form */}
        <section className="flex items-center px-6 py-10 md:px-12 md:py-14">
          <div className="w-full max-w-md">
            <div className="mb-7">
              <p className="font-serif text-sm italic text-saffron">— Subscriber sign-in —</p>
              <h2 className="headline-editorial mt-2 text-[40px] md:text-[48px]">
                {t("auth.welcomeBack")}
              </h2>
              <p className="font-serif mt-3 text-base italic text-ink-soft">{t("auth.signInContinue")}</p>
            </div>

            <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
              {error && (
                <p className="border-2 border-oxblood bg-oxblood/[0.06] px-4 py-3 font-serif text-sm italic text-oxblood" role="alert">
                  — {error}
                </p>
              )}

              <EditorialField label={t("auth.email")} id="email">
                <input
                  autoComplete="email"
                  className="w-full border-b-2 border-ink-deep bg-transparent py-2 font-serif text-[17px] text-ink-deep outline-none placeholder:text-ink-quiet/60 focus:border-saffron"
                  id="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                />
              </EditorialField>

              <EditorialField label={t("auth.password")} id="password">
                <div className="relative">
                  <input
                    autoComplete="current-password"
                    className="w-full border-b-2 border-ink-deep bg-transparent py-2 pr-16 font-serif text-[17px] text-ink-deep outline-none placeholder:text-ink-quiet/60 focus:border-saffron"
                    id="password"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-0 top-1/2 -translate-y-1/2 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </EditorialField>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 font-serif italic text-ink-soft">
                  <input className="h-4 w-4 accent-saffron" type="checkbox" />
                  {t("auth.rememberMe")}
                </label>
                <Link className="font-edit text-[11px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep" href="/forgot-password">
                  {t("auth.forgotPassword")} →
                </Link>
              </div>

              <button
                className="btn-editorial w-full justify-center"
                disabled={loading}
                type="submit"
              >
                {loading ? `${t("auth.signingIn")} ...` : `${t("auth.signInBtn")} →`}
              </button>

              <Divider />

              <SocialButton label={t("auth.googleSignIn")} onClick={() => void signIn("google", { callbackUrl: "/dashboard" })}>
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </SocialButton>

              <p className="pt-2 text-center font-serif text-sm italic text-ink-soft">
                {t("auth.noAccount")}{" "}
                <Link className="font-edit not-italic text-[11px] font-bold uppercase tracking-[0.18em] text-saffron hover:text-ink-deep" href="/signup">
                  {t("auth.createOne")} →
                </Link>
              </p>
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

function FeatureItem({ marker, text }: { marker: string; text: string }) {
  return (
    <li className="flex items-baseline gap-3 border-b border-ink-deep/15 py-2">
      <span className="font-serif text-sm italic text-saffron">{marker}</span>
      <span className="font-serif text-[16px] text-ink-deep">{text}</span>
    </li>
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
