import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  safelist: ["animate-fade-in", "animate-slide-up"],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF6EE",
        cream: "#FFFDF8",
        burgundy: { DEFAULT: "#6B2C35", dark: "#4A1E25", light: "#8B3A44" },
        rose: { DEFAULT: "#B48B5E", light: "#D4B290", dark: "#8A6743" },
        blush: { DEFAULT: "#F4C4C9", light: "#FADDE1", dark: "#E5A4AB" },
        sand: "#F2E6D6",
        stone: { DEFAULT: "#8B6F5A", dark: "#5C4B3D" },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -8px rgba(107, 44, 53, 0.15)",
        card: "0 2px 12px -4px rgba(107, 44, 53, 0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
