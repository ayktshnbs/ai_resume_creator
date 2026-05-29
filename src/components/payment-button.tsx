"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast";

type PaymentButtonProps = {
  price: string;
  className?: string;
  children: React.ReactNode;
};

export function PaymentButton({ price, className, children }: PaymentButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    if (status !== "authenticated") {
      router.push("/signin?callbackUrl=/#pricing");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
      });
      const data = await res.json();

      if (data.paymentPageUrl) {
        window.location.href = data.paymentPageUrl;
      } else if (data.threeDSHtmlContent) {
        // For 3DS flows that return HTML to be rendered and automatically submitted
        const newWindow = window.open("", "_self");
        if (newWindow) {
          newWindow.document.write(data.threeDSHtmlContent);
          newWindow.document.close();
        }
      } else {
        toast(data.error || "Could not initialize payment. Please try again.", "error");
      }
    } catch (error) {
      console.error("[Payment Button Error]", error);
      toast("An unexpected error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={() => void handleUpgrade()}
      disabled={loading}
      className={`${className} disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Redirecting to secure payment...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
