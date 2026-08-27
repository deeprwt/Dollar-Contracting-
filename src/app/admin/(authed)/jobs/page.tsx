import Link from "next/link";
import { Plus, Pencil, Briefcase } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { JobRowActions } from "./job-row-actions";
import type { Job } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-display text-3xl">Jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the open roles that show on /career.
          </p>
        </div>
        <Button
          asChild
          className="bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white"
        >
          <Link href="/admin/jobs/new">
            <Plus className="mr-2 h-4 w-4" />
            New job
          </Link>
        </Button>
      </div>

      {!jobs || jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-background p-10 text-center">
          <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No jobs yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first job posting — it&apos;ll appear on the public careers page
            once you publish it.
          </p>
          <Button
            asChild
            className="mt-4 bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white"
          >
            <Link href="/admin/jobs/new">
              <Plus className="mr-2 h-4 w-4" />
              Create job
            </Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(jobs as Job[]).map((job) => (
                <tr key={job.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/jobs/${job.id}/edit`}
                      className="font-semibold hover:text-[var(--brand)]"
                    >
                      {job.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      /career/{job.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">
                    {job.job_type.replace("-", " ")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        job.is_published
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {job.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(job.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/jobs/${job.id}/edit`}
                        className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Link>
                      <JobRowActions
                        id={job.id}
                        slug={job.slug}
                        isPublished={job.is_published}
                      />
                    </div>
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
