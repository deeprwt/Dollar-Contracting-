"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Trash2, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { togglePublishAction, deleteJobAction } from "@/app/admin/actions/jobs";

export function JobRowActions({
  id,
  slug,
  isPublished,
}: {
  id: string;
  slug: string;
  isPublished: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function onToggle() {
    startTransition(async () => {
      await togglePublishAction(id, !isPublished);
    });
  }

  function onDelete() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    startTransition(async () => {
      await deleteJobAction(id);
    });
  }

  return (
    <>
      {isPublished && (
        <Link
          href={`/career/${slug}`}
          target="_blank"
          title="View public page"
          className="inline-flex h-7 items-center rounded-md px-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="h-3 w-3" />
        </Link>
      )}
      <button
        type="button"
        onClick={onToggle}
        disabled={pending}
        title={isPublished ? "Unpublish" : "Publish"}
        className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : isPublished ? (
          <EyeOff className="h-3 w-3" />
        ) : (
          <Eye className="h-3 w-3" />
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
        {confirming ? "Click again to confirm" : "Delete"}
      </button>
    </>
  );
}
