import type { Metadata } from "next";
import { siteConfig } from "./site-config";

type PageMetaInput = {
  /** Page title — the root template adds " | Dollar Contracting". */
  title?: string;
  description?: string;
  /** Canonical path, e.g. "/about" or "/services/concrete-work". Resolved against metadataBase. */
  path: string;
  keywords?: readonly string[];
  /** OG/Twitter image path (defaults to the site-wide /og.png). */
  image?: string;
  /** Set an exact <title> that ignores the template (used on the home page). */
  absoluteTitle?: string;
};

/**
 * Build a complete, self-consistent Metadata object for a page: canonical URL,
 * Open Graph and Twitter cards. Next.js *replaces* (does not merge) the parent
 * openGraph/twitter objects when a page sets them, so this returns the full set
 * every time to avoid losing siteName/locale/images on inner pages.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  image,
  absoluteTitle,
}: PageMetaInput): Metadata {
  const desc = description ?? siteConfig.description;
  const ogTitle =
    absoluteTitle ??
    (title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.tagline}`);
  const img = image ?? "/og.png";

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description: desc,
    keywords: keywords ? [...keywords] : [...siteConfig.keywords],
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description: desc,
      url: path,
      siteName: siteConfig.name,
      locale: "en_CA",
      type: "website",
      images: [{ url: img, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: desc,
      images: [img],
    },
  };
}
