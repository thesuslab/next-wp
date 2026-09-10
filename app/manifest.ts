import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sustainability Lab — Intelligence for a resilient future",
    short_name: "Sustainability Lab",
    description:
      "Research. Experiment. Collaborate. Build. Environmental intelligence, climate engineering, circular craftsmanship, and resilient enterprise.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F5F0",
    theme_color: "#5D7924",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
