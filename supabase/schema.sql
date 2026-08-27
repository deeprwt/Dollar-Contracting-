-- Dollar Contracting — admin schema
-- Run this once in Supabase SQL Editor.

-- =====================================================================
-- 1. jobs table
-- =====================================================================
create table if not exists public.jobs (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  job_type      text not null default 'full-time', -- full-time | part-time | contract | apprenticeship
  location      text not null default 'Thunder Bay, ON',
  pay_range     text,                              -- e.g. "$25–$35/hr" — free text
  summary       text not null,                     -- short blurb shown on listing card
  description   text not null,                     -- markdown-ish long description
  responsibilities text,                           -- one item per line
  requirements  text,                              -- one item per line
  perks         text,                              -- one item per line
  is_published  boolean not null default false,
  closes_at     timestamptz,                       -- optional deadline
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists jobs_published_idx on public.jobs (is_published, created_at desc);

-- keep updated_at fresh on every update
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists jobs_touch_updated_at on public.jobs;
create trigger jobs_touch_updated_at
  before update on public.jobs
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- 2. applications table
-- =====================================================================
create table if not exists public.applications (
  id            uuid primary key default gen_random_uuid(),
  job_id        uuid references public.jobs(id) on delete set null,
  job_title_snapshot text,                          -- preserves position even if job is deleted
  name          text not null,
  email         text not null,
  phone         text not null,
  city          text,
  position      text not null,                      -- copied from job, or free-text if general application
  experience    text,
  message       text,
  resume_path   text,                               -- storage path in 'applications' bucket
  resume_name   text,
  photo_paths   jsonb not null default '[]'::jsonb, -- [{path, name}, ...]
  status        text not null default 'new',        -- new | reviewed | contacted | hired | rejected | archived
  notes         text,                               -- internal admin notes
  created_at    timestamptz not null default now()
);

create index if not exists applications_created_idx on public.applications (created_at desc);
create index if not exists applications_job_idx on public.applications (job_id);
create index if not exists applications_status_idx on public.applications (status);

-- =====================================================================
-- 3. Row Level Security
-- =====================================================================
alter table public.jobs enable row level security;
alter table public.applications enable row level security;

-- jobs: anyone (anon) can read published rows. Only authenticated users (admins) can write.
drop policy if exists "Jobs: public can read published" on public.jobs;
create policy "Jobs: public can read published"
  on public.jobs for select
  using (is_published = true);

drop policy if exists "Jobs: authenticated full read" on public.jobs;
create policy "Jobs: authenticated full read"
  on public.jobs for select
  to authenticated
  using (true);

drop policy if exists "Jobs: authenticated insert" on public.jobs;
create policy "Jobs: authenticated insert"
  on public.jobs for insert
  to authenticated
  with check (true);

drop policy if exists "Jobs: authenticated update" on public.jobs;
create policy "Jobs: authenticated update"
  on public.jobs for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Jobs: authenticated delete" on public.jobs;
create policy "Jobs: authenticated delete"
  on public.jobs for delete
  to authenticated
  using (true);

-- applications: nobody can read except authenticated admins.
-- Inserts happen server-side via the service_role key (which bypasses RLS), so no insert policy is needed.
drop policy if exists "Applications: authenticated read" on public.applications;
create policy "Applications: authenticated read"
  on public.applications for select
  to authenticated
  using (true);

drop policy if exists "Applications: authenticated update" on public.applications;
create policy "Applications: authenticated update"
  on public.applications for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Applications: authenticated delete" on public.applications;
create policy "Applications: authenticated delete"
  on public.applications for delete
  to authenticated
  using (true);

-- =====================================================================
-- 4. Storage bucket for resumes + work-sample photos
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('applications', 'applications', false)
on conflict (id) do nothing;

-- Bucket policies: server-side uploads use the service_role key (bypasses RLS),
-- and admin downloads use signed URLs generated server-side. So no public policies
-- are needed — the bucket stays private.
