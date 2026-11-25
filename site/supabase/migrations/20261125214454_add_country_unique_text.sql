alter table public.page_seo
add column country_text text;

alter table public.page_seo
add constraint page_seo_country_text_check
check (
  country_text is null
  or (
    path like '/time-in/%'
    and char_length(trim(country_text)) between 40 and 5000
  )
);
