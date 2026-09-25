import type { BlogDisplayStatus } from "@/lib/blog/status";

const STATUS_STYLES: Record<BlogDisplayStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-sky-100 text-sky-700",
  published: "bg-emerald-100 text-emerald-700",
};

export function StatusPill({ status }: { status: BlogDisplayStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
