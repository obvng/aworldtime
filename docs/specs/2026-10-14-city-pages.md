# AWorldTime city pages, phase 1

Phase 1 adds exactly 100 indexable city pages at `/world-clock/{slug}`. Each page contains server-rendered city facts plus a client clock that continues ticking after hydration.

Each city record contains a stable slug, city and country names, ISO country code, IANA time-zone identifier, latitude, longitude, aliases, skyline fallback and a meaningful content-update date. The first catalogue is demand-focused and can be reordered or revised when the owner supplies Search Console query data.

Every city page shows the current local time, UTC offset, time-zone name, current DST status, next offset transition when one exists, sunrise, sunset and day length. Solar times are calculated from coordinates. Time-zone and DST facts use the runtime IANA data exposed through `Intl`.

Generated titles and descriptions use several city-specific facts. An authenticated admin can override both fields. Overrides are stored in Supabase by pathname and must survive a new request. The default remains available when no override exists.

The homepage uses a fixed H1. The detected city remains the most prominent clock label but is not the page H1.

`/converter` remains the only indexable converter URL. Query parameters initialise its controls while the canonical URL remains `/converter`. Parameter combinations are not added to the sitemap. Anonymous aggregate usage counts record unordered city pairs without IP addresses or user identifiers.

The sitemap contains the 100 city URLs. A city's `lastmod` is its meaningful `contentUpdatedAt` value or the `updated_at` value of a saved SEO override, whichever is later. A moving clock does not change `lastmod`.

All public routes use the same rendering path for browsers, Googlebot and AI crawlers. No code branches on crawler user agents.

Phase 2 pair pages are outside this build.
