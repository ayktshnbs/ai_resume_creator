"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type UsageData = {
  isPro: boolean;
  resumeCount: number;
  coverLetterCount: number;
  loaded: boolean;
};

export function useProStatus(): UsageData {
  const { data: session } = useSession();
  const [state, setState] = useState<UsageData>({
    isPro: false,
    resumeCount: 0,
    coverLetterCount: 0,
    loaded: false,
  });

  useEffect(() => {
    if (!session?.user) {
      setState({ isPro: false, resumeCount: 0, coverLetterCount: 0, loaded: true });
      return;
    }

    fetch("/api/user/usage")
      .then((res) => res.json())
      .then((data: { plan?: string; resumeCount?: number; coverLetterCount?: number }) => {
        setState({
          isPro: data.plan === "pro",
          resumeCount: data.resumeCount || 0,
          coverLetterCount: data.coverLetterCount || 0,
          loaded: true,
        });
      })
      .catch(() => setState((s) => ({ ...s, loaded: true })));
  }, [session]);

  return state;
}
