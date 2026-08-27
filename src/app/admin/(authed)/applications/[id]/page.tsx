import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Application } from "@/lib/supabase/types";
import { StatusPicker } from "./status-picker";
import { NotesField } from "./notes-field";
import { AttachmentLink } from "./attachment-link";
import { DeleteApplicationButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: app } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (!app) notFound();
  const a = app as Application;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to applications
          </Link>
          <h1 className="heading-display mt-2 text-3xl">{a.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Applied for <span className="font-semibold text-foreground">{a.position}</span>
            {" · "}
            <Clock className="mb-0.5 inline h-3 w-3" /> {new Date(a.created_at).toLocaleString()}
          </p>
        </div>
        <DeleteApplicationButton id={a.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contact
            </h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2 text-sm">
                <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${a.email}`} className="break-all text-[var(--brand)] hover:underline">
                  {a.email}
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <a href={`tel:${a.phone}`} className="text-[var(--brand)] hover:underline">
                  {a.phone}
                </a>
              </div>
              {a.city && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{a.city}</span>
                </div>
              )}
              {a.experience && (
                <div className="flex items-start gap-2 text-sm">
                  <Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{a.experience} experience</span>
                </div>
              )}
            </dl>
          </section>

          {a.message && (
            <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Cover note
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{a.message}</p>
            </section>
          )}

          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Attachments
            </h2>
            <div className="mt-3 space-y-2">
              {a.resume_path ? (
                <AttachmentLink
                  path={a.resume_path}
                  label={a.resume_name ?? "Resume"}
                  icon="file"
                />
              ) : (
                <p className="text-sm text-muted-foreground">No resume uploaded.</p>
              )}
              {a.photo_paths.map((p) => (
                <AttachmentLink key={p.path} path={p.path} label={p.name} icon="image" />
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Internal notes
            </h2>
            <NotesField id={a.id} initialNotes={a.notes ?? ""} />
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </h2>
            <div className="mt-3">
              <StatusPicker id={a.id} status={a.status} />
            </div>
          </section>

          {a.job_id || a.job_title_snapshot ? (
            <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Job
              </h2>
              <p className="mt-3 text-sm font-semibold">
                {a.job_title_snapshot ?? a.position}
              </p>
              {a.job_id && (
                <Link
                  href={`/admin/jobs/${a.job_id}/edit`}
                  className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--brand)] hover:underline"
                >
                  View posting
                </Link>
              )}
            </section>
          ) : (
            <section className="rounded-xl border border-dashed border-border bg-muted/30 p-5 text-xs text-muted-foreground">
              <ImageIcon className="mb-1 h-4 w-4" />
              General application — not tied to a specific posting.
            </section>
          )}

          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick actions
            </h2>
            <div className="mt-3 grid gap-2 text-sm">
              <a
                href={`mailto:${a.email}?subject=${encodeURIComponent(`Re: ${a.position} application`)}`}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--brand)] px-3 py-2 font-semibold text-white hover:bg-[var(--brand)]/90"
              >
                <Mail className="h-4 w-4" />
                Email applicant
              </a>
              <a
                href={`tel:${a.phone}`}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 font-semibold hover:bg-muted"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
