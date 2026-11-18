/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#A9E66E",
        dark: "#07110D",
        offwhite: "#F5F8F2",
        accent: "#A9E66E",
        forest: { DEFAULT: "#07110D", soft: "#0D1B14", light: "#13251A" },
        cream: "#F5F8F2",
        leaf: "#D0F2B0",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};