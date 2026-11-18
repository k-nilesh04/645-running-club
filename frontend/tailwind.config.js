/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C8FF3D",
        dark: "#10251C",
        offwhite: "#F4F0E4",
        accent: "#C8FF3D",
        forest: {
          DEFAULT: "#10251C",
          soft: "#19382A",
          light: "#244A36",
        },
        cream: "#F4F0E4",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
