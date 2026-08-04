import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Campus Stay",
    short_name: "Campus Stay",
    description: "Find your perfect off-campus housing and roommates.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#02351c",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
