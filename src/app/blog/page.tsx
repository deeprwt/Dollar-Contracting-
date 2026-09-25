import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { FeaturedPostCard } from "@/components/blog/post-card";
import {
  CategoryNav,
  EmptyBlog,
  Pagination,
  PostGrid,
  RssLink,
} from "@/components/blog/blog-listing";
import { JsonLd } from "@/components/seo/json-ld";
import {
  POSTS_PER_PAGE,
  getBlogCategories,
  getFeaturedPost,
  getPublishedPosts,
} from "@/lib/blog/posts";
import { pageMetadata } from "@/lib/seo";
import { blogLd, breadcrumbLd } from "@/lib/structured-data";

// Same caching model as the career pages: prerendered, refreshed on a window,
// and revalidated on demand whenever a post is saved in the admin. The window
// is what makes scheduled posts appear on their own.
export const revalidate = 300;

const base = pageMetadata({
  title: "Blog — Renovation Tips & Cost Guides",
  description:
    "Advice from Thunder Bay's general contractor: renovation and concrete cost guides, how-tos, and before-and-after project stories from across Northern Ontario.",
  path: "/blog",
});

export const metadata: Metadata = {
  ...base,
  alternates: {
    ...base.alternates,
    types: { "application/rss+xml": "/blog/feed.xml" },
  },
};

export default async function BlogPage() {
  const [{ posts, total }, featured, categories] = await Promise.all([
    getPublishedPosts(1),
    getFeaturedPost(),
    getBlogCategories(),
  ]);

  // Lead with the featured post, or the newest one if nothing is featured.
  const hero = featured ?? posts[0] ?? null;
  const rest = posts.filter((p) => p.id !== hero?.id);
  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));

  return (
    <>
      <JsonLd
        data={[
          blogLd(),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Blog"
        title="Tips, Guides & Project Stories"
        body="Straight talk from our crew on renovations, concrete, costs and planning — plus a look at the projects we've built across Thunder Bay and Northern Ontario."
        showPhone={false}
      />

      <section className="py-12 sm:py-14">
        <div className="container-page space-y-10">
          {!hero ? (
            <EmptyBlog />
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <CategoryNav categories={categories} />
                <RssLink />
              </div>
              <FeaturedPostCard post={hero} />
              {rest.length > 0 && <PostGrid posts={rest} />}
              <Pagination page={1} totalPages={totalPages} />
            </>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
