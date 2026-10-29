# Country Time and UTC Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add eight demand-backed country time pages and one UTC page with crawler-readable live time and zone facts.

**Architecture:** Store the approved country-to-IANA-zone catalogue in one typed module, calculate live facts through the existing time helpers, and render request-time HTML through dynamic Next.js routes. A small client clock component hydrates from the exact server timestamp and then ticks without replacing the crawler-visible initial value.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, `Intl`, Vitest, Testing Library

**Spec:** `docs/superpowers/specs/2026-10-29-country-utc-pages-design.md`

## Global Constraints

- Build only Brazil, Bangladesh, Turkey, Chile, Japan, Germany, Algeria, France and `/utc`.
- Do not create city-pair pages.
- Country-zone membership must match IANA `zone.tab`.
- Current clock values must appear in raw HTML and tick after hydration.
- Metadata must not contain volatile offsets, DST states or transition dates.
- Add no dependency.

## Review Focus

- Multi-zone countries must not collapse zones that happen to share an offset today; Task 1 tests Brazil's 16 identifiers and Chile's four.
- Single-zone countries must still render a useful page; Task 2 tests Bangladesh.
- Zones without a future transition must say they do not change seasonally; Task 2 tests Algeria.
- Server and client clock output must begin from the same instant; Task 2 tests the raw HTML timestamp.
- New URLs must be discoverable without JavaScript; Task 4 tests sitemap and directory links.

---

### Task 1: Country zone catalogue

**Files:**
- Create: `site/lib/country-times.ts`
- Test: `site/tests/country-times.test.ts`

**Interfaces:**
- Produces: `COUNTRY_TIME_PAGES: CountryTimePage[]`, `countryTimeBySlug(slug: string)`, `countryTimeByCode(code: string)`.
- `CountryTimePage` carries `slug`, `name`, `countryCode`, `summary`, `updatedAt` and `zones`; each zone carries `timeZone` and `regions`.

- [ ] **Step 1: Write failing catalogue tests** asserting eight slugs, Brazil's 16 exact zone IDs, Chile's four exact zone IDs and the single-zone entries.
- [ ] **Step 2: Run `npm test -- --run tests/country-times.test.ts` and confirm the module is missing.**
- [ ] **Step 3: Implement the typed catalogue from `/usr/share/zoneinfo/zone.tab`.**
- [ ] **Step 4: Run the test and confirm it passes.**
- [ ] **Step 5: Commit the catalogue and test.**

### Task 2: Country route and server-rendered zone clocks

**Files:**
- Create: `site/app/time-in/[country]/page.tsx`
- Create: `site/components/zone-live-time.tsx`
- Test: `site/tests/country-route.test.tsx`
- Test: `site/tests/components/zone-live-time.test.tsx`

**Interfaces:**
- Consumes: `countryTimeBySlug`, `COUNTRY_TIME_PAGES`, `describeTimeZone`, `timeZoneName`, `formatTimeWithPeriod`, `formatDate`.
- Produces: dynamic `/time-in/{country}` pages and `ZoneLiveTime({ timeZone, initialNow, includeDate? })`.

- [ ] **Step 1: Write failing tests** for static params, distinct canonical metadata, stable descriptions, Bangladesh's single zone, Algeria's no-transition text, Brazil's full zone list and server HTML containing an actual time.
- [ ] **Step 2: Run the two test files and confirm the route/component are missing.**
- [ ] **Step 3: Implement the client clock seeded from the request timestamp.**
- [ ] **Step 4: Implement the dynamic country route, zone facts and WebPage/ItemList JSON-LD.**
- [ ] **Step 5: Run both test files and confirm they pass.**
- [ ] **Step 6: Commit the country route.**

### Task 3: UTC page and comparison table

**Files:**
- Create: `site/app/utc/page.tsx`
- Create: `site/lib/utc-comparisons.ts`
- Test: `site/tests/utc-route.test.tsx`

**Interfaces:**
- Produces: dynamic `/utc`, `UTC_COMPARISON_ZONES`, and crawler-readable UTC/local comparison rows.

- [ ] **Step 1: Write a failing route test** for canonical metadata, raw UTC time and at least ten unique comparison zones with offsets.
- [ ] **Step 2: Run the test and confirm `/utc` is missing.**
- [ ] **Step 3: Implement the curated comparison list and dynamic route using `ZoneLiveTime`.**
- [ ] **Step 4: Run the test and confirm it passes.**
- [ ] **Step 5: Commit the UTC page.**

### Task 4: Discovery, sitemap and styling

**Files:**
- Modify: `site/components/world-clock-directory.tsx`
- Modify: `site/app/world-clock/[city]/page.tsx`
- Modify: `site/app/sitemap.ts`
- Modify: `site/app/globals.css`
- Modify: `site/tests/search-indexing.test.ts`
- Modify: `site/tests/city-route.test.tsx`

**Interfaces:**
- Consumes: `COUNTRY_TIME_PAGES`, `countryTimeByCode`.
- Produces: crawlable directory/city links and nine sitemap entries.

- [ ] **Step 1: Write failing tests** for all nine sitemap URLs, country links in world-clock HTML and a relevant city-to-country link.
- [ ] **Step 2: Run the affected tests and confirm discovery assertions fail.**
- [ ] **Step 3: Add crawlable directory links, relevant city links, sitemap entries and responsive styles.**
- [ ] **Step 4: Run affected tests and confirm they pass.**
- [ ] **Step 5: Run lint, the full test suite and the webpack production build; report every failure by name.**
- [ ] **Step 6: Commit the discovery and styling work.**

### Task 5: Production verification

**Files:**
- No source changes expected.

**Interfaces:**
- Consumes: the completed commits and Vercel Git deployment.
- Produces: live HTTP proof for metadata, clocks, canonicals, sitemap and all nine routes.

- [ ] **Step 1: Push the branch and deploy the approved commits to `main`.**
- [ ] **Step 2: Wait for Vercel production state `READY`.**
- [ ] **Step 3: Fetch representative raw HTML for Brazil, Bangladesh and `/utc`; confirm current time values, stable metadata and self-canonicals.**
- [ ] **Step 4: Fetch the live sitemap and confirm all nine URLs.**
