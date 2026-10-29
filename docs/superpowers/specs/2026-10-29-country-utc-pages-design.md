# Country time and UTC pages

## Intent

Add the pages supported by AWorldTime's own Search Console queries. The first release covers Brazil, Bangladesh, Turkey, Chile, Japan, Germany, Algeria and France, plus a standalone UTC page. City-pair pages remain out of scope until converter usage or Search Console queries show demand.

## Country pages

Routes use `/time-in/{country}`. Each page lists every canonical IANA zone recorded for that country in `zone.tab`, including the region label, request-time local clock, current UTC offset, current DST state and next offset change when one exists.

The first routes are:

- `/time-in/brazil`
- `/time-in/bangladesh`
- `/time-in/turkey`
- `/time-in/chile`
- `/time-in/japan`
- `/time-in/germany`
- `/time-in/algeria`
- `/time-in/france`

Current time and zone facts render in the initial HTML. The clocks continue ticking in the browser. Metadata stays stable and does not store current offsets, DST states, sunrise values or change dates.

## UTC page

`/utc` renders the current UTC time in the initial HTML and keeps it ticking in the browser. It includes a comparison table for a curated set of major world zones, showing each zone's current local time and offset from UTC.

## Discovery and indexing

All nine pages have self-referencing canonicals, distinct titles and descriptions, structured data, crawlable links from the world-clock directory and sitemap entries with a real release `lastmod`. Relevant city pages link to their country page when one exists. No pair pages are created.

## Source and scope

Country-zone membership and regional coverage come from the installed IANA `zone.tab`. Runtime time, offset and transition facts use the same `Intl` and `describeTimeZone` code as city pages. No new dependency is added.
