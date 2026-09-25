import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/lib/services";
import { locations } from "@/lib/locations";
import { getPublishedJobs } from "@/lib/jobs";
import { getAllPublishedPosts } from "@/lib/blog/posts";

const base = siteConfig.url;

// Saving a job or blog post revalidates this on demand; the window catches
// scheduled blog posts that go live on their own.
export const revalidate = 3600;

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
    { url: `${base}/blog`, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.7 },
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

  // Published blog posts and their category archives. Tag archives are
  // noindex, so they're left out. Same guard as the jobs above.
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPublishedPosts();
    const categories = new Map<string, Date>();
    blogEntries = posts.map((post) => {
      const modified = new Date(post.updated_at);
      if (post.category_slug) {
        const prev = categories.get(post.category_slug);
        if (!prev || prev < modified) categories.set(post.category_slug, modified);
      }
      return {
        url: `${base}/blog/${post.slug}`,
        lastModified: modified,
        changeFrequency: "monthly",
        priority: 0.6,
      };
    });
    for (const [slug, modified] of categories) {
      blogEntries.push({
        url: `${base}/blog/category/${slug}`,
        lastModified: modified,
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
  } catch {
    blogEntries = [];
  }

  return [...staticEntries, ...serviceEntries, ...locationEntries, ...jobEntries, ...blogEntries];
}
