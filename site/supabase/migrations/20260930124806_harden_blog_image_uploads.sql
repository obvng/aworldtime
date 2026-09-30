update storage.buckets
set
  public = true,
  file_size_limit = 5000000,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'blog-images';

drop policy if exists "admins can upload blog images" on storage.objects;
drop policy if exists "admins can update blog images" on storage.objects;
drop policy if exists "admins can delete blog images" on storage.objects;
drop policy if exists "admins can list blog images" on storage.objects;

create policy "admins can upload blog images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'blog-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and lower(storage.extension(name)) in ('jpg', 'png', 'webp')
  and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

create policy "admins can update own blog images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'blog-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
)
with check (
  bucket_id = 'blog-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and lower(storage.extension(name)) in ('jpg', 'png', 'webp')
  and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

create policy "admins can delete own blog images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'blog-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

create policy "admins can list own blog images"
on storage.objects for select
to authenticated
using (
  bucket_id = 'blog-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);
