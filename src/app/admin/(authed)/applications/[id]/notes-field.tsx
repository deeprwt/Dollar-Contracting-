"use client";

import { useState, useTransition } from "react";
import { Save, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateApplicationNotesAction } from "@/app/admin/actions/applications";

export function NotesField({
  id,
  initialNotes,
}: {
  id: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [pending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  function onSave() {
    const fd = new FormData();
    fd.set("notes", notes);
    startTransition(async () => {
      await updateApplicationNotesAction(id, fd);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
    });
  }

  return (
    <div className="mt-3 space-y-2">
      <Textarea
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Private notes — not visible to the applicant."
      />
      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="sm"
          onClick={onSave}
          disabled={pending || notes === initialNotes}
          className="bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white"
        >
          <Save className="mr-1.5 h-3.5 w-3.5" />
          {pending ? "Saving…" : "Save notes"}
        </Button>
        {justSaved && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
            <Check className="h-3 w-3" />
            Saved
          </span>
        )}
      </div>
    </div>
  );
}
