"use client";

import { useCallback, useEffect, useState } from "react";

export type QuotaKind = "resume" | "cover_letter";

export type QuotaBucket = { limit: number; used: number; remaining: number };

export type Quota = {
  actor: "user" | "guest";
  isPro: boolean;
  resume: QuotaBucket;
  cover_letter: QuotaBucket;
};

export type ConsumeFailureReason =
  | "limit_reached"
  | "rate_limited"
  | "needs_signin"
  | "needs_upgrade"
  | "template_locked"
  | "network_error";

export type ConsumeResult =
  | { ok: true; token: string; quota: Quota; refundUntil: number }
  | { ok: false; reason: ConsumeFailureReason; quota?: Quota; retryAfterSec?: number };

const QUOTA_EVENT = "usage-quota:refresh";

/**
 * React hook for the freemium usage quota.
 *
 * Returns:
 *   • the current quota (lazy-fetched once on mount, then refreshed by
 *     window events whenever any caller has just consumed)
 *   • imperative helpers: consume(), refund(), refresh()
 *
 * Components should never call /api/usage/* themselves — go through this hook
 * so the global cached quota stays consistent across tabs and across the
 * resume/cover-letter pages.
 */
export function useUsageQuota() {
  const [quota, setQuota] = useState<Quota | null>(null);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/usage/me", { credentials: "include" });
      if (!res.ok) return;
      const data = (await res.json()) as { ok: boolean } & Quota;
      if (data.ok) setQuota(data);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const handler = () => void refresh();
    window.addEventListener(QUOTA_EVENT, handler);
    // Cross-tab sync: any tab that updates the quota writes a marker to
    // localStorage; other tabs notice and refresh.
    const storageHandler = (e: StorageEvent) => {
      if (e.key === QUOTA_EVENT) void refresh();
    };
    window.addEventListener("storage", storageHandler);
    return () => {
      window.removeEventListener(QUOTA_EVENT, handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, [refresh]);

  const consume = useCallback(async (kind: QuotaKind, options?: { templateId?: number | string }): Promise<ConsumeResult> => {
    let result: ConsumeResult;
    try {
      const res = await fetch("/api/usage/consume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, templateId: options?.templateId }),
        credentials: "include"
      });
      const data = (await res.json()) as Partial<ConsumeResult> & {
        ok?: boolean;
        reason?: ConsumeFailureReason;
        retryAfterSec?: number;
        quota?: Quota;
        token?: string;
        refundUntil?: number;
      };
      if (res.ok && data.ok && data.token && data.quota) {
        result = { ok: true, token: data.token, quota: data.quota, refundUntil: data.refundUntil || Date.now() };
      } else {
        result = {
          ok: false,
          reason: (data.reason as ConsumeFailureReason) || "limit_reached",
          quota: data.quota,
          retryAfterSec: data.retryAfterSec
        };
      }
    } catch {
      result = { ok: false, reason: "network_error" };
    }
    if (result.ok || result.quota) {
      const q = result.ok ? result.quota : result.quota!;
      setQuota(q);
      try {
        localStorage.setItem(QUOTA_EVENT, String(Date.now()));
      } catch {
        /* private mode etc — non-fatal */
      }
      window.dispatchEvent(new Event(QUOTA_EVENT));
    }
    return result;
  }, []);

  const refund = useCallback(async (token: string) => {
    try {
      await fetch("/api/usage/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        credentials: "include"
      });
    } finally {
      await refresh();
    }
  }, [refresh]);

  return { quota, loaded, consume, refund, refresh };
}
