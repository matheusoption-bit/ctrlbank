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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--bg-elevated))",
        "surface-2": "hsl(var(--bg-elevated-2))",
        "surface-3": "hsl(var(--bg-elevated-3))",
        secondary: "hsl(var(--fg-muted))",
        border: "hsl(var(--border))",
        "border-strong": "hsl(var(--border-strong))",

        "accent-primary": "hsl(var(--accent))",
        "accent-warning": "hsl(var(--warning))",
        "accent-danger": "hsl(var(--negative))",

        primary: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        positive: "hsl(var(--positive))",
        negative: "hsl(var(--negative))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",
        success: "hsl(var(--positive))",
        danger: "hsl(var(--negative))",

        card: { DEFAULT: "hsl(var(--bg-elevated))", foreground: "hsl(var(--foreground))" },
        popover: { DEFAULT: "hsl(var(--bg-elevated-2))", foreground: "hsl(var(--foreground))" },
        muted: { DEFAULT: "hsl(var(--bg-elevated-3))", foreground: "hsl(var(--fg-muted))" },
        destructive: { DEFAULT: "hsl(var(--negative))", foreground: "hsl(var(--foreground))" },
        input: "hsl(var(--bg-elevated-2))",
        ring: "hsl(var(--accent))",
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
        "glow-primary":  "0 0 20px hsl(var(--accent) / 0.3)",
        "glow-positive": "0 0 20px hsl(var(--positive) / 0.3)",
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
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--accent) / 0)" },
          "50%":      { boxShadow: "0 0 0 8px hsl(var(--accent) / 0.15)" },
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
