"use client";

import {
  useEffect,
  useEffectEvent,
  useId,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertTriangle,
  CalendarClock,
  Eye,
  ExternalLink,
  Loader2,
  RotateCcw,
  Save,
  Send,
  Star,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/slug";
import { siteConfig } from "@/lib/site-config";
import { displayStatus, tagLabel } from "@/lib/blog/status";
import type { EditorPost } from "@/lib/blog/editor";
import type { Block, BlogImage } from "@/lib/blog/blocks";
import type { BlogStatus } from "@/lib/supabase/types";
import { saveBlogPostAction, type BlogPostInput } from "@/app/admin/actions/blog";
import { BlockEditor } from "./block-editor";
import { ImageField } from "./image-field";
import { StatusPill } from "./status-pill";

type Props = {
  initial: EditorPost;
  isNew: boolean;
  categories: string[];
  knownTags: string[];
};

// ---------------------------------------------------------------------------
// Time helpers. The server renders in UTC, the admin types in local time, so
// anything time-zone dependent waits for the client.
// ---------------------------------------------------------------------------

function subscribeClock(onChange: () => void) {
  const timer = setInterval(onChange, 30_000);
  return () => clearInterval(timer);
}
const minuteNow = () => Math.floor(Date.now() / 60_000) * 60_000;

/** Current time (to the minute) on the client, null during server render. */
function useClientNow(): number | null {
  return useSyncExternalStore(subscribeClock, minuteNow, () => null);
}

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string): string | null {
  if (!value) return null;
  const d = new Date(value); // no offset in the string, so parsed as local time
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// ---------------------------------------------------------------------------

export function PostEditor({ initial, isNew, categories, knownTags }: Props) {
  const router = useRouter();
  const now = useClientNow();
  const [pending, startTransition] = useTransition();

  // Pinned on first render. On /admin/blog/new the first save's revalidation
  // re-renders the page, which mints a new id and passes a fresh `initial`;
  // uploads and saves must keep using the id this editor started with.
  const [postId] = useState(initial.id);
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  // New posts derive their slug from the title until the editor types one.
  const [slugEdited, setSlugEdited] = useState(Boolean(initial.slug));
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [blocks, setBlocks] = useState<Block[]>(initial.content);
  const [cover, setCover] = useState<BlogImage | null>(initial.cover);
  const [category, setCategory] = useState(initial.category);
  const [tags, setTags] = useState<string[]>(initial.tags);
  const [author, setAuthor] = useState(initial.author_name);
  const [publishedAt, setPublishedAt] = useState<string | null>(initial.published_at);
  const [featured, setFeatured] = useState(initial.is_featured);
  const [seoTitle, setSeoTitle] = useState(initial.seo_title);
  const [seoDescription, setSeoDescription] = useState(initial.seo_description);

  // What's in the database right now.
  const [status, setStatus] = useState<BlogStatus>(initial.status);
  const [savedSlug, setSavedSlug] = useState(initial.slug);
  const [savedPublishedAt, setSavedPublishedAt] = useState(initial.published_at);
  const [created, setCreated] = useState(false);

  const [uploads, setUploads] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const effectiveSlug = slugEdited ? slug : slugify(title);
  const fields: Omit<BlogPostInput, "isNew"> = {
    id: postId,
    title,
    slug: effectiveSlug,
    excerpt,
    content: blocks,
    cover,
    category,
    tags,
    author_name: author,
    published_at: publishedAt,
    is_featured: featured,
    seo_title: seoTitle,
    seo_description: seoDescription,
  };
  const snapshot = JSON.stringify(fields);
  const [savedSnapshot, setSavedSnapshot] = useState(snapshot);
  const dirty = snapshot !== savedSnapshot;
  const creating = isNew && !created;

  const liveStatus =
    now === null
      ? status === "published"
        ? "published"
        : "draft"
      : displayStatus({ status, published_at: savedPublishedAt }, now);
  const dateInFuture =
    now !== null && publishedAt !== null && new Date(publishedAt).getTime() > now;

  function save(intent: "draft" | "publish") {
    if (uploads > 0) {
      toast.error("Hang on — an image is still uploading.");
      return;
    }
    const payload: BlogPostInput = { ...fields, isNew: creating };
    const wasPublished = status === "published";
    setError(null);

    startTransition(async () => {
      const res = await saveBlogPostAction(payload, intent);
      if (!res.ok) {
        setError(res.error);
        toast.error(res.error);
        return;
      }
      const saved = res.post;
      setStatus(saved.status);
      setPublishedAt(saved.published_at);
      setSlug(saved.slug);
      setSlugEdited(true);
      setSavedSlug(saved.slug);
      setSavedPublishedAt(saved.published_at);
      setExcerpt(saved.excerpt);
      setSavedSnapshot(
        JSON.stringify({
          ...fields,
          slug: saved.slug,
          excerpt: saved.excerpt,
          published_at: saved.published_at,
        }),
      );

      const shown = displayStatus(saved);
      if (shown === "draft") {
        toast.success(creating ? "Draft created" : wasPublished ? "Post moved back to drafts" : "Draft saved");
      } else if (shown === "scheduled" && saved.published_at) {
        toast.success(`Scheduled for ${formatDateTime(saved.published_at)}`);
      } else {
        toast.success(wasPublished ? "Post updated" : "Post published", {
          action: {
            label: "View post",
            onClick: () => window.open(`/blog/${saved.slug}`, "_blank", "noopener"),
          },
        });
      }

      if (creating) {
        setCreated(true);
        router.replace(`/admin/blog/${saved.id}/edit`);
      } else {
        router.refresh();
      }
    });
  }

  // Warn before closing the tab with unsaved work.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // Ctrl/Cmd+S saves without changing the post's status.
  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "s") return;
    e.preventDefault();
    if (!pending) save(status === "published" ? "publish" : "draft");
  });
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKeyDown(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const onUploadingChange = (delta: 1 | -1) => setUploads((n) => n + delta);
  const busy = pending || uploads > 0;
  const ids = {
    title: useId(),
    slug: useId(),
    excerpt: useId(),
    date: useId(),
    category: useId(),
    categories: useId(),
    author: useId(),
    seoTitle: useId(),
    seoDescription: useId(),
  };

  const metaTitle = seoTitle.trim() || title.trim() || "Post title";
  const metaDescription = seoDescription.trim() || excerpt.trim();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">
      {/* ------------------------------------------------------------ main */}
      <div className="min-w-0 space-y-6">
        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Panel>
          <div className="space-y-4">
            <div>
              <FieldLabel htmlFor={ids.title}>Title</FieldLabel>
              <Input
                id={ids.title}
                value={title}
                maxLength={200}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How Much Does a Concrete Driveway Cost in Thunder Bay?"
                className="mt-1.5 h-12 text-xl font-bold md:text-xl"
              />
            </div>

            <div>
              <FieldLabel htmlFor={ids.slug}>URL</FieldLabel>
              <div className="mt-1.5 flex items-center overflow-hidden rounded-lg border border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                <span className="shrink-0 border-r border-input bg-muted/50 px-2.5 py-1.5 text-sm text-muted-foreground">
                  /blog/
                </span>
                <input
                  id={ids.slug}
                  value={effectiveSlug}
                  maxLength={80}
                  onChange={(e) => {
                    setSlugEdited(true);
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  onBlur={() => setSlug(slugify(effectiveSlug))}
                  placeholder="generated-from-the-title"
                  className="h-8 min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none"
                />
                {slugEdited && creating && (
                  <button
                    type="button"
                    title="Generate from title"
                    onClick={() => setSlugEdited(false)}
                    className="shrink-0 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {status === "published" && savedSlug && effectiveSlug !== savedSlug && (
                <p className="mt-1.5 text-xs text-amber-700">
                  You&apos;re changing the address of a live post. Visitors to /blog/{savedSlug} will
                  be redirected to the new URL.
                </p>
              )}
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <FieldLabel htmlFor={ids.excerpt}>Excerpt</FieldLabel>
                <Counter value={excerpt.length} max={200} />
              </div>
              <Textarea
                id={ids.excerpt}
                value={excerpt}
                maxLength={500}
                rows={2}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="One or two sentences shown on the blog listing and in search results. Leave blank to use the opening lines of the post."
                className="mt-1.5"
              />
            </div>
          </div>
        </Panel>

        <Panel title="Content">
          <BlockEditor
            postId={postId}
            blocks={blocks}
            setBlocks={setBlocks}
            onUploadingChange={onUploadingChange}
          />
        </Panel>
      </div>

      {/* --------------------------------------------------------- sidebar */}
      <aside className="space-y-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto lg:pb-2">
        <Panel>
          <div className="flex items-center justify-between">
            <StatusPill status={liveStatus} />
            <span className="text-xs text-muted-foreground">
              {pending ? (
                "Saving…"
              ) : uploads > 0 ? (
                "Uploading…"
              ) : dirty ? (
                <span className="font-medium text-amber-700">Unsaved changes</span>
              ) : creating ? (
                "Not saved yet"
              ) : (
                "All changes saved"
              )}
            </span>
          </div>

          <div className="mt-4">
            <FieldLabel htmlFor={ids.date}>
              {status === "published" && !dateInFuture ? "Published on" : "Publish date"}
            </FieldLabel>
            <div className="mt-1.5 flex gap-1.5">
              <Input
                id={ids.date}
                type="datetime-local"
                disabled={now === null}
                value={now === null ? "" : toLocalInput(publishedAt)}
                onChange={(e) => setPublishedAt(fromLocalInput(e.target.value))}
                className="h-9"
              />
              {publishedAt && (
                <button
                  type="button"
                  title="Clear date"
                  aria-label="Clear date"
                  onClick={() => setPublishedAt(null)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-input text-muted-foreground hover:bg-muted"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {dateInFuture
                ? "A future date schedules the post — it goes live automatically at that time."
                : "Leave empty to publish immediately, or pick a future date to schedule."}
            </p>
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-input accent-[var(--brand)]"
            />
            <span>
              <span className="inline-flex items-center gap-1 font-medium">
                <Star className="h-3.5 w-3.5 text-amber-500" /> Featured post
              </span>
              <span className="block text-xs text-muted-foreground">
                Shown large at the top of the blog page.
              </span>
            </span>
          </label>

          <div className="mt-5 grid gap-2">
            {status === "published" ? (
              <>
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => save("publish")}
                  className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
                >
                  {pending ? <Loader2 className="animate-spin" /> : <Save />}
                  Update post
                </Button>
                <Button type="button" variant="outline" disabled={busy} onClick={() => save("draft")}>
                  Unpublish (move to drafts)
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => save("publish")}
                  className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
                >
                  {pending ? (
                    <Loader2 className="animate-spin" />
                  ) : dateInFuture ? (
                    <CalendarClock />
                  ) : (
                    <Send />
                  )}
                  {dateInFuture ? "Schedule post" : "Publish now"}
                </Button>
                <Button type="button" variant="outline" disabled={busy} onClick={() => save("draft")}>
                  <Save /> Save draft
                </Button>
              </>
            )}
          </div>

          {!creating && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs">
              <Link
                href={`/admin/blog/${postId}/preview`}
                target="_blank"
                className="inline-flex items-center gap-1 font-semibold text-[var(--brand)] hover:underline"
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </Link>
              {liveStatus === "published" && (
                <Link
                  href={`/blog/${savedSlug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 font-semibold text-[var(--brand)] hover:underline"
                >
                  View live <ExternalLink className="h-3 w-3" />
                </Link>
              )}
              {dirty && (
                <span className="w-full text-[11px] text-muted-foreground">
                  Preview shows the last saved version.
                </span>
              )}
            </div>
          )}
          <p className="mt-3 text-[11px] text-muted-foreground">Tip: Ctrl+S saves.</p>
        </Panel>

        <Panel title="Cover image">
          <ImageField
            postId={postId}
            image={cover}
            setImage={setCover}
            onUploadingChange={onUploadingChange}
            emptyLabel="Upload cover image"
            sizes="320px"
          />
          <p className="mt-2 text-[11px] text-muted-foreground">
            Used on the blog listing, at the top of the post and when shared on social media. A
            landscape photo (roughly 1200 × 630) works best.
          </p>
        </Panel>

        <Panel title="Organize">
          <div className="space-y-3">
            <div>
              <FieldLabel htmlFor={ids.category}>Category</FieldLabel>
              <Input
                id={ids.category}
                list={ids.categories}
                value={category}
                maxLength={80}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Renovation Tips"
                className="mt-1.5"
              />
              <datalist id={ids.categories}>
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              {category.trim() && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  /blog/category/{slugify(category)}
                </p>
              )}
            </div>
            <div>
              <FieldLabel>Tags</FieldLabel>
              <TagInput tags={tags} setTags={setTags} suggestions={knownTags} />
            </div>
            <div>
              <FieldLabel htmlFor={ids.author}>Author</FieldLabel>
              <Input
                id={ids.author}
                value={author}
                maxLength={100}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={siteConfig.name}
                className="mt-1.5"
              />
            </div>
          </div>
        </Panel>

        <Panel title="Search engine listing">
          <div className="space-y-3">
            <div>
              <div className="flex items-baseline justify-between">
                <FieldLabel htmlFor={ids.seoTitle}>SEO title</FieldLabel>
                {/* Google shows ~60 characters, including the " | Dollar Contracting" suffix. */}
                <Counter value={`${metaTitle} | ${siteConfig.name}`.length} max={60} />
              </div>
              <Input
                id={ids.seoTitle}
                value={seoTitle}
                maxLength={200}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title || "Defaults to the post title"}
                className="mt-1.5"
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <FieldLabel htmlFor={ids.seoDescription}>Meta description</FieldLabel>
                <Counter value={metaDescription.length} max={160} />
              </div>
              <Textarea
                id={ids.seoDescription}
                value={seoDescription}
                maxLength={320}
                rows={3}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder={excerpt || "Defaults to the excerpt"}
                className="mt-1.5"
              />
            </div>

            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Google preview
              </p>
              <p className="mt-2 truncate text-xs text-muted-foreground">
                {siteConfig.url.replace(/^https?:\/\//, "")} › blog › {effectiveSlug || "…"}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[15px] leading-snug text-[#1a0dab]">
                {metaTitle} | {siteConfig.name}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {metaDescription || "Add an excerpt or meta description to control this text."}
              </p>
            </div>
          </div>
        </Panel>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Panel({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-background p-4 shadow-sm sm:p-5">
      {title && <h2 className="mb-3 text-sm font-semibold">{title}</h2>}
      {children}
    </section>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-semibold text-foreground/80">
      {children}
    </label>
  );
}

function Counter({ value, max }: { value: number; max: number }) {
  return (
    <span className={`text-[11px] ${value > max ? "font-semibold text-amber-700" : "text-muted-foreground"}`}>
      {value}/{max}
    </span>
  );
}

function TagInput({
  tags,
  setTags,
  suggestions,
}: {
  tags: string[];
  setTags: (update: (prev: string[]) => string[]) => void;
  suggestions: string[];
}) {
  const [draft, setDraft] = useState("");
  const listId = useId();

  function commit(raw: string) {
    const additions = raw
      .split(",")
      .map((t) => slugify(t).slice(0, 40))
      .filter(Boolean);
    if (additions.length) {
      setTags((prev) => [...new Set([...prev, ...additions])].slice(0, 20));
    }
    setDraft("");
  }

  return (
    <div className="mt-1.5 rounded-lg border border-input px-1.5 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
      {tags.length > 0 && (
        <div className="mb-1 flex flex-wrap gap-1">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--brand)]/10 py-0.5 pl-2 pr-1 text-xs font-medium text-[var(--brand)]"
            >
              {tagLabel(t)}
              <button
                type="button"
                aria-label={`Remove tag ${tagLabel(t)}`}
                onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                className="rounded-full p-0.5 hover:bg-[var(--brand)]/15"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        list={listId}
        value={draft}
        onChange={(e) => {
          const v = e.target.value;
          if (v.includes(",")) commit(v);
          else setDraft(v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit(draft);
          } else if (e.key === "Backspace" && !draft && tags.length) {
            setTags((prev) => prev.slice(0, -1));
          }
        }}
        onBlur={() => draft && commit(draft)}
        placeholder={tags.length ? "Add another…" : "Type a tag and press Enter"}
        className="h-6 w-full bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
      />
      <datalist id={listId}>
        {suggestions
          .filter((s) => !tags.includes(s))
          .map((s) => (
            <option key={s} value={tagLabel(s)} />
          ))}
      </datalist>
    </div>
  );
}
