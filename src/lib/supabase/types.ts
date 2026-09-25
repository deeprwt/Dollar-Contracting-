// Row types matching the schema in `supabase/schema.sql` and `supabase/blog.sql`.
// Keep these in sync with those files if you change the SQL.

import type { Block } from "@/lib/blog/blocks";

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

export type BlogStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  slug: string;
  previous_slugs: string[];
  title: string;
  excerpt: string;
  // Validated against the block model in `src/lib/blog/blocks.ts` on save.
  content: Block[];
  cover_image_path: string | null;
  cover_image_alt: string | null;
  cover_image_width: number | null;
  cover_image_height: number | null;
  category: string | null;
  category_slug: string | null;
  tags: string[];
  author_name: string;
  status: BlogStatus;
  published_at: string | null;
  is_featured: boolean;
  reading_minutes: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

// Columns needed to render a post card — everything except the heavy `content`.
export type BlogPostSummary = Omit<BlogPost, "content" | "previous_slugs">;
