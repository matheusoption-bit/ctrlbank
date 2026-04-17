import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Core (Editorial Dark) ──────────────────────────────
        background:   "#050505",
        foreground:   "#f5f5f0",
        surface:      "#0b0b0b",
        "surface-2":  "#141414",
        "surface-3":  "#1e1e1e",
        secondary:    "#8a8a8a",
        border:       "rgba(255,255,255,0.10)",

        // ── Design System Tokens Enterprise (6.1) ─────────────────────────────
        "surface-primary":   "#050505",
        "surface-secondary": "#0b0b0b",
        "surface-card":      "#141414",
        "border-subtle":     "rgba(255,255,255,0.10)",
        "text-primary":      "#f5f5f0",
        "text-muted":        "#8a8a8a",

        // ── Accent Semântico ───────────────────────────────────────────────────
        "accent-primary": "#19FF63",
        "accent-warning": "#f59e0b",
        "accent-danger":  "#ef4444",

        // ── Primary Brand (Neon Green) ─────────────────────────────────
        primary: {
          DEFAULT:    "#19FF63",
          50:         "#E6FFE6",
          100:        "#CCFFCC",
          200:        "#99FF99",
          300:        "#66FF66",
          400:        "#33FF33",
          500:        "#19FF63",
          600:        "#00E64D",
          700:        "#00B33C",
          800:        "#00802B",
          900:        "#004D1A",
          foreground: "#050505",
        },
        accent: {
          DEFAULT:    "#19FF63",
          foreground: "#050505",
        },

        // ── Aliases e Brand Secundários ────────────────
        brand: {
          cyan: "#00E5FF",
          purple: "#D100FF",
        },
        positive:  "#19FF63",
        negative:  "#ef4444",
        warning:   "#f59e0b",
        info:      "#00E5FF",
        success:   "#19FF63",
        danger:    "#ef4444",

        // ── shadcn/ui base tokens ──────────────────────────────────────────────
        card:        { DEFAULT: "#0b0b0b", foreground: "#f5f5f0" },
        popover:     { DEFAULT: "#141414", foreground: "#f5f5f0" },
        muted:       { DEFAULT: "#1e1e1e", foreground: "#8a8a8a" },
        destructive: { DEFAULT: "#ef4444", foreground: "#f5f5f0" },
        input:       "#141414",
        ring:        "#19FF63",
      },
      borderRadius: {
        "3xl":   "24px",
        "4xl":   "32px",
        "20px":  "20px",
        "16px":  "16px",
        "12px":  "12px",
      },
      boxShadow: {
        soft:            "0 2px 12px rgba(0, 0, 0, 0.4)",
        "soft-md":       "0 4px 20px rgba(0, 0, 0, 0.5)",
        "soft-lg":       "0 8px 32px rgba(0, 0, 0, 0.6)",
        "soft-xl":       "0 16px 48px rgba(0, 0, 0, 0.7)",
        "glow-primary":  "0 0 20px rgba(255, 45, 85, 0.3)",
        "glow-positive": "0 0 20px rgba(34, 197, 94, 0.3)",
      },
      spacing: {
        "4.5":        "1.125rem",
        "5.5":        "1.375rem",
        "18":         "4.5rem",
        "22":         "5.5rem",
        "bottom-nav": "5rem",
      },
      fontSize: {
        "2xs":  ["0.625rem", { lineHeight: "0.75rem" }],
        "hero": ["3.5rem", { lineHeight: "1", fontWeight: "900", letterSpacing: "-0.04em" }],
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "var(--font-inter)", "sans-serif"],
        sans:    ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        inter:   ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        geist:   ["var(--font-geist-sans)", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-up-fade": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 45, 85, 0)" },
          "50%":      { boxShadow: "0 0 0 8px rgba(255, 45, 85, 0.15)" },
        },
        "count-up": {
          "0%":   { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer:          "shimmer 2s linear infinite",
        "slide-up-fade":  "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in":       "scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-glow":     "pulse-glow 2s ease-in-out infinite",
        "count-up":       "count-up 0.6s ease-out",
      },
    },
  },
  plugins: [animate],
};

export default config;
