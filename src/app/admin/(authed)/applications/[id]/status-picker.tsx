"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateApplicationStatusAction } from "@/app/admin/actions/applications";
import type { ApplicationStatus } from "@/lib/supabase/types";

const STATUSES: { value: ApplicationStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "contacted", label: "Contacted" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];

export function StatusPicker({
  id,
  status,
}: {
  id: string;
  status: ApplicationStatus;
}) {
  const [pending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ApplicationStatus;
    startTransition(async () => {
      await updateApplicationStatusAction(id, next);
    });
  }

  return (
    <div className="relative">
      <select
        value={status}
        onChange={onChange}
        disabled={pending}
        className="h-10 w-full rounded-md border border-input bg-background px-3 pr-9 text-sm disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {pending && (
        <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
