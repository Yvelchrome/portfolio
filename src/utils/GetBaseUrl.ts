export function getBaseUrl(env?: string) {
  if ((env ?? process.env.NODE_ENV) === "development") {
    return "http://localhost:3000";
  }
  return "https://svgd.vercel.app";
}
