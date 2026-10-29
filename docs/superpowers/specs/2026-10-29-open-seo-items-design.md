# AWorldTime open SEO items design

## Intent

Close the seven items verified against the live site on 29 October 2026 without changing the approved page design or generating speculative city-pair pages.

## Product changes

- Every country zone card links to catalogue cities whose `countryCode` and IANA `timeZone` match that card. Zones without a catalogue city remain accurate and do not invent a link.
- City and country pages emit `BreadcrumbList` JSON-LD: Home, World clock, current city or country.
- All pages receive a branded 1200×630 social image through Next.js metadata. Article-specific images continue to override the default.
- Default city descriptions are stable but page-specific. They name the city, country and IANA zone without storing a seasonal offset, DST state or transition date. Country descriptions state the real zone count and use the country summary. Admin SEO overrides remain available for selected pages.

## Rendering and cache decision

City, country and UTC pages remain dynamically rendered per request. Their raw HTML must contain an actual local time for crawlers. We will not add `s-maxage`, because a cached HTML clock would knowingly serve stale time. The browser clock continues ticking after hydration.

## Verification

- Compare live HTML returned to a normal browser, Googlebot, GPTBot and ClaudeBot. Normalize timestamps and clock text before diffing. No structural or textual differences may remain after normalization.
- Confirm the live response cache headers match the per-request decision.
- Inspect Search Console's current excluded URLs in the signed-in property. Fix only URLs caused by an AWorldTime defect. Intentional redirects, canonicals and genuine removed URLs stay unchanged.

## Non-goals

- No city-pair landing pages.
- No per-city generated social cards in this pass.
- No hand-written rewrite of all 100 descriptions.
- No change to the current visual layout.

## Builder calls

- Use one code-generated brand card so it cannot go missing from the repository.
- The template owns fallback meta descriptions. Admin overrides are exceptions, not a second bulk rewrite system.
- Keep existing user files and unrelated changes untouched.
