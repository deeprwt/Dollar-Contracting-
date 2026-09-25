import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Newspaper } from "lucide-react";
import { blogImageUrl } from "@/lib/blog/images";
import { formatPostDate } from "@/lib/blog/status";
import type { BlogPostSummary } from "@/lib/supabase/types";

function Cover({
  post,
  sizes,
  priority,
}: {
  post: BlogPostSummary;
  sizes: string;
  priority?: boolean;
}) {
  if (!post.cover_image_path) {
    return (
      <div
        aria-hidden
        className="flex h-full w-full items-center justify-center bg-[var(--ink)] text-white/30"
        style={{
          background:
            "radial-gradient(70% 90% at 90% 0%, oklch(0.55 0.22 27 / 0.45) 0%, transparent 60%), var(--ink)",
        }}
      >
        <Newspaper className="h-10 w-10" />
      </div>
    );
  }
  return (
    <Image
      src={blogImageUrl(post.cover_image_path)}
      alt={post.cover_image_alt ?? ""}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition duration-500 group-hover:scale-[1.03]"
    />
  );
}

function Meta({ post }: { post: BlogPostSummary }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
      {post.category && (
        <span className="rounded-full bg-[var(--brand)]/10 px-2.5 py-0.5 font-semibold text-[var(--brand)]">
          {post.category}
        </span>
      )}
      <time dateTime={post.published_at ?? undefined} className="text-muted-foreground">
        {formatPostDate(post.published_at)}
      </time>
    </div>
  );
}

export function PostCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition hover:border-[var(--brand)]/40 hover:shadow-md"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Cover post={post} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Meta post={post} />
        <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug group-hover:text-[var(--brand)]">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        )}
        <div className="mt-4 flex flex-1 items-end justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" /> {post.reading_minutes} min read
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-[var(--brand)]">
            Read more
            <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedPostCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition hover:border-[var(--brand)]/40 hover:shadow-lg md:grid-cols-2"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted md:aspect-auto md:min-h-80">
        <Cover post={post} sizes="(min-width: 768px) 50vw, 100vw" priority />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
          {post.is_featured ? "Featured" : "Latest post"}
        </span>
        <div className="mt-3">
          <Meta post={post} />
        </div>
        <h2 className="heading-display mt-3 text-2xl group-hover:text-[var(--brand)] sm:text-3xl">
          {post.title}
        </h2>
        {post.excerpt && <p className="mt-3 line-clamp-4 text-muted-foreground">{post.excerpt}</p>}
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand)]">
          Read the article
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
