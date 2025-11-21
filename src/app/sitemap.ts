import type { MetadataRoute } from "next";
import { projects } from "lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: "https://svgd.vercel.app", lastModified: new Date(), priority: 1 },
    {
      url: "https://svgd.vercel.app/contact",
      lastModified: new Date(),
      priority: 0.7,
    },
  ];

  const worksRoutes = projects.map((p) => ({
    url: `https://svgd.vercel.app/works/${p.slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  return [...staticRoutes, ...worksRoutes];
}
