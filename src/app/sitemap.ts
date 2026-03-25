import type { MetadataRoute } from "next";

const WORKS_SLUGS = [
  "negatifplus",
  "zefirent",
  "blockfire",
  "stentor",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: "https://svgd.vercel.app", lastModified: new Date(), priority: 1 },
    {
      url: "https://svgd.vercel.app/contact",
      lastModified: new Date(),
      priority: 0.7,
    },
  ];

  const worksRoutes = WORKS_SLUGS.map((slug) => ({
    url: `https://svgd.vercel.app/works/${slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  return [...staticRoutes, ...worksRoutes];
}
