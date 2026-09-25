import Link from "next/link";
import { ChevronLeft, ChevronRight, Newspaper, Rss } from "lucide-react";
import type { BlogCategory } from "@/lib/blog/posts";
import type { BlogPostSummary } from "@/lib/supabase/types";
import { PostCard } from "./post-card";

export function CategoryNav({
  categories,
  active,
}: {
  categories: BlogCategory[];
  active?: string;
}) {
  if (categories.length === 0) return null;
  const chip = (isActive: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
      isActive
        ? "border-[var(--brand)] bg-[var(--brand)] text-white"
        : "border-border bg-background text-foreground/80 hover:border-[var(--brand)]/40 hover:text-[var(--brand)]"
    }`;
  return (
    <nav aria-label="Blog categories" className="flex flex-wrap items-center gap-2">
      <Link href="/blog" className={chip(!active)}>
        All posts
      </Link>
      {categories.map((c) => (
        <Link key={c.slug} href={`/blog/category/${c.slug}`} className={chip(active === c.slug)}>
          {c.name}
          <span className={`text-xs ${active === c.slug ? "text-white/80" : "text-muted-foreground"}`}>
            {c.count}
          </span>
        </Link>
      ))}
    </nav>
  );
}

export function PostGrid({ posts }: { posts: BlogPostSummary[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export function EmptyBlog({ message }: { message?: string }) {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
      <Newspaper className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="mt-3 font-semibold">No articles yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {message ??
          "We're working on guides, cost breakdowns and project stories. Check back soon."}
      </p>
    </div>
  );
}

function pageHref(page: number) {
  return page <= 1 ? "/blog" : `/blog/page/${page}`;
}

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const link =
    "inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-md border border-border bg-background px-3 text-sm font-medium hover:border-[var(--brand)]/40 hover:text-[var(--brand)]";
  return (
    <nav aria-label="Blog pages" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={pageHref(page - 1)} rel="prev" className={link}>
          <ChevronLeft className="h-4 w-4" /> Newer
        </Link>
      )}
      {pages.map((p) =>
        p === page ? (
          <span
            key={p}
            aria-current="page"
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-md bg-[var(--brand)] px-3 text-sm font-semibold text-white"
          >
            {p}
          </span>
        ) : (
          <Link key={p} href={pageHref(p)} className={link}>
            {p}
          </Link>
        ),
      )}
      {page < totalPages && (
        <Link href={pageHref(page + 1)} rel="next" className={link}>
          Older <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}

export function RssLink() {
  return (
    <a
      href="/blog/feed.xml"
      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-[var(--brand)]"
    >
      <Rss className="h-3.5 w-3.5" /> RSS feed
    </a>
  );
}
