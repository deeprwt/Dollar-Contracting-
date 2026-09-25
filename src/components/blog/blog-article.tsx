import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Hash, Phone, RefreshCw, User } from "lucide-react";
import { CtaBanner } from "@/components/sections/cta-banner";
import { buildOutline, sanitizeBlocks } from "@/lib/blog/blocks";
import { blogImageUrl } from "@/lib/blog/images";
import { formatPostDate, tagLabel } from "@/lib/blog/status";
import { siteConfig } from "@/lib/site-config";
import type { BlogPost, BlogPostSummary } from "@/lib/supabase/types";
import { PostContent, TableOfContents } from "./post-content";
import { PostGrid } from "./blog-listing";

const DAY_MS = 24 * 60 * 60 * 1000;

function ShareLinks({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "Email", href: `mailto:?subject=${t}&body=${u}` },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold">Share:</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-border px-3 py-1 text-xs font-medium hover:border-[var(--brand)]/40 hover:text-[var(--brand)]"
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}

function QuoteCard() {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-5">
      <p className="font-bold">Planning a project?</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Talk to our Thunder Bay crew about your job — free, no-obligation quotes.
      </p>
      <Link
        href="/quote"
        className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand)]/90"
      >
        Get A Free Quote <ArrowRight className="h-4 w-4" />
      </Link>
      <a
        href={siteConfig.phoneHref}
        className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted"
      >
        <Phone className="h-4 w-4" /> {siteConfig.phone}
      </a>
    </div>
  );
}

export function BlogArticle({
  post,
  related = [],
}: {
  post: BlogPost;
  related?: BlogPostSummary[];
}) {
  const blocks = sanitizeBlocks(post.content, post.id);
  const outline = buildOutline(blocks);
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const showUpdated =
    post.published_at &&
    new Date(post.updated_at).getTime() - new Date(post.published_at).getTime() > DAY_MS;

  return (
    <>
      <header className="relative overflow-hidden bg-[var(--ink)] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 60% at 80% 0%, oklch(0.55 0.22 27 / 0.4) 0%, transparent 55%), radial-gradient(50% 50% at 15% 100%, oklch(0.35 0.15 27 / 0.4) 0%, transparent 60%)",
          }}
        />
        <div className="container-page relative py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-white/70">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/blog" className="hover:text-white">
              Blog
            </Link>
            {post.category && post.category_slug && (
              <>
                <span aria-hidden>/</span>
                <Link href={`/blog/category/${post.category_slug}`} className="hover:text-white">
                  {post.category}
                </Link>
              </>
            )}
          </nav>

          <div className="mt-6 max-w-3xl">
            {post.category && (
              <span className="inline-block rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                {post.category}
              </span>
            )}
            <h1 className="heading-display mt-4 text-balance text-3xl text-white sm:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 max-w-2xl text-base text-white/80 sm:text-lg">{post.excerpt}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" /> {post.author_name}
              </span>
              {post.published_at && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  <time dateTime={post.published_at}>{formatPostDate(post.published_at)}</time>
                </span>
              )}
              {showUpdated && (
                <span className="inline-flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4" />
                  Updated <time dateTime={post.updated_at}>{formatPostDate(post.updated_at)}</time>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {post.reading_minutes} min read
              </span>
            </div>
          </div>
        </div>
      </header>

      {post.cover_image_path && post.cover_image_width && post.cover_image_height && (
        <div className="container-page mt-8">
          <Image
            src={blogImageUrl(post.cover_image_path)}
            alt={post.cover_image_alt ?? ""}
            width={post.cover_image_width}
            height={post.cover_image_height}
            sizes="(min-width: 1280px) 1216px, 100vw"
            priority
            className="h-auto max-h-[560px] w-full rounded-2xl object-cover"
          />
        </div>
      )}

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 max-w-3xl">
          {outline.length >= 3 && (
            <details className="mb-8 rounded-xl border border-border bg-muted/30 p-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold">Table of contents</summary>
              <div className="mt-4">
                <TableOfContents outline={outline} />
              </div>
            </details>
          )}

          <PostContent blocks={blocks} outline={outline} />

          <div className="mt-12 space-y-5 border-t border-border pt-6">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag}`}
                    className="inline-flex items-center gap-0.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/80 hover:bg-[var(--brand)]/10 hover:text-[var(--brand)]"
                  >
                    <Hash className="h-3 w-3" />
                    {tagLabel(tag)}
                  </Link>
                ))}
              </div>
            )}
            <ShareLinks url={url} title={post.title} />
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-8">
            {outline.length >= 2 && <TableOfContents outline={outline} />}
            <QuoteCard />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-14">
          <div className="container-page">
            <div className="flex items-end justify-between gap-4">
              <h2 className="heading-display text-2xl sm:text-3xl">Keep reading</h2>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand)] hover:underline"
              >
                All articles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8">
              <PostGrid posts={related} />
            </div>
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
