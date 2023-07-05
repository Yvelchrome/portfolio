/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roobert: ["var(--font-roobert)", "sans-serif"],
        roxborough: ["var(--font-roxborough)", "sans-serif"],
      },
      gridTemplateColumns: {
        "2-max": "repeat(2, max-content)",
      },
    },
  },
  plugins: [],
};
