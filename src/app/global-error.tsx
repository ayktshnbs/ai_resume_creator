"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for errors thrown in the root layout itself. It replaces
 * the entire document, so it must render its own <html>/<body> and cannot rely
 * on the app's global stylesheet — everything here is inline-styled so it always
 * renders correctly even when nothing else does.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          background: "#0b1120",
          color: "#f1f5f9",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div style={{ maxWidth: "30rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.75rem" }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "#94a3b8", margin: "0 0 2rem" }}>
            A critical error stopped the app from loading. Please try again — if it keeps happening,
            reload the page.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.85rem 1.75rem",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#ffffff",
              background: "linear-gradient(135deg, #0058bc, #4648d4)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
