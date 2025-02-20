import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: "Portfolio",
    name: "Steven Godin | Portfolio",
    description: "Steven Godin's Portfolio",
    icons: [
      {
        src: "/maskable_icon_x192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "maskable",
      },
      {
        src: "/maskable_icon_x512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
    start_url: "/",
    display: "standalone",
    theme_color: "#66CCFF",
    background_color: "#141414",
  };
}
