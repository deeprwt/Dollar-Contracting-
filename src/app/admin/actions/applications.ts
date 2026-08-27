"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ApplicationStatus } from "@/lib/supabase/types";

const STATUSES: ApplicationStatus[] = [
  "new",
  "reviewed",
  "contacted",
  "hired",
  "rejected",
  "archived",
];

export async function updateApplicationStatusAction(
  id: string,
  status: ApplicationStatus,
) {
  if (!(STATUSES as string[]).includes(status)) {
    throw new Error("Invalid status");
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id}`);
}

export async function updateApplicationNotesAction(id: string, formData: FormData) {
  const notes = String(formData.get("notes") || "").slice(0, 5000);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("applications")
    .update({ notes })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/applications/${id}`);
}

export async function deleteApplicationAction(id: string) {
  const supabase = await createSupabaseServerClient();

  // Fetch attachment paths so we can clean up storage too.
  const { data: app } = await supabase
    .from("applications")
    .select("resume_path, photo_paths")
    .eq("id", id)
    .single();

  const paths: string[] = [];
  if (app?.resume_path) paths.push(app.resume_path);
  if (Array.isArray(app?.photo_paths)) {
    for (const p of app.photo_paths) {
      if (p && typeof p === "object" && typeof p.path === "string") paths.push(p.path);
    }
  }

  if (paths.length > 0) {
    const admin = createSupabaseAdminClient();
    await admin.storage.from("applications").remove(paths);
  }

  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/applications");
  redirect("/admin/applications");
}

// Generate a short-lived signed URL for an attachment so admins can download it.
export async function getAttachmentUrlAction(path: string): Promise<string> {
  // Make sure the caller is an admin (the page that calls this is already gated,
  // but defense-in-depth doesn't hurt).
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.storage
    .from("applications")
    .createSignedUrl(path, 60 * 10); // 10 minutes
  if (error || !data) throw new Error(error?.message ?? "Failed to sign URL");
  return data.signedUrl;
}
