"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import type { JobType } from "@/lib/supabase/types";

export type JobFormState = { error?: string } | undefined;

const JOB_TYPES: JobType[] = ["full-time", "part-time", "contract", "apprenticeship"];

function readJobFields(formData: FormData) {
  const title = String(formData.get("title") || "").trim().slice(0, 200);
  const slugRaw = String(formData.get("slug") || "").trim();
  const slug = slugRaw ? slugify(slugRaw) : slugify(title);
  const job_type_raw = String(formData.get("job_type") || "full-time");
  const job_type: JobType = (JOB_TYPES as string[]).includes(job_type_raw)
    ? (job_type_raw as JobType)
    : "full-time";
  const location = String(formData.get("location") || "").trim().slice(0, 200) || "Thunder Bay, ON";
  const pay_range = String(formData.get("pay_range") || "").trim().slice(0, 200) || null;
  const summary = String(formData.get("summary") || "").trim().slice(0, 500);
  const description = String(formData.get("description") || "").trim().slice(0, 10000);
  const responsibilities = String(formData.get("responsibilities") || "").trim().slice(0, 5000) || null;
  const requirements = String(formData.get("requirements") || "").trim().slice(0, 5000) || null;
  const perks = String(formData.get("perks") || "").trim().slice(0, 5000) || null;
  const is_published = formData.get("is_published") === "on";
  const closesRaw = String(formData.get("closes_at") || "").trim();
  const closes_at = closesRaw ? new Date(closesRaw).toISOString() : null;

  return {
    title,
    slug,
    job_type,
    location,
    pay_range,
    summary,
    description,
    responsibilities,
    requirements,
    perks,
    is_published,
    closes_at,
  };
}

function validate(values: ReturnType<typeof readJobFields>): string | null {
  if (!values.title) return "Title is required.";
  if (!values.slug) return "Slug must contain at least one letter or number.";
  if (!values.summary) return "Summary is required.";
  if (!values.description) return "Description is required.";
  return null;
}

export async function createJobAction(
  _prev: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  const values = readJobFields(formData);
  const err = validate(values);
  if (err) return { error: err };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("jobs").insert(values);
  if (error) {
    if (error.code === "23505") {
      return { error: "A job with that slug already exists. Pick a different slug." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/jobs");
  revalidatePath("/career");
  redirect("/admin/jobs");
}

export async function updateJobAction(
  id: string,
  _prev: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  const values = readJobFields(formData);
  const err = validate(values);
  if (err) return { error: err };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("jobs").update(values).eq("id", id);
  if (error) {
    if (error.code === "23505") {
      return { error: "A job with that slug already exists. Pick a different slug." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/jobs");
  revalidatePath(`/admin/jobs/${id}/edit`);
  revalidatePath("/career");
  revalidatePath(`/career/${values.slug}`);
  redirect("/admin/jobs");
}

export async function togglePublishAction(id: string, next: boolean) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("jobs")
    .update({ is_published: next })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/jobs");
  revalidatePath("/career");
}

export async function deleteJobAction(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("jobs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/jobs");
  revalidatePath("/career");
}
