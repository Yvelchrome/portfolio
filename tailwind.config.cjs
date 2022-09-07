/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "roobert-400": ["roobert-regular", "sans-serif"],
        "roobert-500": ["roobert-medium", "sans-serif"],
        "roobert-600": ["roobert-semibold", "sans-serif"],
        "roxborough-400": ["roxborough-regular", "sans-serif"],
        "roxborough-600": ["roxborough-semibold", "sans-serif"],
        "roxborough-600i": ["roxborough-semibolditalic", "sans-serif"],
      },
      gridTemplateColumns: {
        "2-max": "repeat(2, max-content)",
      },
    },
  },
  plugins: [],
};
