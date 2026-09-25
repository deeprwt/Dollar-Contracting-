"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import { siteConfig } from "@/lib/site-config";
import {
  autoExcerpt,
  blockImagePaths,
  hasRenderableContent,
  readingMinutes,
  sanitizeBlocks,
  sanitizeImage,
  type Block,
  type BlogImage,
} from "@/lib/blog/blocks";
import { BLOG_BUCKET, postImageFolder } from "@/lib/blog/images";
import type { BlogStatus } from "@/lib/supabase/types";

// What the editor sends. Everything is re-validated here — never trust it.
export type BlogPostInput = {
  id: string;
  isNew: boolean;
  title: string;
  slug: string;
  excerpt: string;
  content: Block[];
  cover: BlogImage | null;
  category: string;
  tags: string[];
  author_name: string;
  published_at: string | null;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
};

export type SavedBlogPost = {
  id: string;
  slug: string;
  status: BlogStatus;
  published_at: string | null;
  excerpt: string;
};

export type SaveBlogResult = { ok: true; post: SavedBlogPost } | { ok: false; error: string };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Static segments under /blog that a post slug would collide with.
const RESERVED_SLUGS = new Set(["page", "category", "tag", "feed", "rss"]);

async function getAuthedClient() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // RLS would reject anonymous inserts, but an anonymous *update* just matches
  // zero rows and "succeeds" silently — so check explicitly.
  return user ? supabase : null;
}

type Supabase = NonNullable<Awaited<ReturnType<typeof getAuthedClient>>>;

function revalidateBlog() {
  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/blog/page/[page]", "page");
  revalidatePath("/blog/category/[category]", "page");
  revalidatePath("/blog/tag/[tag]", "page");
  revalidatePath("/blog/feed.xml");
  revalidatePath("/sitemap.xml");
}

/**
 * Delete files in the post's storage folder that the saved post no longer
 * references (replaced covers, removed images). Best-effort: a failure here
 * leaves an orphaned file, never a broken post.
 */
async function removeUnusedImages(supabase: Supabase, postId: string, keep: string[]) {
  try {
    const folder = postImageFolder(postId);
    const bucket = supabase.storage.from(BLOG_BUCKET);
    const { data: files, error } = await bucket.list(folder, { limit: 1000 });
    if (error || !files) return;
    const keepSet = new Set(keep);
    const unused = files
      .filter((f) => f.id !== null) // folders come back with a null id
      .map((f) => `${folder}/${f.name}`)
      .filter((path) => !keepSet.has(path));
    if (unused.length > 0) await bucket.remove(unused);
  } catch (err) {
    console.error("Blog: image cleanup failed", {
      postId,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  const out = new Set<string>();
  for (const t of tags) {
    if (typeof t !== "string") continue;
    const slug = slugify(t).slice(0, 40);
    if (slug) out.add(slug);
    if (out.size >= 20) break;
  }
  return [...out];
}

function parseDate(v: unknown): string | null {
  if (typeof v !== "string" || !v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export async function saveBlogPostAction(
  input: BlogPostInput,
  intent: "draft" | "publish",
): Promise<SaveBlogResult> {
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, error: "Your session has expired. Sign in again." };

  if (typeof input?.id !== "string" || !UUID_RE.test(input.id)) {
    return { ok: false, error: "Invalid post id." };
  }
  const id = input.id;

  const title = String(input.title ?? "").trim().slice(0, 200);
  const slug = slugify(String(input.slug ?? "").trim() || title);
  const content = sanitizeBlocks(input.content, id);
  const cover = sanitizeImage(input.cover, id);
  const category = String(input.category ?? "").trim().slice(0, 80);
  const excerptRaw = String(input.excerpt ?? "").trim().slice(0, 500);

  if (!title) return { ok: false, error: "Add a title first." };
  if (!slug) return { ok: false, error: "The URL slug needs at least one letter or number." };
  if (RESERVED_SLUGS.has(slug)) {
    return { ok: false, error: `"${slug}" is reserved by the blog. Pick a different slug.` };
  }
  if (intent === "publish" && !content.some(hasRenderableContent)) {
    return { ok: false, error: "Add some content to the post before publishing it." };
  }

  let publishedAt = parseDate(input.published_at);

  // Load the stored row (for updates) to carry over slug history and the
  // original publish date.
  let previousSlugs: string[] = [];
  if (!input.isNew) {
    const { data: existing, error } = await supabase
      .from("blog_posts")
      .select("slug, previous_slugs, status, published_at")
      .eq("id", id)
      .maybeSingle();
    if (error) return { ok: false, error: error.message };
    if (!existing) return { ok: false, error: "This post no longer exists." };

    previousSlugs = (existing.previous_slugs ?? []).filter((s: string) => s !== slug);
    // Once a post has been live, its old URL may be linked or indexed, so keep
    // it around to 301 to the new one.
    if (existing.slug !== slug && existing.status === "published") {
      previousSlugs = [existing.slug, ...previousSlugs.filter((s) => s !== existing.slug)];
    }
    previousSlugs = previousSlugs.slice(0, 20);
    if (!publishedAt && existing.published_at && intent === "publish") {
      publishedAt = existing.published_at;
    }
  }

  if (intent === "publish" && !publishedAt) publishedAt = new Date().toISOString();

  const row = {
    slug,
    previous_slugs: previousSlugs,
    title,
    excerpt: excerptRaw || autoExcerpt(content),
    content,
    cover_image_path: cover?.path ?? null,
    cover_image_alt: cover?.alt ?? null,
    cover_image_width: cover?.width ?? null,
    cover_image_height: cover?.height ?? null,
    category: category || null,
    category_slug: slugify(category) || null,
    tags: normalizeTags(input.tags),
    author_name: String(input.author_name ?? "").trim().slice(0, 100) || siteConfig.name,
    status: (intent === "publish" ? "published" : "draft") as BlogStatus,
    published_at: publishedAt,
    is_featured: input.is_featured === true,
    reading_minutes: readingMinutes(content),
    seo_title: String(input.seo_title ?? "").trim().slice(0, 200) || null,
    seo_description: String(input.seo_description ?? "").trim().slice(0, 320) || null,
  };

  const { error } = input.isNew
    ? await supabase.from("blog_posts").insert({ id, ...row })
    : await supabase.from("blog_posts").update(row).eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Another post already uses that URL slug. Pick a different one." };
    }
    return { ok: false, error: error.message };
  }

  await removeUnusedImages(supabase, id, [
    ...(cover ? [cover.path] : []),
    ...blockImagePaths(content),
  ]);

  revalidateBlog();

  return {
    ok: true,
    post: {
      id,
      slug,
      status: row.status,
      published_at: row.published_at,
      excerpt: row.excerpt,
    },
  };
}

export async function setBlogPostStatusAction(
  id: string,
  status: BlogStatus,
): Promise<{ error?: string }> {
  const supabase = await getAuthedClient();
  if (!supabase) return { error: "Your session has expired. Sign in again." };

  const { data: post } = await supabase
    .from("blog_posts")
    .select("content, published_at")
    .eq("id", id)
    .maybeSingle();
  if (!post) return { error: "This post no longer exists." };

  const update: { status: BlogStatus; published_at?: string } = { status };
  if (status === "published") {
    const content = sanitizeBlocks(post.content, id);
    if (!content.some(hasRenderableContent)) {
      return { error: "Add some content to the post before publishing it." };
    }
    if (!post.published_at) update.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from("blog_posts").update(update).eq("id", id);
  if (error) return { error: error.message };
  revalidateBlog();
  return {};
}

export async function deleteBlogPostAction(id: string): Promise<{ error?: string }> {
  const supabase = await getAuthedClient();
  if (!supabase) return { error: "Your session has expired. Sign in again." };

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return { error: error.message };

  if (UUID_RE.test(id)) await removeUnusedImages(supabase, id, []);

  revalidateBlog();
  return {};
}
