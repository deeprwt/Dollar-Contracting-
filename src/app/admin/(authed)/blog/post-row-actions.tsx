"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { EyeOff, ExternalLink, FileSearch, Loader2, Send, Trash2 } from "lucide-react";
import { deleteBlogPostAction, setBlogPostStatusAction } from "@/app/admin/actions/blog";
import type { BlogDisplayStatus } from "@/lib/blog/status";

const actionClass =
  "inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50";

export function PostRowActions({
  id,
  slug,
  status,
}: {
  id: string;
  slug: string;
  status: BlogDisplayStatus;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const isPublished = status !== "draft";

  function onToggle() {
    startTransition(async () => {
      const res = await setBlogPostStatusAction(id, isPublished ? "draft" : "published");
      if (res.error) toast.error(res.error);
      else toast.success(isPublished ? "Moved to drafts" : "Post published");
    });
  }

  function onDelete() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    startTransition(async () => {
      const res = await deleteBlogPostAction(id);
      if (res.error) toast.error(res.error);
      else toast.success("Post deleted");
    });
  }

  return (
    <>
      {status === "published" ? (
        <Link href={`/blog/${slug}`} target="_blank" title="View live post" className={actionClass}>
          <ExternalLink className="h-3 w-3" />
        </Link>
      ) : (
        <Link
          href={`/admin/blog/${id}/preview`}
          target="_blank"
          title="Preview"
          className={actionClass}
        >
          <FileSearch className="h-3 w-3" />
        </Link>
      )}
      <button
        type="button"
        onClick={onToggle}
        disabled={pending}
        title={isPublished ? "Unpublish" : "Publish now"}
        className={actionClass}
      >
        {pending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : isPublished ? (
          <EyeOff className="h-3 w-3" />
        ) : (
          <Send className="h-3 w-3" />
        )}
        {isPublished ? "Unpublish" : "Publish"}
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className={`inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium disabled:opacity-50 ${
          confirming
            ? "bg-destructive/15 text-destructive"
            : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        }`}
      >
        <Trash2 className="h-3 w-3" />
        {confirming ? "Click again to delete" : "Delete"}
      </button>
    </>
  );
}
