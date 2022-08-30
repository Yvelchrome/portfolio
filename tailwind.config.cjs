/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roobert400: ["roobert-regular", "sans-serif"],
        roobert500: ["roobert-medium", "sans-serif"],
        roobert600: ["roobert-semibold", "sans-serif"],
        roxborough400: ["roxborough-regular", "sans-serif"],
        roxborough600: ["roxborough-semibold", "sans-serif"],
        roxborough600i: ["roxborough-semibolditalic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
