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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel-scripts.com https://*.vercel-insights.com https://vercel.live; " +
      "style-src 'self' 'unsafe-inline' https://*.vercel.com; " +
      "img-src 'self' data: blob: https://*.vercel.com; " +
      "font-src 'self'; " +
      "object-src 'none'; " +
      "frame-src 'self' data: https://steven-godin-resume.netlify.app https://vercel.live; " +
      "frame-ancestors 'none'; " +
      "connect-src 'self' https://*.vercel.com https://resend.com; " +
      "base-uri 'self'; " +
      "form-action 'self';",
  },
];

/** @type {import("next").NextConfig} */
const config = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },

  turbopack: {
    rules: {
      // TODO: clean all "*.svgr.svg" when queryParam support is added in Turbopack to use default loader for "*.svg?url"
      "*.svgr.svg": {
        loaders: [{ loader: "@svgr/webpack", options: { icon: true } }],
        as: "*.js",
      },
    },
  },
};

export default withNextIntl(config);
