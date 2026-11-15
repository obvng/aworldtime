# Country page expansion

## Scope

- Create a `/time-in/{country}` page for every country already represented in the city catalogue.
- Keep the eight existing researched country definitions.
- Derive other country pages from the real IANA zones already used by their city pages.
- Add representative Brazil city pages so each of Brazil's 16 IANA zones has a crawlable city-clock link.
- Keep `/converter` as the only converter URL. The production usage table currently contains one London–Toronto event, which is not enough demand evidence for pair pages.

## Page requirements

Every country page must have a self-referencing canonical, distinct metadata, live clocks, UTC offsets, DST state, next transition data, crawlable city links, and a sitemap entry with `lastmod`.

Brazil's 16 zone cards must each link to a matching `/world-clock/{city}` page. Those city pages use the same existing clock, offset, DST, sunrise and sunset implementation as the original city catalogue.

## Verification

- Catalogue test proves every city country has a country page.
- Brazil test proves all 16 zones have a matching linked city.
- Route tests prove the links render in server HTML.
- Full tests, lint and production build must pass.
- Live sitemap and representative routes must be checked after deployment.
