"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export function useAutoSaveToDb(
  apiPath: string,
  data: unknown,
  loaded: boolean,
  docIdRef: React.MutableRefObject<string | null>,
) {
  const { data: session } = useSession();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!loaded || !session?.user) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      if (savingRef.current) return;
      savingRef.current = true;

      const body: Record<string, unknown> = { data };
      if (docIdRef.current) body.id = docIdRef.current;

      fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then(async (res) => {
          if (res.ok) {
            const result = (await res.json()) as { id: string };
            if (result.id) docIdRef.current = result.id;
          }
        })
        .catch(() => {})
        .finally(() => {
          savingRef.current = false;
        });
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [apiPath, data, loaded, session, docIdRef]);
}

export async function loadFromDb<T>(apiPath: string): Promise<{ id: string; data: T } | null> {
  try {
    const res = await fetch(apiPath);
    if (!res.ok) return null;
    const items = (await res.json()) as Array<{ id: string; data: T }>;
    if (items.length === 0) return null;
    return items[0];
  } catch {
    return null;
  }
}
