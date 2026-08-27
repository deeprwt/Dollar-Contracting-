import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Web app manifest. Browsers read this for the install prompt and the
// home-screen icon.
//
// Icons here mirror the app/ file convention: `favicon.ico` lives at
// src/app/favicon.ico and Next serves it at /favicon.ico. When brand icons
// replace the current Next.js default, drop `icon.png` and `apple-icon.png`
// into src/app/ — Next emits their <link> tags automatically, and only this
// list needs a manual entry.
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
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
