"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-sidebar";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/payment/status");
        const data = await res.json();

        if (data.plan === "pro") {
          setStatus("success");
        } else {
          setTimeout(checkStatus, 2000);
        }
      } catch {
        setStatus("error");
      }
    }

    checkStatus();
  }, []);

  return (
    <AppShell>
      <div className="noise-paper min-h-screen">
        <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-20 md:py-28">
          {status === "verifying" && (
            <>
              <p className="font-serif text-sm italic text-saffron">— On the press —</p>
              <h1 className="headline-editorial text-[48px] md:text-[68px]">
                Verifying <em>payment</em>...
              </h1>
              <p className="font-serif text-lg italic leading-snug text-ink-soft">
                Hold the front page — we&apos;re confirming your transaction with the printer. Please don&apos;t refresh.
              </p>
              <div className="mt-4 flex items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-deep/20 border-t-saffron" />
                <p className="font-serif text-sm italic text-ink-soft">Setting the type ...</p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <p className="font-serif text-sm italic text-moss">— Welcome aboard —</p>
              <h1 className="headline-editorial text-[48px] md:text-[80px]">
                You&apos;re a <em>Pro</em> subscriber.
              </h1>
              <p className="font-serif text-lg italic leading-snug text-ink-soft">
                The full press is now at your disposal: unlimited drafts, the AI editor, all premium templates, and
                hi-res PDF exports. Tomorrow&apos;s edition starts now.
              </p>
              <div className="my-2 border-y-2 border-ink-deep py-4">
                <div className="grid grid-cols-3 divide-x divide-ink-deep/30 text-center">
                  {[
                    ["∞", "documents"],
                    ["100", "templates"],
                    ["300", "DPI PDF"],
                  ].map(([v, l]) => (
                    <div key={l} className="px-3">
                      <p className="font-serif text-3xl text-ink-deep">{v}</p>
                      <p className="font-serif text-xs italic text-ink-soft">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/dashboard" className="btn-editorial w-fit">
                Open The Desk →
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <p className="font-serif text-sm italic text-oxblood">— Delay at the print room —</p>
              <h1 className="headline-editorial text-[48px] md:text-[68px]">
                Verification <em>delayed</em>.
              </h1>
              <p className="font-serif text-lg italic leading-snug text-ink-soft">
                We couldn&apos;t confirm your Pro status immediately. If you completed the payment, your account will
                be upgraded shortly — usually within a minute.
              </p>
              <Link href="/dashboard" className="btn-editorial btn-editorial-ghost w-fit">
                Check the dashboard later →
              </Link>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
