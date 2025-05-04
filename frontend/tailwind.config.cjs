/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0d9488",
        primary_lite: "#FBBF24",
        accent: "#000000",
        neutral: "#FFFFFF",
        text_white: "#FFFFFF",
        gray_600: "#4B5563",
        gray_800: "#1F2937",
        text_gray_600: "#4B5563",
        text_gray_800: "#1F2937",
        light_hover: "#F2F2F2",
        dark: "#111827",
        dark_bg: "#000000",
        text_dark: "#231F20",
        dark_hover: "#2B2B2B",
        success: "#10B981",
        danger: "#A60612",
      },
    },
    fontFamily: {
      serif: ["Merriweather", "serif"],
      inter: ["Inter", "sans-serif"],
      playfair: ["Playfair Display", "serif"],
      poppins: ["Poppins", "sans-serif"],
      lora: ["Lora", "serif"],
    },
  },
  plugins: [],
};
