# AWorldTime Open SEO Items Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close all seven verified SEO and crawlability items around the new city, country and UTC pages.

**Architecture:** Reuse the city catalogue as the single source for country backlinks, add a shared breadcrumb JSON-LD builder, and add a root Next.js social image inherited by ordinary pages. Keep live clocks dynamically server-rendered and verify crawler parity against production after deployment.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest, Testing Library, Vercel.

**Spec:** `docs/superpowers/specs/2026-10-29-open-seo-items-design.md`

## Global constraints

- Do not add city-pair landing pages.
- Do not store seasonal UTC offsets, DST state or transition dates in meta descriptions.
- Raw city, country and UTC HTML must contain an actual local time.
- Article-specific social images must override the site default.
- Preserve unrelated user files.

## Review focus

- A country zone with no matching catalogue city renders accurate data without an empty link group.
- Türkiye's catalogue label and the country-page name mismatch must not break linking; match by country code and IANA zone.
- Breadcrumb URLs must use the canonical `www` host and valid positions.
- The social image must be exactly 1200×630 and present in ordinary page metadata.
- Crawler responses may differ in clock seconds only; normalized HTML must otherwise match.

---

### Task 1: Country-to-city links

**Files:**
- Modify: `site/lib/country-times.ts`
- Modify: `site/app/time-in/[country]/page.tsx`
- Test: `site/tests/country-route.test.tsx`

**Interfaces:**
- Consumes: `CITIES: City[]`, `CountryZone.timeZone`, `CountryTimePage.countryCode`.
- Produces: `citiesForCountryZone(countryCode: string, timeZone: string): City[]` and crawlable city links inside matching zone cards.

- [ ] Write failing tests for Brazil's three `America/Sao_Paulo` city links, one-city countries, and an unrepresented zone with no empty links.
- [ ] Run the focused country tests and confirm the new assertions fail.
- [ ] Implement the catalogue lookup and render links in each matching zone card.
- [ ] Run the focused tests and confirm they pass.
- [ ] Commit the task.

### Task 2: Breadcrumb structured data

**Files:**
- Modify: `site/lib/seo.ts`
- Modify: `site/app/world-clock/[city]/page.tsx`
- Modify: `site/app/time-in/[country]/page.tsx`
- Test: `site/tests/seo.test.ts`
- Test: `site/tests/city-route.test.tsx`
- Test: `site/tests/country-route.test.tsx`

**Interfaces:**
- Produces: `buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>)` returning a schema.org `BreadcrumbList` with one-based positions and absolute URLs.

- [ ] Write failing helper and route tests for exact names, positions and canonical URLs.
- [ ] Run the focused tests and confirm they fail.
- [ ] Implement the helper and add one breadcrumb JSON-LD script to each city and country page.
- [ ] Run the focused tests and confirm they pass.
- [ ] Commit the task.

### Task 3: Default social-sharing image

**Files:**
- Create: `site/app/opengraph-image.tsx`
- Modify: `site/lib/seo.ts`
- Modify: `site/app/layout.tsx`
- Test: `site/tests/seo.test.ts`
- Test: `site/tests/page-metadata.test.ts`
- Test: `site/tests/opengraph-image.test.tsx`

**Interfaces:**
- Produces: a 1200×630 `ImageResponse` route and `/opengraph-image` metadata image inherited by ordinary pages.

- [ ] Write failing metadata and image-dimension tests.
- [ ] Run the focused tests and confirm they fail.
- [ ] Implement the generated brand card and explicit OG/Twitter image metadata.
- [ ] Confirm article image overrides still pass their existing tests.
- [ ] Run the focused tests and commit.

### Task 4: Stable page-specific descriptions and rendering policy

**Files:**
- Modify: `site/app/world-clock/[city]/page.tsx`
- Modify: `site/app/time-in/[country]/page.tsx`
- Create: `docs/seo-rendering-policy.md`
- Test: `site/tests/city-route.test.tsx`
- Test: `site/tests/country-route.test.tsx`

**Interfaces:**
- Produces stable fallback descriptions based on city/country catalogue data, plus the documented no-CDN-cache decision.

- [ ] Write failing tests proving two cities and two countries have distinct stable descriptions with no seasonal values.
- [ ] Run the focused tests and confirm they fail.
- [ ] Implement the templates and document why dynamic rendering remains enabled.
- [ ] Run the focused tests and commit.

### Task 5: Full verification and deployment

**Files:**
- Modify only if verification finds a product defect.

**Interfaces:**
- Consumes the production deployment URL and public custom domain.
- Produces test, build, crawler-parity, cache-header and Search Console evidence.

- [ ] Run the complete test suite, lint and webpack production build.
- [ ] Verify local raw HTML contains times, breadcrumb JSON-LD, city backlinks and the OG image.
- [ ] Push the reviewed branch and production `main` after the release gate is green.
- [ ] Wait for the matching Vercel commit to reach `READY`.
- [ ] Fetch city and country pages using browser, Googlebot, GPTBot and ClaudeBot user agents; normalize volatile time values and diff the bodies.
- [ ] Record the live cache headers and confirm they match the no-cache decision.
- [ ] Open Search Console in the signed-in browser, identify every currently excluded URL, and classify each as fix, intentional or stale report.
- [ ] Fix and redeploy only confirmed product defects, then repeat the affected checks.
