import { cache } from "react";
import { createSupabasePublicClient } from "@/lib/supabase/server";
import type { BlogPost, BlogPostSummary } from "@/lib/supabase/types";

// Public (anon) reads of live posts. RLS already hides drafts and scheduled
// posts from the anon key; the explicit filters below keep these queries
// correct even if they're ever pointed at a privileged client.

export const POSTS_PER_PAGE = 9;

export const SUMMARY_COLUMNS =
  "id, slug, title, excerpt, cover_image_path, cover_image_alt, cover_image_width, cover_image_height, category, category_slug, tags, author_name, status, published_at, is_featured, reading_minutes, seo_title, seo_description, created_at, updated_at";

function live() {
  const supabase = createSupabasePublicClient();
  return supabase
    .from("blog_posts")
    .select(SUMMARY_COLUMNS, { count: "exact" })
    .eq("status", "published")
    .lte("published_at", new Date().toISOString());
}

export async function getPublishedPosts(
  page = 1,
  perPage = POSTS_PER_PAGE,
): Promise<{ posts: BlogPostSummary[]; total: number }> {
  const from = (page - 1) * perPage;
  const { data, count } = await live()
    .order("published_at", { ascending: false })
    .range(from, from + perPage - 1);
  return { posts: (data ?? []) as BlogPostSummary[], total: count ?? 0 };
}

export async function getAllPublishedPosts(): Promise<BlogPostSummary[]> {
  const { data } = await live().order("published_at", { ascending: false }).limit(1000);
  return (data ?? []) as BlogPostSummary[];
}

export async function getFeaturedPost(): Promise<BlogPostSummary | null> {
  const { data } = await live()
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(1);
  return ((data ?? [])[0] ?? null) as BlogPostSummary | null;
}

// Wrapped in cache() so generateMetadata and the page share one query per request.
export const getPublishedPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const supabase = createSupabasePublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  return (data ?? null) as BlogPost | null;
});

/** Current slug for a post that used to live at `oldSlug`, for 301 redirects. */
export async function findRenamedPostSlug(oldSlug: string): Promise<string | null> {
  const supabase = createSupabasePublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .contains("previous_slugs", [oldSlug])
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .limit(1);
  return data?.[0]?.slug ?? null;
}

export async function getPostsByCategory(categorySlug: string): Promise<BlogPostSummary[]> {
  const { data } = await live()
    .eq("category_slug", categorySlug)
    .order("published_at", { ascending: false })
    .limit(200);
  return (data ?? []) as BlogPostSummary[];
}

export async function getPostsByTag(tag: string): Promise<BlogPostSummary[]> {
  const { data } = await live()
    .contains("tags", [tag])
    .order("published_at", { ascending: false })
    .limit(200);
  return (data ?? []) as BlogPostSummary[];
}

/** Up to `limit` other posts, same category first, topped up with the latest. */
export async function getRelatedPosts(
  post: Pick<BlogPost, "id" | "category_slug">,
  limit = 3,
): Promise<BlogPostSummary[]> {
  const related: BlogPostSummary[] = [];
  if (post.category_slug) {
    const { data } = await live()
      .eq("category_slug", post.category_slug)
      .neq("id", post.id)
      .order("published_at", { ascending: false })
      .limit(limit);
    related.push(...((data ?? []) as BlogPostSummary[]));
  }
  if (related.length < limit) {
    const exclude = [post.id, ...related.map((p) => p.id)];
    const { data } = await live()
      .not("id", "in", `(${exclude.join(",")})`)
      .order("published_at", { ascending: false })
      .limit(limit - related.length);
    related.push(...((data ?? []) as BlogPostSummary[]));
  }
  return related;
}

export type BlogCategory = { name: string; slug: string; count: number };

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const supabase = createSupabasePublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("category, category_slug")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .not("category_slug", "is", null)
    .limit(1000);

  const bySlug = new Map<string, BlogCategory>();
  for (const row of data ?? []) {
    if (!row.category_slug || !row.category) continue;
    const existing = bySlug.get(row.category_slug);
    if (existing) existing.count += 1;
    else bySlug.set(row.category_slug, { name: row.category, slug: row.category_slug, count: 1 });
  }
  return [...bySlug.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export async function getBlogTags(): Promise<string[]> {
  const supabase = createSupabasePublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("tags")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .limit(1000);
  const tags = new Set<string>();
  for (const row of data ?? []) for (const t of row.tags ?? []) tags.add(t);
  return [...tags].sort();
}
