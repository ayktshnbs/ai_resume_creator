"use client";

import { useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icon";
import { AuroraBackground } from "@/components/aurora-background";
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
  { href: "/dashboard", id: "dashboard", labelKey: "nav.dashboard", icon: "dashboard" },
  { href: "/resume", id: "resume", labelKey: "nav.resume", icon: "resume" },
  { href: "/templates", id: "templates", labelKey: "nav.templates", icon: "template" },
  { href: "/cover-letter", id: "cover-letter", labelKey: "nav.coverLetter", icon: "document" },
] as const;

export function AppShell({ children, active, fullHeight = false }: AppShellProps) {
  const { data: session } = useSession();
  const { isPro } = useProStatus();
  const { dark, toggle: toggleTheme } = useTheme();
  const { t, lang, setLang } = useI18n();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={`min-h-screen text-ink ${fullHeight ? "h-screen overflow-hidden" : ""}`}>
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 overflow-y-auto border-r border-outline bg-surface/90 px-5 py-6 shadow-ambient backdrop-blur lg:flex lg:flex-col">
        <div className="flex-1">
          <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-ambient">
              <Icon name="sparkle" className="text-[22px]" />
            </div>
            <div>
              <p className="font-label text-lg font-bold text-ink">CV with AI</p>
              <p className="text-xs text-muted">{t("common.workspace")}</p>
            </div>
          </Link>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted hover:bg-surface-soft hover:text-ink"
                  }`}
                >
                  <Icon name={item.icon} className="text-[20px]" />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto space-y-4 pt-6 border-t border-outline/40">
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="flex flex-1 items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-surface-soft hover:text-ink"
            >
              <Icon name={dark ? "lightMode" : "darkMode"} className="text-[20px]" />
              {dark ? t("nav.lightMode") : t("nav.darkMode")}
            </button>
            <button
              onClick={() => setLang(lang === "en" ? "tr" : "en")}
              className="flex items-center gap-1.5 rounded-2xl px-3 py-2.5 text-sm font-bold text-muted transition hover:bg-surface-soft hover:text-ink"
            >
              {lang === "en" ? "TR" : "EN"}
            </button>
          </div>
          {session ? (
            <div className="flex items-center justify-between gap-3 px-2">
              <div className="flex items-center gap-3">
                {session.user?.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon name="user" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-ink">{session.user?.name}</p>
                    {isPro && <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-black text-primary">PRO</span>}
                  </div>
                  <button onClick={() => void signOut()} className="text-xs font-semibold text-muted hover:text-error transition">
                    {t("nav.signOut")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/signin"
              className="mx-2 flex items-center gap-3 rounded-2xl primary-gradient px-4 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-110"
            >
              <Icon name="user" className="text-[20px]" />
              {t("nav.signIn")}
            </Link>
          )}
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-outline bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Link href={session ? "/dashboard" : "/"} className="font-label text-lg font-bold text-ink">
            CV with AI
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink transition hover:bg-surface-soft"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Toggle navigation"
          >
            {drawerOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            )}
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-outline bg-surface px-5 py-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-3" onClick={() => setDrawerOpen(false)}>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-ambient">
                  <Icon name="sparkle" className="text-[22px]" />
                </div>
                <div>
                  <p className="font-label text-lg font-bold text-ink">CV with AI</p>
                  <p className="text-xs text-muted">{t("common.workspace")}</p>
                </div>
              </Link>
            </div>
            <nav className="mt-8 space-y-2">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted hover:bg-surface-soft hover:text-ink"
                    }`}
                  >
                    <Icon name={item.icon} className="text-[20px]" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto space-y-4 border-t border-outline/40 pt-6">
              <div className="flex gap-2">
                <button
                  onClick={toggleTheme}
                  className="flex flex-1 items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-surface-soft hover:text-ink"
                >
                  <Icon name={dark ? "lightMode" : "darkMode"} className="text-[20px]" />
                  {dark ? t("nav.lightMode") : t("nav.darkMode")}
                </button>
                <button
                  onClick={() => setLang(lang === "en" ? "tr" : "en")}
                  className="flex items-center gap-1.5 rounded-2xl px-3 py-2.5 text-sm font-bold text-muted transition hover:bg-surface-soft hover:text-ink"
                >
                  {lang === "en" ? "TR" : "EN"}
                </button>
              </div>
              {session ? (
                <div className="flex items-center justify-between gap-3 px-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon name="user" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{session.user?.name}</p>
                      <button onClick={() => void signOut()} className="text-xs font-semibold text-muted hover:text-error transition">
                        {t("nav.signOut")}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 rounded-2xl primary-gradient px-4 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-110"
                >
                  <Icon name="user" className="text-[20px]" />
                  {t("nav.signIn")}
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}

      <AuroraBackground />
      <main className={`${fullHeight ? "h-screen overflow-hidden" : "min-h-screen"} relative z-10 lg:pl-72`}>
        {children}
      </main>
    </div>
  );
}
