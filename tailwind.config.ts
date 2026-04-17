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
        // ── Core (mantidos para compatibilidade) ──────────────────────────────
        background:   "#0f0f0f",
        foreground:   "#fafafa",
        surface:      "#1a1a1a",
        "surface-2":  "#242424",
        secondary:    "#71717a",
        border:       "rgba(255,255,255,0.08)",

        // ── Design System Tokens Enterprise (6.1) ─────────────────────────────
        "surface-primary":   "#0f0f0f",
        "surface-secondary": "#1a1a1a",
        "surface-card":      "#242424",
        "border-subtle":     "rgba(255,255,255,0.08)",
        "text-primary":      "#fafafa",
        "text-muted":        "#71717a",

        // ── Accent Semântico ───────────────────────────────────────────────────
        "accent-primary": "#22c55e",
        "accent-warning": "#f59e0b",
        "accent-danger":  "#ef4444",

        // ── Primary Brand (Rosa C6 — mantido) ─────────────────────────────────
        primary: {
          DEFAULT:    "#FF2D55",
          50:         "#FFF0F3",
          100:        "#FFE0E8",
          200:        "#FFC2D1",
          300:        "#FF99B3",
          400:        "#FF6685",
          500:        "#FF2D55",
          600:        "#E6003D",
          700:        "#CC0035",
          800:        "#B3002E",
          900:        "#8C0023",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT:    "#FF2D55",
          foreground: "#FFFFFF",
        },

        // ── Aliases financeiros (mantidos para compatibilidade) ────────────────
        positive:  "#22c55e",
        negative:  "#ef4444",
        warning:   "#f59e0b",
        info:      "#0A84FF",
        success:   "#22c55e",
        danger:    "#ef4444",

        // ── shadcn/ui base tokens ──────────────────────────────────────────────
        card:        { DEFAULT: "#242424", foreground: "#fafafa" },
        popover:     { DEFAULT: "#1a1a1a", foreground: "#fafafa" },
        muted:       { DEFAULT: "#242424", foreground: "#71717a" },
        destructive: { DEFAULT: "#ef4444", foreground: "#FFFFFF" },
        input:       "#2a2a2a",
        ring:        "#FF2D55",
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
