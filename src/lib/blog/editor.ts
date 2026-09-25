import { createBlock, sanitizeBlocks, type Block, type BlogImage } from "@/lib/blog/blocks";
import { siteConfig } from "@/lib/site-config";
import type { BlogPost, BlogStatus } from "@/lib/supabase/types";

// The editable shape of a post, as the admin editor holds it in state.
export type EditorPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: Block[];
  cover: BlogImage | null;
  category: string;
  tags: string[];
  author_name: string;
  status: BlogStatus;
  published_at: string | null;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
};

export function toEditorPost(post: BlogPost): EditorPost {
  const cover =
    post.cover_image_path && post.cover_image_width && post.cover_image_height
      ? {
          path: post.cover_image_path,
          alt: post.cover_image_alt ?? "",
          width: post.cover_image_width,
          height: post.cover_image_height,
        }
      : null;
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: sanitizeBlocks(post.content, post.id),
    cover,
    category: post.category ?? "",
    tags: post.tags ?? [],
    author_name: post.author_name,
    status: post.status,
    published_at: post.published_at,
    is_featured: post.is_featured,
    seo_title: post.seo_title ?? "",
    seo_description: post.seo_description ?? "",
  };
}

/** A blank post. The id is minted up front so images upload into its folder before the first save. */
export function newEditorPost(id: string): EditorPost {
  return {
    id,
    title: "",
    slug: "",
    excerpt: "",
    content: [createBlock("paragraph")],
    cover: null,
    category: "",
    tags: [],
    author_name: siteConfig.name,
    status: "draft",
    published_at: null,
    is_featured: false,
    seo_title: "",
    seo_description: "",
  };
}
