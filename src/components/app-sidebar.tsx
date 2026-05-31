"use client";

import { useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icon";
import { useSession, signOut } from "next-auth/react";
import { useProStatus } from "@/lib/use-pro-status";
import { useTheme } from "@/lib/use-theme";
import { useI18n } from "@/lib/i18n";

type AppShellProps = {
  children: ReactNode;
  active?: string;
  fullHeight?: boolean;
};

const navItems = [
  { href: "/dashboard", id: "dashboard", labelKey: "nav.dashboard", icon: "dashboard", marker: "01" },
  { href: "/resume", id: "resume", labelKey: "nav.resume", icon: "resume", marker: "02" },
  { href: "/templates", id: "templates", labelKey: "nav.templates", icon: "template", marker: "03" },
  { href: "/cover-letter", id: "cover-letter", labelKey: "nav.coverLetter", icon: "document", marker: "04" },
] as const;

export function AppShell({ children, active, fullHeight = false }: AppShellProps) {
  const { data: session } = useSession();
  const { isPro } = useProStatus();
  const { dark, toggle: toggleTheme } = useTheme();
  const { t, lang, setLang } = useI18n();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={`min-h-screen noise-paper text-ink-deep ${fullHeight ? "h-screen overflow-hidden" : ""}`}>
      {/* Desktop sidebar — editorial column */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 flex-col border-r-2 border-ink-deep bg-paper-soft lg:flex">
        <div className="flex-1 overflow-y-auto px-5 pt-7">
          <Link href={session ? "/dashboard" : "/"} className="block">
            <p className="font-serif text-[10px] italic text-ink-soft">The Resumé Press</p>
            <p className="font-serif text-[32px] leading-[0.95] text-ink-deep">
              CV <em className="italic text-saffron">with</em> AI
            </p>
            <p className="font-edit mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-ink-soft">
              {t("common.workspace")}
            </p>
          </Link>

          <div className="my-6 rule-thin" />

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-baseline gap-3 px-3 py-3 transition ${
                    isActive
                      ? "bg-ink-deep text-paper-soft"
                      : "text-ink-deep hover:bg-paper-warm"
                  }`}
                >
                  <span className={`font-serif text-sm italic ${isActive ? "text-saffron-bright" : "text-saffron"}`}>
                    {item.marker}
                  </span>
                  <span className="font-serif text-[18px] capitalize">
                    {t(item.labelKey)}
                  </span>
                  {isActive && (
                    <span className="ml-auto self-center font-serif text-base italic text-saffron-bright">→</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="shrink-0 space-y-4 border-t-2 border-ink-deep px-5 py-5">
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="flex flex-1 items-center justify-center gap-2 border border-ink-deep px-3 py-2 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-ink-deep transition hover:bg-ink-deep hover:text-paper-soft"
            >
              <Icon name={dark ? "lightMode" : "darkMode"} className="text-[16px]" />
              {dark ? t("nav.lightMode") : t("nav.darkMode")}
            </button>
            <button
              onClick={() => setLang(lang === "en" ? "tr" : "en")}
              className="border border-ink-deep px-3 py-2 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-ink-deep transition hover:bg-ink-deep hover:text-paper-soft"
            >
              {lang === "en" ? "TR" : "EN"}
            </button>
          </div>
          {session ? (
            <div className="border-t border-ink-deep/20 pt-4">
              <p className="font-serif text-[10px] italic text-saffron">— Subscriber —</p>
              <div className="mt-1 flex items-baseline justify-between gap-2">
                <p className="font-serif truncate text-[17px] text-ink-deep">{session.user?.name}</p>
                {isPro && (
                  <span className="border border-saffron px-1.5 py-0 font-edit text-[9px] font-bold uppercase tracking-[0.18em] text-saffron">Pro</span>
                )}
              </div>
              <button
                onClick={() => void signOut()}
                className="mt-2 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft transition hover:text-oxblood"
              >
                {t("nav.signOut")} →
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="flex items-center justify-center gap-2 bg-ink-deep px-4 py-3 font-edit text-[11px] font-bold uppercase tracking-[0.18em] text-paper-soft transition hover:bg-saffron"
            >
              {t("nav.signIn")} →
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile editorial header */}
      <header className="sticky top-0 z-20 border-b-2 border-ink-deep bg-paper-soft px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <Link href={session ? "/dashboard" : "/"} className="font-serif text-2xl text-ink-deep">
            CV <em className="italic text-saffron">with</em> AI
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center border border-ink-deep text-ink-deep transition hover:bg-ink-deep hover:text-paper-soft"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Toggle navigation"
          >
            {drawerOpen ? (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            )}
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-deep/55" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-80 max-w-[88vw] flex-col border-r-2 border-ink-deep bg-paper-soft px-6 py-7 shadow-2xl">
            <div className="flex items-baseline justify-between">
              <Link href={session ? "/dashboard" : "/"} className="block" onClick={() => setDrawerOpen(false)}>
                <p className="font-serif text-[10px] italic text-ink-soft">The Resumé Press</p>
                <p className="font-serif text-[28px] leading-[0.95] text-ink-deep">
                  CV <em className="italic text-saffron">with</em> AI
                </p>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                className="font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-ink-deep"
                aria-label="Close menu"
              >
                Close ×
              </button>
            </div>

            <div className="my-6 rule-thin" />

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-baseline gap-3 px-3 py-3 transition ${
                      isActive
                        ? "bg-ink-deep text-paper-soft"
                        : "text-ink-deep hover:bg-paper-warm"
                    }`}
                  >
                    <span className={`font-serif text-sm italic ${isActive ? "text-saffron-bright" : "text-saffron"}`}>
                      {item.marker}
                    </span>
                    <span className="font-serif text-xl capitalize">{t(item.labelKey)}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-4 border-t-2 border-ink-deep pt-5">
              <div className="flex gap-2">
                <button
                  onClick={toggleTheme}
                  className="flex flex-1 items-center justify-center gap-2 border border-ink-deep px-3 py-2.5 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-ink-deep transition hover:bg-ink-deep hover:text-paper-soft"
                >
                  <Icon name={dark ? "lightMode" : "darkMode"} className="text-[16px]" />
                  {dark ? t("nav.lightMode") : t("nav.darkMode")}
                </button>
                <button
                  onClick={() => setLang(lang === "en" ? "tr" : "en")}
                  className="border border-ink-deep px-3 py-2.5 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-ink-deep transition hover:bg-ink-deep hover:text-paper-soft"
                >
                  {lang === "en" ? "TR" : "EN"}
                </button>
              </div>
              {session ? (
                <div className="border-t border-ink-deep/20 pt-3">
                  <p className="font-serif text-[10px] italic text-saffron">— Subscriber —</p>
                  <p className="mt-1 truncate font-serif text-lg text-ink-deep">{session.user?.name}</p>
                  <button
                    onClick={() => void signOut()}
                    className="mt-2 font-edit text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft transition hover:text-oxblood"
                  >
                    {t("nav.signOut")} →
                  </button>
                </div>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-center gap-2 bg-ink-deep px-4 py-3 font-edit text-[11px] font-bold uppercase tracking-[0.18em] text-paper-soft transition hover:bg-saffron"
                >
                  {t("nav.signIn")} →
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}

      <main className={`${fullHeight ? "h-screen overflow-hidden" : "min-h-screen"} relative z-10 lg:pl-72`}>
        {children}
      </main>
    </div>
  );
}
