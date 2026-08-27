"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Save, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Job, JobType } from "@/lib/supabase/types";
import type { JobFormState } from "@/app/admin/actions/jobs";

const TYPES: { value: JobType; label: string }[] = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "apprenticeship", label: "Apprenticeship" },
];

type Props = {
  action: (state: JobFormState, formData: FormData) => Promise<JobFormState>;
  initial?: Partial<Job>;
  submitLabel: string;
};

export function JobForm({ action, initial, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<JobFormState, FormData>(
    action,
    undefined,
  );

  const closesValue = initial?.closes_at
    ? new Date(initial.closes_at).toISOString().slice(0, 10)
    : "";

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <Card>
        <CardContent className="grid gap-4 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="title">Job title *</Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={initial?.title ?? ""}
                placeholder="Carpenter / Apprentice"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="slug">URL slug</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={initial?.slug ?? ""}
                placeholder="auto-generated from title"
                className="mt-1.5"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Leave blank to generate from the title. Used in the public URL:
                <code className="ml-1">/career/your-slug</code>
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="job_type">Type</Label>
              <select
                id="job_type"
                name="job_type"
                defaultValue={initial?.job_type ?? "full-time"}
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                defaultValue={initial?.location ?? "Thunder Bay, ON"}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="pay_range">Pay range</Label>
              <Input
                id="pay_range"
                name="pay_range"
                defaultValue={initial?.pay_range ?? ""}
                placeholder="$25–$35/hr"
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="summary">Short summary *</Label>
            <Textarea
              id="summary"
              name="summary"
              required
              rows={2}
              defaultValue={initial?.summary ?? ""}
              placeholder="One or two sentences shown on the careers listing card."
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="description">Full description *</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={6}
              defaultValue={initial?.description ?? ""}
              placeholder="What the role is about, who you're looking for, what a typical week looks like."
              className="mt-1.5"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="responsibilities">Responsibilities</Label>
              <Textarea
                id="responsibilities"
                name="responsibilities"
                rows={5}
                defaultValue={initial?.responsibilities ?? ""}
                placeholder={"One per line, e.g.\nFraming and finish carpentry\nReading blueprints"}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                name="requirements"
                rows={5}
                defaultValue={initial?.requirements ?? ""}
                placeholder={"One per line, e.g.\n3+ years experience\nValid driver's licence"}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="perks">Perks</Label>
              <Textarea
                id="perks"
                name="perks"
                rows={5}
                defaultValue={initial?.perks ?? ""}
                placeholder={"One per line, e.g.\nWSIB coverage\nPaid training"}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="closes_at">Application deadline (optional)</Label>
              <Input
                id="closes_at"
                name="closes_at"
                type="date"
                defaultValue={closesValue}
                className="mt-1.5"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={initial?.is_published ?? false}
                  className="h-4 w-4 rounded border-input accent-[var(--brand)]"
                />
                Published (visible on /career)
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={pending}
          className="bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white"
        >
          <Save className="mr-2 h-4 w-4" />
          {pending ? "Saving…" : submitLabel}
        </Button>
        <Link href="/admin/jobs" className="text-sm text-muted-foreground hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
