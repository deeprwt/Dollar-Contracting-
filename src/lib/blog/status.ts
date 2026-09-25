import type { BlogPost } from "@/lib/supabase/types";

export type BlogDisplayStatus = "draft" | "scheduled" | "published";

/** A published post with a future publish date is "scheduled" until then. */
export function displayStatus(
  post: Pick<BlogPost, "status" | "published_at">,
  now: number = Date.now(),
): BlogDisplayStatus {
  if (post.status !== "published") return "draft";
  if (post.published_at && new Date(post.published_at).getTime() > now) return "scheduled";
  return "published";
}

export function formatPostDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Toronto",
  });
}

/** Tags are stored as slugs ("thunder-bay"); show them as words ("thunder bay"). */
export function tagLabel(tag: string): string {
  return tag.replace(/-/g, " ");
}
