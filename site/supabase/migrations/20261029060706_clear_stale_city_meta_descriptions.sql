update public.page_seo
set meta_description = null
where path like '/world-clock/%'
  and meta_description is not null
  and (
    meta_description ~* '(daylight|summer) time \(UTC[+-]'
    or meta_description ~* 'next changes (its )?clocks on'
    or meta_description ~* 'until the clocks'
  );
