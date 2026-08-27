// Row types matching the schema in `supabase/schema.sql`.
// Keep these in sync with that file if you change the SQL.

export type JobType = "full-time" | "part-time" | "contract" | "apprenticeship";

export type Job = {
  id: string;
  slug: string;
  title: string;
  job_type: JobType;
  location: string;
  pay_range: string | null;
  summary: string;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  perks: string | null;
  is_published: boolean;
  closes_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ApplicationStatus =
  | "new"
  | "reviewed"
  | "contacted"
  | "hired"
  | "rejected"
  | "archived";

export type ApplicationPhoto = { path: string; name: string };

export type Application = {
  id: string;
  job_id: string | null;
  job_title_snapshot: string | null;
  name: string;
  email: string;
  phone: string;
  city: string | null;
  position: string;
  experience: string | null;
  message: string | null;
  resume_path: string | null;
  resume_name: string | null;
  photo_paths: ApplicationPhoto[];
  status: ApplicationStatus;
  notes: string | null;
  created_at: string;
};
