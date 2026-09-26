-- Portfolio Work System — Ramy Said Eid
-- Creates projects, project_images, indexes, triggers, RLS, storage bucket

-- Enable pgcrypto for gen_random_uuid if not exists
create extension if not exists "pgcrypto";

-- ============ TABLES ============

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text,
  short_description text,
  description text,
  year integer,
  cover_image text,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============ INDEXES ============

create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_projects_published_sort on public.projects(published, sort_order);
create index if not exists idx_projects_category on public.projects(category);
create index if not exists idx_projects_featured on public.projects(featured) where featured = true;
create index if not exists idx_project_images_project_id on public.project_images(project_id);
create index if not exists idx_project_images_sort on public.project_images(project_id, sort_order);

-- ============ UPDATED_AT TRIGGER ============

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

-- ============ RLS ============

alter table public.projects enable row level security;
alter table public.project_images enable row level security;

-- Public can read published projects
drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
  on public.projects for select
  using (published = true);

-- Public can read images of published projects
drop policy if exists "Public can read images of published projects" on public.project_images;
create policy "Public can read images of published projects"
  on public.project_images for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_images.project_id and p.published = true
    )
  );

-- Authenticated (admin) can do everything — protected by Supabase Auth
-- Projects
drop policy if exists "Authenticated can read all projects" on public.projects;
create policy "Authenticated can read all projects"
  on public.projects for select
  using (auth.role() = 'authenticated');

drop policy if exists "Authenticated can insert projects" on public.projects;
create policy "Authenticated can insert projects"
  on public.projects for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can update projects" on public.projects;
create policy "Authenticated can update projects"
  on public.projects for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can delete projects" on public.projects;
create policy "Authenticated can delete projects"
  on public.projects for delete
  using (auth.role() = 'authenticated');

-- Project images
drop policy if exists "Authenticated can read all project_images" on public.project_images;
create policy "Authenticated can read all project_images"
  on public.project_images for select
  using (auth.role() = 'authenticated');

drop policy if exists "Authenticated can insert project_images" on public.project_images;
create policy "Authenticated can insert project_images"
  on public.project_images for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can update project_images" on public.project_images;
create policy "Authenticated can update project_images"
  on public.project_images for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can delete project_images" on public.project_images;
create policy "Authenticated can delete project_images"
  on public.project_images for delete
  using (auth.role() = 'authenticated');

-- ============ STORAGE BUCKET ============

insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- Allow public to read portfolio images
drop policy if exists "Public can view portfolio images" on storage.objects;
create policy "Public can view portfolio images"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

-- Authenticated can upload
drop policy if exists "Authenticated can upload portfolio images" on storage.objects;
create policy "Authenticated can upload portfolio images"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

-- Authenticated can update
drop policy if exists "Authenticated can update portfolio images" on storage.objects;
create policy "Authenticated can update portfolio images"
  on storage.objects for update
  using (bucket_id = 'portfolio-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

-- Authenticated can delete
drop policy if exists "Authenticated can delete portfolio images" on storage.objects;
create policy "Authenticated can delete portfolio images"
  on storage.objects for delete
  using (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');
