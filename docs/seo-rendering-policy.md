# SEO rendering policy

City, country and UTC pages are rendered for every request. Their raw HTML includes the current local time, UTC offset, DST status and other page-specific data before browser JavaScript runs.

These responses do not use a CDN `s-maxage`. A shared cache would knowingly return an old wall-clock time under a page title that promises the current time. Browser code takes over after hydration and updates the clock every second.

Default meta descriptions come from stable catalogue data. They may include the city, country, IANA time-zone identifier, zone count and the kinds of data shown on the page. They must not store a current offset, current DST state or a transition date because those values expire.

The template owns default descriptions. Admin overrides are reserved for selected pages where Search Console data supports a hand-written snippet. They are not a second bulk-description system.
