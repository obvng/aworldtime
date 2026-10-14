create table public.page_seo (
  path text primary key check (path ~ '^/world-clock/[a-z0-9]+(?:-[a-z0-9]+)*$'),
  seo_title text check (seo_title is null or char_length(seo_title) between 10 and 70),
  meta_description text check (meta_description is null or char_length(meta_description) between 50 and 170),
  updated_at timestamptz not null default now()
);

create trigger page_seo_set_updated_at
before update on public.page_seo
for each row execute function public.set_updated_at();

alter table public.page_seo enable row level security;

revoke all on public.page_seo from anon, authenticated;

create policy "page SEO is publicly readable"
on public.page_seo for select
to anon, authenticated
using (true);

create policy "admins can create page SEO"
on public.page_seo for insert
to authenticated
with check (exists (
  select 1 from public.profiles
  where profiles.id = (select auth.uid()) and profiles.role = 'admin'
));

create policy "admins can update page SEO"
on public.page_seo for update
to authenticated
using (exists (
  select 1 from public.profiles
  where profiles.id = (select auth.uid()) and profiles.role = 'admin'
))
with check (exists (
  select 1 from public.profiles
  where profiles.id = (select auth.uid()) and profiles.role = 'admin'
));

grant select on public.page_seo to anon, authenticated;
grant insert, update on public.page_seo to authenticated;
