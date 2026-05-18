import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc",
        surface: "#ffffff",
        "surface-soft": "#f1f5f9",
        outline: "#cbd5e1",
        ink: "#0f172a",
        muted: "#64748b",
        primary: "#0058bc",
        "primary-bright": "#2563eb",
        secondary: "#4648d4",
        success: "#16a34a",
        warning: "#f59e0b",
        error: "#dc2626"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        label: ["Geist", "Inter", "sans-serif"]
      },
      boxShadow: {
        ambient: "0 10px 25px rgba(15, 23, 42, 0.08)",
        panel: "0 24px 60px rgba(15, 23, 42, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
