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
        // ── Core ──────────────────────────────────────────
        background:   "#0A0A0A",
        foreground:   "#FFFFFF",
        surface:      "#1C1C1E",
        "surface-2":  "#252528",
        secondary:    "#A1A1AA",
        border:       "#2A2A2E",

        // ── Primary Accent – Rosa C6 Bank ─────────────────
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

        // ── Financial semantic colors ──────────────────────
        positive:  "#00C853",  // Verde forte financeiro
        negative:  "#FF3B5C",  // Vermelho rosado C6
        warning:   "#FF9500",
        info:      "#0A84FF",

        // ── Aliases ───────────────────────────────────────
        success:   "#34C759",
        danger:    "#FF3B30",

        // ── shadcn/ui base tokens (C6 palette) ────────────
        card:        { DEFAULT: "#1C1C1E", foreground: "#FFFFFF" },
        popover:     { DEFAULT: "#1C1C1E", foreground: "#FFFFFF" },
        muted:       { DEFAULT: "#2C2C2E", foreground: "#8E8E93" },
        destructive: { DEFAULT: "#FF3B30", foreground: "#FFFFFF" },
        input:       "#3A3A3C",
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
        soft:           "0 2px 12px rgba(0, 0, 0, 0.4)",
        "soft-md":      "0 4px 20px rgba(0, 0, 0, 0.5)",
        "soft-lg":      "0 8px 32px rgba(0, 0, 0, 0.6)",
        "soft-xl":      "0 16px 48px rgba(0, 0, 0, 0.7)",
        "glow-primary": "0 0 20px rgba(255, 45, 85, 0.3)",
        "glow-positive":"0 0 20px rgba(52, 199, 89, 0.3)",
      },

      spacing: {
        "4.5":       "1.125rem",
        "5.5":       "1.375rem",
        "18":        "4.5rem",
        "22":        "5.5rem",
        "bottom-nav":"5rem",
      },

      fontSize: {
        "2xs":  ["0.625rem", { lineHeight: "0.75rem" }],
        "hero": ["3.5rem", { lineHeight: "1", fontWeight: "900", letterSpacing: "-0.04em" }],
      },

      fontFamily: {
        sans:  ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
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
      },

      animation: {
        shimmer:          "shimmer 2s linear infinite",
        "slide-up-fade":  "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in":       "scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-glow":     "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
};
export default config;
