import Image from "next/image";
import Link from "next/link";
import { Newspaper, Pencil, Plus, Search, Star } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/admin/blog/status-pill";
import { blogImageUrl } from "@/lib/blog/images";
import { displayStatus, formatPostDate } from "@/lib/blog/status";
import type { BlogPost } from "@/lib/supabase/types";
import { PostRowActions } from "./post-row-actions";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "scheduled", label: "Scheduled" },
  { key: "draft", label: "Drafts" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

type Row = Pick<
  BlogPost,
  | "id"
  | "slug"
  | "title"
  | "status"
  | "published_at"
  | "updated_at"
  | "category"
  | "is_featured"
  | "cover_image_path"
  | "cover_image_alt"
>;

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Toronto",
  });
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const tab: TabKey = TABS.some((t) => t.key === params.status)
    ? (params.status as TabKey)
    : "all";
  const q = (params.q ?? "").trim().slice(0, 100);

  const supabase = await createSupabaseServerClient();
  const nowDate = new Date();
  const nowIso = nowDate.toISOString();

  let query = supabase
    .from("blog_posts")
    .select(
      "id, slug, title, status, published_at, updated_at, category, is_featured, cover_image_path, cover_image_alt",
    )
    .order("updated_at", { ascending: false })
    .limit(500);
  if (tab === "draft") query = query.eq("status", "draft");
  if (tab === "published") query = query.eq("status", "published").lte("published_at", nowIso);
  if (tab === "scheduled") query = query.eq("status", "published").gt("published_at", nowIso);
  if (q) query = query.ilike("title", `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`);

  const count = () => supabase.from("blog_posts").select("id", { count: "exact", head: true });
  const [{ data: posts }, all, published, scheduled, drafts] = await Promise.all([
    query,
    count(),
    count().eq("status", "published").lte("published_at", nowIso),
    count().eq("status", "published").gt("published_at", nowIso),
    count().eq("status", "draft"),
  ]);
  const counts: Record<TabKey, number> = {
    all: all.count ?? 0,
    published: published.count ?? 0,
    scheduled: scheduled.count ?? 0,
    draft: drafts.count ?? 0,
  };

  const rows = (posts ?? []) as Row[];
  const now = nowDate.getTime();

  function tabHref(key: TabKey) {
    const sp = new URLSearchParams();
    if (key !== "all") sp.set("status", key);
    if (q) sp.set("q", q);
    const s = sp.toString();
    return s ? `/admin/blog?${s}` : "/admin/blog";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-display text-3xl">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Write, schedule and publish articles for /blog.
          </p>
        </div>
        <Button asChild className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90">
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            New post
          </Link>
        </Button>
      </div>

      {counts.all === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-background p-10 text-center">
          <Newspaper className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No posts yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Cost guides, how-tos and project write-ups bring in search traffic and show customers
            what you do. Start your first one — it stays private until you publish it.
          </p>
          <Button
            asChild
            className="mt-4 bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
          >
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              Write a post
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav className="flex flex-wrap gap-1 rounded-lg border border-border bg-background p-1">
              {TABS.map((t) => (
                <Link
                  key={t.key}
                  href={tabHref(t.key)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    tab === t.key
                      ? "bg-[var(--brand)]/10 text-[var(--brand)]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {t.label}
                  <span className="ml-1.5 text-xs opacity-70">{counts[t.key]}</span>
                </Link>
              ))}
            </nav>
            <form action="/admin/blog" className="relative">
              {tab !== "all" && <input type="hidden" name="status" value={tab} />}
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search titles…"
                className="h-9 w-56 rounded-lg border border-input bg-background pl-8 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </form>
          </div>

          {rows.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-background px-5 py-10 text-center text-sm text-muted-foreground">
              No posts match{q ? ` “${q}”` : ""} in this view.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-background shadow-sm">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/40 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Post</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Updated</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((post) => {
                    const status = displayStatus(post, now);
                    return (
                      <tr key={post.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                              {post.cover_image_path ? (
                                <Image
                                  src={blogImageUrl(post.cover_image_path)}
                                  alt={post.cover_image_alt ?? ""}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              ) : (
                                <Newspaper className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/50" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/admin/blog/${post.id}/edit`}
                                className="inline-flex items-center gap-1.5 font-semibold hover:text-[var(--brand)]"
                              >
                                {post.is_featured && (
                                  <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-500" />
                                )}
                                <span className="line-clamp-1">{post.title}</span>
                              </Link>
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                /blog/{post.slug}
                                {post.category ? ` · ${post.category}` : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusPill status={status} />
                          {post.published_at && status !== "draft" && (
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {status === "scheduled"
                                ? `Goes live ${formatDateTime(post.published_at)}`
                                : formatPostDate(post.published_at)}
                            </p>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                          {formatPostDate(post.updated_at)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/blog/${post.id}/edit`}
                              className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              <Pencil className="h-3 w-3" />
                              Edit
                            </Link>
                            <PostRowActions id={post.id} slug={post.slug} status={status} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
