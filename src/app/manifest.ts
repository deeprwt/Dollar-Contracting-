import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Web app manifest. Browsers read this for the install prompt and the
// home-screen icon.
//
// The <link rel="icon"> tags come from the app/ file convention instead:
// src/app/favicon.ico, src/app/icon.png and src/app/apple-icon.png are picked
// up automatically and emitted into <head>. Those are hashed by Next, so the
// manifest points at the stable /icons/* copies in public/ — an install
// prompt should not break when a content hash moves.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#b91c1c",
    icons: [
      // Android/Chrome install prompt requires both 192 and 512.
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // Full-bleed variant with the mark inside the 80% safe zone, so launchers
      // that apply their own mask (circle, squircle) don't clip the monogram.
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
