import Link from "next/link";
import { Briefcase, Inbox, Eye, ArrowUpRight } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [
    { count: jobsTotal },
    { count: jobsPublished },
    { count: applicationsTotal },
    { count: applicationsNew },
    { data: recentApps },
  ] = await Promise.all([
    supabase.from("jobs").select("id", { count: "exact", head: true }),
    supabase
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("applications").select("id", { count: "exact", head: true }),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("applications")
      .select("id, name, position, created_at, status")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    {
      label: "Open jobs",
      value: jobsPublished ?? 0,
      sub: `${jobsTotal ?? 0} total`,
      href: "/admin/jobs",
      icon: Briefcase,
    },
    {
      label: "New applications",
      value: applicationsNew ?? 0,
      sub: `${applicationsTotal ?? 0} total`,
      href: "/admin/applications",
      icon: Inbox,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading-display text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quick overview of your hiring pipeline.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group flex items-center justify-between rounded-xl border border-border bg-background p-5 shadow-sm transition hover:border-[var(--brand)]/40 hover:shadow-md"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
                <p className="heading-display mt-1 text-4xl">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand)]/10 text-[var(--brand)] transition group-hover:bg-[var(--brand)]/15">
                <Icon className="h-5 w-5" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-background shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="font-semibold">Recent applications</h2>
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand)] hover:underline"
          >
            See all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        {recentApps && recentApps.length > 0 ? (
          <ul className="divide-y divide-border">
            {recentApps.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between px-5 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.position}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span
                    className={`rounded-full px-2 py-0.5 font-semibold ${
                      a.status === "new"
                        ? "bg-[var(--brand)]/10 text-[var(--brand)]"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {a.status}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/admin/applications/${a.id}`}
                    className="text-[var(--brand)] hover:underline"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No applications yet. Once people apply through the careers page, they&apos;ll
            show up here.
          </p>
        )}
      </div>
    </div>
  );
}
