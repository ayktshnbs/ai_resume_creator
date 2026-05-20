"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-sidebar";
import { Icon } from "@/components/icon";
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
          // Keep polling or show verifying state
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
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 px-4 py-20 text-center">
        {status === "verifying" && (
          <>
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <h1 className="text-3xl font-bold">Verifying Payment...</h1>
            <p className="text-muted text-lg">Please wait while we confirm your transaction. Do not refresh this page.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
              <Icon name="sparkle" className="text-4xl" />
            </div>
            <h1 className="text-3xl font-bold">Welcome to CVForge AI Pro!</h1>
            <p className="text-muted text-lg">Your account has been upgraded. You now have full access to all premium templates and AI features.</p>
            <Link href="/dashboard" className="primary-gradient rounded-xl px-8 py-3 font-bold text-white transition hover:brightness-105">
              Go to Dashboard
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-error/10 text-error">
              <Icon name="bolt" className="text-4xl" />
            </div>
            <h1 className="text-3xl font-bold">Verification Delay</h1>
            <p className="text-muted text-lg">We couldn't confirm your Pro status immediately. If you completed the payment, your account will be upgraded shortly.</p>
            <Link href="/dashboard" className="rounded-xl border border-outline px-8 py-3 font-bold text-ink transition hover:bg-surface-soft">
              Check Dashboard Later
            </Link>
          </>
        )}
      </div>
    </AppShell>
  );
}
