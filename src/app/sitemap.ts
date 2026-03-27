import type { MetadataRoute } from "next";

import { getBaseUrl } from "utils";

const BASE_URL = getBaseUrl();
const WORKS_SLUGS = [
  "negatifplus",
  "zefirent",
  "blockfire",
  "stentor",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date(), priority: 1 },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      priority: 0.7,
    },
  ];

  const worksRoutes = WORKS_SLUGS.map((slug) => ({
    url: `${BASE_URL}/works/${slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  return [...staticRoutes, ...worksRoutes];
}
