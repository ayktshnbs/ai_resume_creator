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
        error: "var(--error)",
        paper: "rgb(var(--paper-rgb) / <alpha-value>)",
        "paper-soft": "rgb(var(--paper-soft-rgb) / <alpha-value>)",
        "paper-warm": "rgb(var(--paper-warm-rgb) / <alpha-value>)",
        "paper-deep": "rgb(var(--paper-deep-rgb) / <alpha-value>)",
        "ink-deep": "rgb(var(--ink-deep-rgb) / <alpha-value>)",
        "ink-soft": "rgb(var(--ink-soft-rgb) / <alpha-value>)",
        "ink-quiet": "rgb(var(--ink-quiet-rgb) / <alpha-value>)",
        rule: "rgb(var(--rule-rgb) / <alpha-value>)",
        "rule-soft": "rgb(var(--rule-soft-rgb) / <alpha-value>)",
        saffron: "rgb(var(--saffron-rgb) / <alpha-value>)",
        "saffron-bright": "rgb(var(--saffron-bright-rgb) / <alpha-value>)",
        "saffron-soft": "rgb(var(--saffron-soft-rgb) / <alpha-value>)",
        moss: "rgb(var(--moss-rgb) / <alpha-value>)",
        "moss-bright": "rgb(var(--moss-bright-rgb) / <alpha-value>)",
        oxblood: "rgb(var(--oxblood-rgb) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        label: ["Geist", "Inter", "sans-serif"],
        serif: ["Fraunces", "Times New Roman", "serif"],
        edit: ["Geist", "Inter", "system-ui", "sans-serif"]
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
