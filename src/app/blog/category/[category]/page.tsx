import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { CategoryNav, PostGrid } from "@/components/blog/blog-listing";
import { JsonLd } from "@/components/seo/json-ld";
import { getBlogCategories, getPostsByCategory } from "@/lib/blog/posts";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbLd } from "@/lib/structured-data";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const categories = await getBlogCategories();
    return categories.map((c) => ({ category: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const posts = await getPostsByCategory(category);
  const name = posts[0]?.category;
  if (!name) return { title: "Category not found" };
  return pageMetadata({
    title: `${name} — Blog`,
    description: `${name}: articles, tips and project stories from Dollar Contracting, Thunder Bay's general contractor.`,
    path: `/blog/category/${category}`,
  });
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const [posts, categories] = await Promise.all([
    getPostsByCategory(category),
    getBlogCategories(),
  ]);
  const name = posts[0]?.category;
  if (!name) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name, path: `/blog/category/${category}` },
        ])}
      />
      <PageHero
        eyebrow="Blog category"
        title={name}
        body={`${posts.length} article${posts.length === 1 ? "" : "s"} from the Dollar Contracting crew.`}
        showPhone={false}
      />
      <section className="py-12 sm:py-14">
        <div className="container-page space-y-10">
          <CategoryNav categories={categories} active={category} />
          <PostGrid posts={posts} />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
