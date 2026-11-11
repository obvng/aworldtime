alter table public.page_seo
drop constraint page_seo_path_check;

alter table public.page_seo
add constraint page_seo_path_check
check (
  path ~ '^(?:/(?:world-clock|converter|meeting-planner|blog|utc)?|/(?:world-clock|time-in)/[a-z0-9]+(?:-[a-z0-9]+)*)$'
);
