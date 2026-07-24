import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        "brand-bg": "#09090b",
        "brand-surface": "#18181b",
        "brand-border": "#27272a",
        "brand-glow": "#4f46e5",
        "brand-purple": "#7c3aed",
        primary: "#fafafa",
        muted: "#a1a1aa",
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-geist-mono)",
          "ui-monospace",
          "monospace",
        ],
      },
      spacing: {
        console: "320px",
      },
      boxShadow: {
        "card-glow": "0 0 20px 1px rgba(79, 70, 229, 0.15)",
        "tracking-line":
          "inset 3px 0 0 0 #4f46e5, 0 0 12px 2px rgba(79, 70, 229, 0.25)",
        "glow-sm": "0 0 12px 1px rgba(79, 70, 229, 0.2)",
        "glow-md": "0 0 20px 2px rgba(79, 70, 229, 0.25)",
      },
      borderRadius: {
        card: "0.75rem",
        pill: "9999px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
    },
  },
};

export default config;
