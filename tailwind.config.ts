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
        background: "#0A0A0A",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#FFCC00",
          50: "#FFFBF0",
          100: "#FFF8E1",
          200: "#FFF0C2",
          300: "#FFE8A3",
          400: "#FFE085",
          500: "#FFCC00",
          600: "#E6B800",
          700: "#CC9900",
          800: "#B38600",
          900: "#997300",
          foreground: "#000000",
        },
        surface: "#171717",
        secondary: "#A3A3A3",
        border: "#262626",
        accent: {
          DEFAULT: "#FFCC00",
        },
        success: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
      },
      borderRadius: {
        "20px": "20px",
        "16px": "16px",
        "12px": "12px",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.5)",
        "soft-lg": "0 8px 32px rgba(0, 0, 0, 0.6)",
        "soft-xl": "0 16px 48px rgba(0, 0, 0, 0.7)",
      },
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
      },
    },
  },
  plugins: [animate],
};
export default config;
