import type { Config } from "tailwindcss";

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
          foreground: "#000000",
        },
        surface: "#171717",
        secondary: "#A3A3A3",
        border: "#262626",
      },
      borderRadius: {
        "20px": "20px",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
