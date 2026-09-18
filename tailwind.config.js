/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.15s ease-out",
        "slide-up": "slideUp 0.2s ease-out",
      },
      colors: {
        primary: {
          50: "#f0f4ff",
          100: "#dbe4ff",
          200: "#bac8ff",
          300: "#91a7ff",
          400: "#748ffc",
          500: "#5c7cfa",
          600: "#4c6ef5",
          700: "#4263eb",
          800: "#3b5bdb",
          900: "#364fc7",
          950: "#232f86",
        },
        paper: {
          DEFAULT: "#F6F1E6",
          deep: "#EFE7D8",
          card: "#FFFDF6",
        },
        ink: {
          DEFAULT: "#211B11",
          muted: "#6E675A",
          faint: "#87806F",
        },
        brand: {
          deep: "#1E4637",
          hover: "#173B2E",
          forest: "#1E4637",
          dark: "#173B2E",
          pine: "#2E6B55",
          light: "#3E7A63",
          mint: "#E2ECE3",
          sage: "#ECF1E7",
        },
        accent: {
          sienna: "#B4501E",
          siennaDark: "#994014",
          rose: "#F3E2D6",
          sand: "#EFE8D8",
        },
        borderWarm: "#E7E0D0",
      },
    },
  },
  plugins: [],
};
