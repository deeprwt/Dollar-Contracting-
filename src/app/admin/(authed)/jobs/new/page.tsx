import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JobForm } from "@/components/admin/job-form";
import { createJobAction } from "@/app/admin/actions/jobs";

export const dynamic = "force-dynamic";

export default function NewJobPage() {
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
        <h1 className="heading-display mt-2 text-3xl">New job</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drafts are private. Tick &quot;Published&quot; to show this on the careers page.
        </p>
      </div>
      <JobForm action={createJobAction} submitLabel="Create job" />
    </div>
  );
}
