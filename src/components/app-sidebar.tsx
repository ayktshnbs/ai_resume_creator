"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icon";
import { useSession, signOut } from "next-auth/react";

type AppShellProps = {
  children: ReactNode;
  active?: string;
  fullHeight?: boolean;
};

const navItems = [
  { href: "/dashboard", id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/resume", id: "resume", label: "Resume Builder", icon: "resume" },
  { href: "/templates", id: "templates", label: "CV Templates", icon: "template" },
  { href: "/cover-letter", id: "cover-letter", label: "Cover Letters", icon: "document" },
] as const;

export function AppShell({ children, active, fullHeight = false }: AppShellProps) {
  const { data: session } = useSession();

  return (
    <div className={`min-h-screen bg-background text-ink ${fullHeight ? "h-screen overflow-hidden" : ""}`}>
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-outline bg-surface/90 px-5 py-6 shadow-ambient backdrop-blur lg:flex flex-col">
        <div className="flex-1">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-ambient">
              <Icon name="sparkle" className="text-[22px]" />
            </div>
            <div>
              <p className="font-label text-lg font-bold text-ink">AI CV Builder</p>
              <p className="text-xs text-muted">Resume workspace</p>
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
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto pt-6 border-t border-outline/40">
          {session ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {session.user?.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon name="user" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">{session.user?.name}</p>
                  <button onClick={() => void signOut()} className="text-xs font-semibold text-muted hover:text-error transition">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/signin"
              className="flex items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm font-bold text-white shadow-ambient transition hover:brightness-110"
            >
              <Icon name="user" className="text-[20px]" />
              Sign In
            </Link>
          )}
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-outline bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-label text-lg font-bold text-ink">
            AI CV Builder
          </Link>
          {session ? (
             <button onClick={() => void signOut()} className="rounded-full bg-outline/40 px-4 py-2 text-sm font-semibold text-ink">
              Sign Out
            </button>
          ) : (
            <Link
              href="/signin"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      <main className={`min-h-screen lg:pl-72 ${fullHeight ? "h-screen" : ""}`}>{children}</main>
    </div>
  );
}