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
        // C6 Bank Dark Mode Palette
        background: "#0A0A0A",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#FF2D55",
          foreground: "#FFFFFF",
        },
        surface: "#1C1C1E",
        "surface-elevated": "#242426",
        secondary: "#A1A1AA",
        border: "#2A2A2E",
        success: "#00C853",
        danger: "#FF3B5C",
        warning: "#FF9500",
        info: "#5AC8FA",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.03)",
        "card-hover": "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        "fab": "0 4px 14px rgba(255, 45, 85, 0.35)",
      },
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "18": "4.5rem",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "balance": ["3rem", { lineHeight: "3.5rem", fontWeight: "800" }],
        "balance-lg": ["3.5rem", { lineHeight: "4rem", fontWeight: "800" }],
      },
      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s ease-in-out infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};
export default config;
