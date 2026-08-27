"use client";

import { useTransition } from "react";
import { Download, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { getAttachmentUrlAction } from "@/app/admin/actions/applications";

export function AttachmentLink({
  path,
  label,
  icon,
}: {
  path: string;
  label: string;
  icon: "file" | "image";
}) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      const url = await getAttachmentUrlAction(path);
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  const Icon = icon === "image" ? ImageIcon : FileText;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="flex w-full items-center justify-between gap-3 rounded-md border border-border bg-muted/30 px-3 py-2 text-left text-sm transition hover:bg-muted disabled:opacity-50"
    >
      <span className="flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-[var(--brand)]" />
        <span className="truncate font-medium">{label}</span>
      </span>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Download className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  );
}
