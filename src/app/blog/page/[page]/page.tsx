import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { CategoryNav, Pagination, PostGrid } from "@/components/blog/blog-listing";
import { POSTS_PER_PAGE, getBlogCategories, getPublishedPosts } from "@/lib/blog/posts";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

function parsePage(raw: string): number | null {
  return /^\d{1,4}$/.test(raw) ? Number(raw) : null;
}

export async function generateStaticParams() {
  try {
    const { total } = await getPublishedPosts(1, 1);
    const pages = Math.ceil(total / POSTS_PER_PAGE);
    return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ page: String(i + 2) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const n = parsePage(page);
  if (!n) return { title: "Page not found" };
  return pageMetadata({
    title: `Blog — Page ${n}`,
    description: `Renovation tips, cost guides and project stories from Dollar Contracting — page ${n}.`,
    path: `/blog/page/${n}`,
  });
}

export default async function BlogArchivePage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const n = parsePage(page);
  if (n === 1) permanentRedirect("/blog");
  if (!n) notFound();

  const [{ posts, total }, categories] = await Promise.all([
    getPublishedPosts(n),
    getBlogCategories(),
  ]);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);
  if (n > totalPages || posts.length === 0) notFound();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={`All Articles — Page ${n}`}
        body="Renovation tips, cost guides and project stories from the Dollar Contracting crew."
        showPhone={false}
      />
      <section className="py-12 sm:py-14">
        <div className="container-page space-y-10">
          <CategoryNav categories={categories} />
          <PostGrid posts={posts} />
          <Pagination page={n} totalPages={totalPages} />
        </div>
      </section>
    </>
  );
}
