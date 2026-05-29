"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Icon, type IconName } from "@/components/icon";

/**
 * App-wide toast + confirm system.
 *
 * Replaces native `alert()` / `confirm()` (which look out of place against the
 * rest of the UI) with on-brand, animated surfaces. Dependency-free and
 * SSR-safe: a single provider mounted in providers.tsx renders all overlays at
 * the document root, above every modal.
 *
 *   const { toast, confirm } = useToast();
 *   toast("Saved", "success");
 *   if (await confirm({ title: "Delete?", destructive: true })) { ... }
 */

type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type ConfirmState = ConfirmOptions & { resolve: (value: boolean) => void };

type ToastContextValue = {
  toast: (message: string, variant?: ToastVariant) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (ctx) return ctx;
  // Fail soft: a missing provider should never crash a feature. Fall back to
  // the platform primitives so the action still works.
  return {
    toast: (message) => console.warn("[toast] provider missing:", message),
    confirm: async (options) =>
      typeof window !== "undefined" ? window.confirm(options.title) : false,
  };
}

const VARIANT: Record<ToastVariant, { icon: IconName; tone: string }> = {
  success: { icon: "check", tone: "text-success" },
  error: { icon: "close", tone: "text-error" },
  info: { icon: "bolt", tone: "text-primary-bright" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, message, variant }]);
      setTimeout(() => remove(id), 4200);
    },
    [remove]
  );

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ ...options, resolve });
    });
  }, []);

  const closeConfirm = useCallback((value: boolean) => {
    setConfirmState((current) => {
      current?.resolve(value);
      return null;
    });
  }, []);

  // Esc closes the confirm dialog (treated as cancel).
  useEffect(() => {
    if (!confirmState) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeConfirm(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmState, closeConfirm]);

  return (
    <ToastContext.Provider value={{ toast, confirm }}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[10000] flex flex-col items-center gap-2 px-4 pb-5 sm:items-end sm:px-5">
        {toasts.map((t) => {
          const v = VARIANT[t.variant];
          return (
            <div
              key={t.id}
              role="status"
              aria-live="polite"
              className="page-enter pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-outline/60 bg-surface p-4 shadow-panel"
            >
              <Icon name={v.icon} className={`${v.tone} shrink-0 text-[20px]`} />
              <p className="flex-1 text-sm font-medium leading-snug text-ink">{t.message}</p>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => remove(t.id)}
                className="-m-1 shrink-0 rounded-lg p-1 text-muted transition hover:bg-surface-soft hover:text-ink"
              >
                <Icon name="close" className="text-[18px]" />
              </button>
            </div>
          );
        })}
      </div>

      {confirmState && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          onClick={() => closeConfirm(false)}
        >
          <div
            className="page-enter w-full max-w-sm overflow-hidden rounded-3xl bg-surface p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${
                confirmState.destructive
                  ? "bg-error/10 text-error"
                  : "bg-primary/10 text-primary-bright"
              }`}
            >
              <Icon
                name={confirmState.destructive ? "delete" : "sparkle"}
                className="text-[24px]"
              />
            </div>
            <h3 id="confirm-title" className="text-xl font-bold text-ink">
              {confirmState.title}
            </h3>
            {confirmState.message && (
              <p className="mt-2 text-sm leading-relaxed text-muted">{confirmState.message}</p>
            )}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="button"
                autoFocus={!confirmState.destructive}
                onClick={() => closeConfirm(true)}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white transition ${
                  confirmState.destructive
                    ? "bg-error hover:opacity-90"
                    : "btn-glow primary-gradient shadow-ambient"
                }`}
              >
                {confirmState.confirmLabel ?? "Confirm"}
              </button>
              <button
                type="button"
                autoFocus={confirmState.destructive}
                onClick={() => closeConfirm(false)}
                className="flex-1 rounded-xl border border-outline/60 bg-surface px-4 py-3 text-sm font-bold text-ink transition hover:bg-surface-soft"
              >
                {confirmState.cancelLabel ?? "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
