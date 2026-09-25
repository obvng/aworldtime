alter table public.posts
add column if not exists featured_image_alt text;

comment on column public.posts.content is
  'Sanitized Markdown source rendered by the application';

comment on column public.posts.featured_image_alt is
  'Alternative text for the featured image';
