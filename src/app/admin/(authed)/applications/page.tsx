import Link from "next/link";
import { Inbox, Eye } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Application, ApplicationStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const STATUS_FILTERS: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "contacted", label: "Contacted" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];

function statusClass(status: ApplicationStatus): string {
  switch (status) {
    case "new":
      return "bg-[var(--brand)]/10 text-[var(--brand)]";
    case "reviewed":
      return "bg-sky-100 text-sky-700";
    case "contacted":
      return "bg-amber-100 text-amber-700";
    case "hired":
      return "bg-emerald-100 text-emerald-700";
    case "rejected":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = (status ?? "all") as ApplicationStatus | "all";

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (filter !== "all") query = query.eq("status", filter);

  const { data } = await query;
  const apps = (data ?? []) as Application[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-display text-3xl">Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every application submitted through the careers page.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <Link
              key={f.value}
              href={f.value === "all" ? "/admin/applications" : `/admin/applications?status=${f.value}`}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                active
                  ? "bg-[var(--brand)] text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {apps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-background p-10 text-center">
          <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No applications</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Once people apply through the careers page, they&apos;ll show up here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Position</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Received</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {apps.map((a) => (
                <tr key={a.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-semibold">{a.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.position}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    <div className="truncate">{a.email}</div>
                    <div>{a.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass(
                        a.status,
                      )}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/applications/${a.id}`}
                      className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-[var(--brand)] hover:underline"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
