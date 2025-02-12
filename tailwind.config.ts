import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      black: "#000000",
      "lighter-black": "#1C1C1C",
      grey: "#333333",
      "light-grey": "#4B4B4B",
      white: "#FFFFFF",
      "dark-blue": "#3399CC",
      "light-blue": "#66CCFF",
      "work-page-black": "#1E1E1E",
      "theme-switch": "#D9D9D9",
    },
    extend: {
      fontFamily: {
        roobert: ["var(--font-roobert)", ...fontFamily.sans],
        roxborough: ["var(--font-roxborough)", ...fontFamily.serif],
      },
    },
  },
  plugins: [],
} satisfies Config;
