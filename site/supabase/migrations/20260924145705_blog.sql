create extension if not exists pgcrypto;

create type public.post_status as enum ('draft', 'scheduled', 'published');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('editor', 'admin')),
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text not null default '',
  content text not null default '',
  category text not null default 'Guides',
  featured_image_url text,
  status public.post_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  seo_title text,
  meta_description text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image_url text,
  noindex boolean not null default false,
  author_id uuid not null references public.profiles(id) on delete restrict,
  constraint published_posts_need_a_date check (status = 'draft' or published_at is not null)
);

create index posts_author_id_idx on public.posts(author_id);
create index posts_category_idx on public.posts(category);
create index posts_publication_idx on public.posts(published_at desc)
  where status = 'published';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;

create policy "profiles can read their own role"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "published posts are public"
on public.posts for select
to anon, authenticated
using (status = 'published' and published_at <= now());

create policy "admins can read every post"
on public.posts for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

create policy "admins can create posts"
on public.posts for insert
to authenticated
with check (
  author_id = (select auth.uid()) and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

create policy "admins can update posts"
on public.posts for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
)
with check (
  author_id = (select auth.uid()) and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

create policy "admins can delete posts"
on public.posts for delete
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

grant usage on schema public to anon, authenticated;
grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
grant select on public.profiles to authenticated;

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = excluded.public;

create policy "admins can upload blog images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'blog-images' and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

create policy "admins can update blog images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'blog-images' and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
)
with check (
  bucket_id = 'blog-images' and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

create policy "admins can delete blog images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'blog-images' and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

create policy "admins can list blog images"
on storage.objects for select
to authenticated
using (
  bucket_id = 'blog-images' and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);
