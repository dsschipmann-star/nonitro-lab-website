import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0B0F17",
          soft: "#0E131D",
          surface: "#151B26",
          raised: "#1B222F",
        },
        line: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.14)",
        },
        text: {
          DEFAULT: "#F3F5F9",
          muted: "#A6AEBD",
          dim: "#6D7585",
        },
        brand: {
          blue: "#168BFF",
          blueSoft: "#3FA2FF",
          purple: "#7957FF",
          purpleSoft: "#9E85FF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(22,139,255,0.25), 0 20px 60px -20px rgba(22,139,255,0.35)",
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(22,139,255,0.18), transparent 70%)",
        "brand-gradient":
          "linear-gradient(135deg, #168BFF 0%, #7957FF 100%)",
        "text-gradient":
          "linear-gradient(135deg, #FFFFFF 0%, #C3D1EC 60%, #9E85FF 100%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 600ms ease-out both",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
