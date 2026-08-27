import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/lib/services";
import { locations } from "@/lib/locations";
import { getPublishedJobs } from "@/lib/jobs";

const base = siteConfig.url;

// Last date the marketing copy on these pages actually changed. Bump this by
// hand when you edit page content — do NOT use `new Date()` here. A lastmod
// that moves on every crawl tells Google the value is unreliable, and it then
// ignores lastmod for the whole sitemap. Google's own guidance: omit or keep it
// accurate, never auto-stamp "now".
const CONTENT_UPDATED = new Date("2026-08-26T00:00:00.000Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Top-level public pages.
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/locations`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/projects`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/testimonials`, lastModified: CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/career`, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/quote`, lastModified: CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.8 },
  ];

  // Service detail pages — high priority, these are the money keywords.
  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Location detail pages — local landing pages.
  const locationEntries: MetadataRoute.Sitemap = locations.map((l) => ({
    url: `${base}/locations/${l.slug}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Published job postings. Guard against Supabase being unavailable at build
  // so a data hiccup never breaks the whole sitemap.
  let jobEntries: MetadataRoute.Sitemap = [];
  try {
    const jobs = await getPublishedJobs();
    jobEntries = jobs.map((job) => ({
      url: `${base}/career/${job.slug}`,
      lastModified: job.created_at ? new Date(job.created_at) : CONTENT_UPDATED,
      changeFrequency: "weekly",
      priority: 0.5,
    }));
  } catch {
    jobEntries = [];
  }

  return [...staticEntries, ...serviceEntries, ...locationEntries, ...jobEntries];
}
