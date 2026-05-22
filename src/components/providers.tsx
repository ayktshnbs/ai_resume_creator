"use client";

import { SessionProvider } from "next-auth/react";
import { I18nProvider } from "@/lib/i18n";
import { PageTransition } from "@/components/page-transition";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <I18nProvider>
        <PageTransition>
          {children}
        </PageTransition>
      </I18nProvider>
    </SessionProvider>
  );
}
