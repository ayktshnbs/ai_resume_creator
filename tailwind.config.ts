import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-soft": "var(--surface-soft)",
        outline: "var(--outline)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        primary: "var(--primary)",
        "primary-bright": "var(--primary-bright)",
        secondary: "var(--secondary)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        label: ["Geist", "Inter", "sans-serif"]
      },
      boxShadow: {
        ambient: "0 10px 25px var(--shadow-ambient)",
        panel: "0 24px 60px var(--shadow-panel)"
      }
    }
  },
  plugins: []
};

export default config;
