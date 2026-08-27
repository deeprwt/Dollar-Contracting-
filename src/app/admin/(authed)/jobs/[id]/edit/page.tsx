import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JobForm } from "@/components/admin/job-form";
import { updateJobAction, type JobFormState } from "@/app/admin/actions/jobs";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Job } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: job } = await supabase.from("jobs").select("*").eq("id", id).single();

  if (!job) notFound();

  // Bind the job id into the action so the form keeps its (prev, formData) shape.
  const boundAction = updateJobAction.bind(null, id) as (
    state: JobFormState,
    formData: FormData,
  ) => Promise<JobFormState>;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to jobs
        </Link>
        <h1 className="heading-display mt-2 text-3xl">Edit job</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Changes go live on the public site as soon as you save (if published).
        </p>
      </div>
      <JobForm action={boundAction} initial={job as Job} submitLabel="Save changes" />
    </div>
  );
}
