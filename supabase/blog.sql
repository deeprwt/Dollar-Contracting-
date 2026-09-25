-- Dollar Contracting — blog schema
-- Run this once in Supabase SQL Editor, after schema.sql. Safe to re-run.

-- =====================================================================
-- 1. blog_posts table
-- =====================================================================
create table if not exists public.blog_posts (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  previous_slugs     text[] not null default '{}',     -- old slugs, 301-redirected to the current one
  title              text not null,
  excerpt            text not null default '',         -- short summary for cards + meta description fallback
  content            jsonb not null default '[]'::jsonb, -- array of content blocks, see src/lib/blog/blocks.ts
  cover_image_path   text,                             -- storage path in the 'blog' bucket
  cover_image_alt    text,
  cover_image_width  integer,
  cover_image_height integer,
  category           text,                             -- display name, e.g. "Concrete Tips"
  category_slug      text,                             -- slugified category, used in /blog/category/[slug]
  tags               text[] not null default '{}',     -- slugified tags, used in /blog/tag/[tag]
  author_name        text not null default 'Dollar Contracting',
  status             text not null default 'draft' check (status in ('draft', 'published')),
  published_at       timestamptz,                      -- a future date schedules the post
  is_featured        boolean not null default false,
  reading_minutes    integer not null default 1,
  seo_title          text,
  seo_description    text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists blog_posts_live_idx on public.blog_posts (status, published_at desc);
create index if not exists blog_posts_category_idx on public.blog_posts (category_slug);
create index if not exists blog_posts_tags_idx on public.blog_posts using gin (tags);
create index if not exists blog_posts_previous_slugs_idx on public.blog_posts using gin (previous_slugs);

-- Same helper as schema.sql, repeated so this file also runs on its own.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists blog_posts_touch_updated_at on public.blog_posts;
create trigger blog_posts_touch_updated_at
  before update on public.blog_posts
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- 2. Row Level Security
-- =====================================================================
alter table public.blog_posts enable row level security;

-- Anyone can read posts that are published and whose publish time has passed.
-- A published post with a future published_at stays hidden until then.
drop policy if exists "Blog: public can read live posts" on public.blog_posts;
create policy "Blog: public can read live posts"
  on public.blog_posts for select
  using (status = 'published' and published_at is not null and published_at <= now());

drop policy if exists "Blog: authenticated full read" on public.blog_posts;
create policy "Blog: authenticated full read"
  on public.blog_posts for select
  to authenticated
  using (true);

drop policy if exists "Blog: authenticated insert" on public.blog_posts;
create policy "Blog: authenticated insert"
  on public.blog_posts for insert
  to authenticated
  with check (true);

drop policy if exists "Blog: authenticated update" on public.blog_posts;
create policy "Blog: authenticated update"
  on public.blog_posts for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Blog: authenticated delete" on public.blog_posts;
create policy "Blog: authenticated delete"
  on public.blog_posts for delete
  to authenticated
  using (true);

-- =====================================================================
-- 3. Storage bucket for blog images
-- =====================================================================
-- Public bucket: images are served straight from the Supabase CDN at
-- /storage/v1/object/public/blog/<path>, no signed URLs needed.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog',
  'blog',
  true,
  10485760, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- The admin editor uploads directly from the browser with the signed-in
-- admin's session (this sidesteps the 1 MB Server Action body limit), so
-- authenticated users need write access to this bucket. Reading needs no
-- policy because the bucket is public; the select policy is for listing and
-- deleting files, which Supabase requires alongside the delete policy.
drop policy if exists "Blog images: authenticated select" on storage.objects;
create policy "Blog images: authenticated select"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'blog');

drop policy if exists "Blog images: authenticated insert" on storage.objects;
create policy "Blog images: authenticated insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog');

drop policy if exists "Blog images: authenticated update" on storage.objects;
create policy "Blog images: authenticated update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog')
  with check (bucket_id = 'blog');

drop policy if exists "Blog images: authenticated delete" on storage.objects;
create policy "Blog images: authenticated delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog');
