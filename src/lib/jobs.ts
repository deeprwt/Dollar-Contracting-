import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Job } from "@/lib/supabase/types";

export async function getPublishedJobs(): Promise<Job[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  return (data ?? []) as Job[];
}

export async function getPublishedJobBySlug(slug: string): Promise<Job | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return (data ?? null) as Job | null;
}

export function jobTypeLabel(type: Job["job_type"]): string {
  switch (type) {
    case "full-time":
      return "Full-time";
    case "part-time":
      return "Part-time";
    case "contract":
      return "Contract";
    case "apprenticeship":
      return "Apprenticeship";
  }
}
