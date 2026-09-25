import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { BlogArticle } from "@/components/blog/blog-article";
import { JsonLd } from "@/components/seo/json-ld";
import {
  findRenamedPostSlug,
  getAllPublishedPosts,
  getPublishedPostBySlug,
  getRelatedPosts,
} from "@/lib/blog/posts";
import { blogImageUrl } from "@/lib/blog/images";
import { pageMetadata } from "@/lib/seo";
import { blogPostingLd, breadcrumbLd } from "@/lib/structured-data";

// Prerendered and refreshed on a window, like the career pages. Saving a post
// in the admin revalidates it immediately; posts published after the build
// render on first request and are cached from then on.
export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const posts = await getAllPublishedPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  return pageMetadata({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || undefined,
    path: `/blog/${post.slug}`,
    keywords: post.tags.length ? post.tags.map((t) => t.replace(/-/g, " ")) : undefined,
    image:
      post.cover_image_path && post.cover_image_width && post.cover_image_height
        ? {
            url: blogImageUrl(post.cover_image_path),
            width: post.cover_image_width,
            height: post.cover_image_height,
            alt: post.cover_image_alt || post.title,
          }
        : undefined,
    article: {
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      section: post.category ?? undefined,
      tags: post.tags.map((t) => t.replace(/-/g, " ")),
    },
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    // The post may have been renamed — send old links on to the new URL.
    const renamed = await findRenamedPostSlug(slug);
    if (renamed) permanentRedirect(`/blog/${renamed}`);
    notFound();
  }

  const related = await getRelatedPosts(post);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    ...(post.category && post.category_slug
      ? [{ name: post.category, path: `/blog/category/${post.category_slug}` }]
      : []),
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd data={[blogPostingLd(post), breadcrumbLd(crumbs)]} />
      <BlogArticle post={post} related={related} />
    </>
  );
}
