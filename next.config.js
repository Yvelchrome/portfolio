/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel-insights.com; " +
      "style-src 'self' 'unsafe-inline' https://*.vercel.com; " +
      "img-src 'self' data: blob: https://*.vercel.com; " +
      "frame-src 'self' https://steven-godin-resume.netlify.app; " +
      "connect-src 'self' https://*.vercel.com https://resend.com; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self';",
  },
];

/** @type {import("next").NextConfig} */
const config = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default withNextIntl(config);
