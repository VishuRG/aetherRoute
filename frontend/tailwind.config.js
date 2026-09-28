/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1E7F4F",
          deep: "#0E4D2F",
          mint: "#3FBF7F",
          light: "#E8F5EE",
        },
        sun: {
          DEFAULT: "#FFC93C",
          hover: "#EBB328",
          dark: "#B8860B",
          light: "#FFF9E6",
        },
        vibrant: {
          orange: "#FF7A1A",
          orangeHover: "#E66708",
          orangeLight: "#FFF0E6",
        },
        cream: {
          DEFAULT: "#FFF8E7",
          warm: "#F5EBD0",
          card: "#FDFBF7",
          border: "#EADFC2",
        },
        dark: {
          bg: "#0B1A13",
          card: "#14281E",
          cardHover: "#1B3428",
          border: "#203E2F",
          muted: "#8FA89B",
        },
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(14, 77, 47, 0.08)",
        layered: "0 10px 30px -4px rgba(11, 26, 19, 0.12), 0 4px 12px -2px rgba(11, 26, 19, 0.08)",
        glowGreen: "0 0 24px rgba(30, 127, 79, 0.35)",
        glowOrange: "0 0 24px rgba(255, 122, 26, 0.35)",
        glowYellow: "0 0 20px rgba(255, 201, 60, 0.35)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        pulseSlow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 4s ease-in-out infinite",
        marquee: "marquee 25s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
