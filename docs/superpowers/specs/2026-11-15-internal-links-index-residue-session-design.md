# Internal links, indexing residue, and admin session design

## Intent

Strengthen crawlable links between country, city, and guide pages; remove the two actionable Search Console indexing leftovers; and keep the admin browser session for 90 days.

## Scope

- Every country page shows a plain HTML list of every matching city page in the catalogue.
- City and country pages show published guides selected by explicit country-code or IANA-zone rules.
- `/cgi-sys/suspendedpage.cgi` returns `410 Gone` because it is an obsolete hosting URL.
- The existing permanent redirect from `/&` to `/` remains in place.
- Supabase auth cookies use a 90-day rolling browser lifetime. Logout, password changes, refresh-token rotation, role checks, and RLS remain unchanged.

## Constraints

- Do not change converter behavior, calculator arithmetic, titles, or descriptions.
- Do not invent guide relationships from article text at request time.
- Links must be server-rendered and crawlable without JavaScript.
- Only published guides may appear.

## Approach

Use a small explicit guide catalogue keyed by article slug with optional country codes and IANA zones. A pure selector matches published posts to a page. Country city links come from the existing city catalogue. This is preferred over database schema changes or text-search matching because the seven relationships are editorial facts and should be predictable.

