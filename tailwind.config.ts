import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1240px",
      },
    },
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FBF6EE",
          50: "#FDFAF4",
          100: "#FBF6EE",
          200: "#F5EDDF",
          300: "#ECE3D2",
        },
        ink: {
          DEFAULT: "#1F2433",
          soft: "#4A5063",
          mute: "#8A8FA0",
        },
        butter: {
          DEFAULT: "#F5D77A",
          deep: "#E9BE4A",
        },
        sky: {
          DEFAULT: "#A8D0E6",
          deep: "#6FA8C9",
        },
        mint: {
          DEFAULT: "#B8E0C9",
          deep: "#7CC299",
        },
        coral: {
          DEFAULT: "#F4A78F",
          deep: "#E07F62",
        },
        lavender: {
          DEFAULT: "#D9C8F0",
          deep: "#A988D8",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        xl2: "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(31,36,51,.06), 0 2px 6px rgba(31,36,51,.04)",
        card: "0 4px 10px rgba(31,36,51,.06), 0 12px 28px rgba(31,36,51,.08)",
        lift: "0 10px 24px rgba(31,36,51,.08), 0 28px 56px rgba(31,36,51,.10)",
        clay: "inset 0 -6px 12px rgba(0,0,0,.08), inset 0 6px 12px rgba(255,255,255,.55), 0 12px 24px rgba(31,36,51,.10)",
        coral: "0 6px 14px rgba(224,127,98,.32)",
        whatsapp: "0 6px 14px rgba(37,211,102,.32)",
      },
      keyframes: {
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        floatYRot: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(3deg)" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "float-a": "floatY 6s ease-in-out infinite",
        "float-b": "floatYRot 5.2s ease-in-out infinite",
        "float-c": "floatY 7.4s ease-in-out infinite -1.2s",
        "spin-slow": "spinSlow 22s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
