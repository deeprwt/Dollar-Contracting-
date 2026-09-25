import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { PostGrid } from "@/components/blog/blog-listing";
import { getBlogTags, getPostsByTag } from "@/lib/blog/posts";
import { tagLabel } from "@/lib/blog/status";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const tags = await getBlogTags();
    return tags.map((tag) => ({ tag }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const label = tagLabel(tag);
  return pageMetadata({
    title: `Articles tagged “${label}” — Blog`,
    description: `Dollar Contracting blog articles about ${label}.`,
    path: `/blog/tag/${tag}`,
    // Tag archives mostly repeat content that categories and posts already
    // cover, so keep them out of the index while still letting Google follow
    // the links through to the posts.
    robots: { index: false, follow: true },
  });
}

export default async function BlogTagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <>
      <PageHero
        eyebrow="Tag"
        title={`#${tagLabel(tag)}`}
        body={`${posts.length} article${posts.length === 1 ? "" : "s"} tagged “${tagLabel(tag)}”.`}
        showPhone={false}
      />
      <section className="py-12 sm:py-14">
        <div className="container-page">
          <PostGrid posts={posts} />
        </div>
      </section>
    </>
  );
}
