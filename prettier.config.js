/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  importOrder: [
    "<BUILTIN_MODULES>",
    "(testing-library|vitest)(?:/.*)?$",
    "^react$",
    "^next(?:/.*)?$",
    "<THIRD_PARTY_MODULES>",
    "^(emails|lib|services|utils|i18n|types|app|components)(?:/.*)?$",
    "^assets(?:/.*)?$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
};
export default config;
