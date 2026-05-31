"use client";

import { AppShell } from "@/components/app-sidebar";
import Link from "next/link";

export default function PaymentFailPage() {
  return (
    <AppShell>
      <div className="noise-paper min-h-screen">
        <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-20 md:py-28">
          <p className="font-serif text-sm italic text-oxblood">— A misprint at the till —</p>
          <h1 className="headline-editorial text-[48px] md:text-[72px]">
            Payment <em>unsuccessful</em>.
          </h1>
          <p className="font-serif text-lg italic leading-snug text-ink-soft">
            Your transaction could not be completed. This is usually a 3D Secure check that didn&apos;t clear or a
            funds issue — nothing was charged.
          </p>

          <div className="my-3 border-y-2 border-ink-deep py-4">
            <p className="font-serif text-sm italic text-saffron">— Next edition —</p>
            <ul className="mt-2 space-y-1 font-serif text-[15px] text-ink-deep">
              <li className="flex items-baseline gap-3 border-b border-ink-deep/15 py-1.5">
                <span className="italic text-saffron">·</span>
                <span>Try a different card or 3D Secure code</span>
              </li>
              <li className="flex items-baseline gap-3 border-b border-ink-deep/15 py-1.5">
                <span className="italic text-saffron">·</span>
                <span>Confirm you have sufficient funds</span>
              </li>
              <li className="flex items-baseline gap-3 py-1.5">
                <span className="italic text-saffron">·</span>
                <span>Or come back later — your basket is saved</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/pricing" className="btn-editorial">
              Try again →
            </Link>
            <Link href="/dashboard" className="btn-editorial btn-editorial-ghost">
              Back to The Desk
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
