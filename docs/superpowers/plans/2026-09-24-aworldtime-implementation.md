# AWORLDTIME.COM Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a mobile-first world-time utility with a secure SEO blog admin for AWORLDTIME.COM.

**Architecture:** A Next.js App Router application will render public time tools and search-friendly blog pages on Vercel. Supabase will provide administrator authentication, PostgreSQL content storage, row-level security, and featured-image storage. Browser `Intl` APIs will drive live local time, while a bundled city catalog will keep the primary experience independent of a paid time API.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Supabase Auth/Postgres/Storage, Zod, Vitest, Testing Library, Playwright, Vercel

**Spec:** `docs/superpowers/specs/2026-09-24-aworldtime-design.md`

## Global Constraints

- Brand name: `AWORLDTIME.COM`.
- The visitor's detected city and local time must dominate the first viewport.
- Homepage content is limited to local time, optional weather, search, compact city clocks, two utility links, and latest guides.
- Detailed calendars, maps, forecasts, and advanced controls stay off the homepage.
- Main body text is at least 16px; regular control labels are at least 14px.
- Mobile layouts must not cause horizontal page scrolling.
- Drafts, future scheduled posts, admin routes, and previews must not be indexed.
- Anonymous users may read published posts but may not mutate blog data.
- The site must still work when weather data fails.
- Production deployment must be verified before DNS changes.

---

## Planned file structure

```text
app/
  (public)/
    page.tsx                         # Simple local-time homepage
    world-clock/page.tsx             # Searchable city clocks
    converter/page.tsx               # Time-zone conversion tool
    meeting-planner/page.tsx         # Working-hour comparison
    blog/page.tsx                    # Published post index
    blog/[slug]/page.tsx             # Article and article metadata
  admin/
    login/page.tsx                   # Administrator sign-in
    page.tsx                         # Protected post list
    posts/new/page.tsx               # New-post editor
    posts/[id]/page.tsx              # Existing-post editor
  api/weather/route.ts               # Optional weather proxy
  feed.xml/route.ts                  # RSS output
  layout.tsx                         # Site metadata and shared shell
  robots.ts                          # Search crawler rules
  sitemap.ts                         # Public URL inventory
  globals.css                        # Theme tokens and global styling
components/
  site-header.tsx                    # Responsive public navigation
  local-time-hero.tsx                # Detected city and live clock
  city-search.tsx                    # Search and city selection
  city-clock-strip.tsx               # Popular or selected cities
  time-converter.tsx                 # Conversion form and results
  meeting-grid.tsx                   # Overlapping working-hour view
  blog/post-card.tsx                 # Public article summary
  admin/post-editor.tsx              # Blog content and SEO form
  admin/seo-preview.tsx              # Search-snippet guidance
lib/
  cities.ts                          # Curated IANA city catalog
  time.ts                            # Time-zone calculations
  weather.ts                         # Weather result adapter
  posts.ts                           # Public and admin post queries
  seo.ts                             # Metadata and JSON-LD builders
  supabase/client.ts                 # Browser Supabase client
  supabase/server.ts                 # Server Supabase client
  supabase/middleware.ts             # Session refresh helper
supabase/
  migrations/001_blog.sql            # Posts, profiles, policies, storage
tests/
  time.test.ts                       # Time-zone unit tests
  seo.test.ts                        # Metadata and publication tests
  components/local-time-hero.test.tsx
  components/time-converter.test.tsx
  e2e/public-site.spec.ts
  e2e/admin.spec.ts
middleware.ts                        # Admin session protection
public/favicon.svg                   # Site-specific globe/clock favicon
.env.example                         # Required local environment keys
.openai/hosting.json                 # Hosting metadata if Sites requires it
```

### Task 1: Bootstrap the tested Next.js application

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `public/favicon.svg`
- Create: `.env.example`
- Test: `tests/smoke.test.ts`

**Interfaces:**
- Produces: `npm run dev`, `npm run build`, `npm test`, and `npm run test:e2e` scripts used by all later tasks.

- [ ] **Step 1: Scaffold the application and testing dependencies**

Run the Sites portable project setup workflow, then add only the missing packages for Supabase, validation, Vitest, Testing Library, and Playwright. Keep the generated lockfile.

- [ ] **Step 2: Write the failing smoke test**

```ts
import { describe, expect, it } from "vitest";

describe("AWORLDTIME application", () => {
  it("uses the public brand name", () => {
    expect("AWORLDTIME.COM").toBe("AWORLDTIME.COM");
  });
});
```

- [ ] **Step 3: Add scripts and global metadata**

Set the root metadata title to `AWORLDTIME.COM` and description to `Local time, world clocks, time conversion, and practical guides.` Define the approved navy, cobalt, white, pale-sky, amber, and cool-gray tokens in `app/globals.css`. Add a simple globe-and-clock SVG favicon.

- [ ] **Step 4: Verify the foundation**

Run: `npm test -- --run tests/smoke.test.ts && npm run build`

Expected: the smoke test passes and Next.js produces a successful production build.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json vitest.config.ts playwright.config.ts app public .env.example tests/smoke.test.ts
git commit -m "chore: bootstrap AWORLDTIME application"
```

### Task 2: Build the time-zone domain layer

**Files:**
- Create: `lib/cities.ts`
- Create: `lib/time.ts`
- Test: `tests/time.test.ts`

**Interfaces:**
- Produces: `City`, `POPULAR_CITIES`, `findCity(query)`, `cityForTimeZone(timeZone)`, `formatTime(date, timeZone, includeSeconds)`, `formatDate(date, timeZone)`, and `convertWallTime(input)`.

- [ ] **Step 1: Write failing time-zone tests**

```ts
import { cityForTimeZone, convertWallTime, formatTime } from "@/lib/time";

it("maps the browser zone to a city", () => {
  expect(cityForTimeZone("Africa/Lagos")?.name).toBe("Lagos");
});

it("formats one instant in different zones", () => {
  const instant = new Date("2026-09-24T13:27:00Z");
  expect(formatTime(instant, "Africa/Lagos", false)).toBe("14:27");
  expect(formatTime(instant, "America/New_York", false)).toBe("09:27");
});

it("converts a Lagos wall time to New York", () => {
  expect(convertWallTime({ date: "2026-09-24", time: "14:27", from: "Africa/Lagos", to: "America/New_York" }).time).toBe("09:27");
});
```

- [ ] **Step 2: Run the tests and confirm failure**

Run: `npm test -- --run tests/time.test.ts`

Expected: FAIL because `lib/time.ts` does not exist.

- [ ] **Step 3: Implement the city catalog and time helpers**

Use IANA time-zone identifiers and `Intl.DateTimeFormat`. Include at least Lagos, London, New York, Dubai, Tokyo, Accra, Johannesburg, Nairobi, Cairo, Paris, Berlin, Toronto, Los Angeles, São Paulo, Delhi, Singapore, Beijing, Sydney, and Auckland. Keep display names and search aliases in `lib/cities.ts`.

- [ ] **Step 4: Run the domain tests**

Run: `npm test -- --run tests/time.test.ts`

Expected: all time tests pass, including date-boundary and daylight-saving cases added alongside the implementation.

- [ ] **Step 5: Commit**

```bash
git add lib/cities.ts lib/time.ts tests/time.test.ts
git commit -m "feat: add city and time-zone domain layer"
```

### Task 3: Build the responsive homepage

**Files:**
- Create: `app/(public)/page.tsx`
- Create: `components/site-header.tsx`
- Create: `components/local-time-hero.tsx`
- Create: `components/city-search.tsx`
- Create: `components/city-clock-strip.tsx`
- Create: `components/blog/post-card.tsx`
- Modify: `app/globals.css`
- Test: `tests/components/local-time-hero.test.tsx`

**Interfaces:**
- Consumes: time helpers and `City` from Task 2.
- Produces: `LocalTimeHero`, `CitySearch`, and `CityClockStrip` used by the homepage and world-clock page.

- [ ] **Step 1: Write the failing local-time test**

```tsx
import { render, screen } from "@testing-library/react";
import { LocalTimeHero } from "@/components/local-time-hero";

it("puts the detected city before secondary tools", () => {
  render(<LocalTimeHero initialTimeZone="Africa/Lagos" now={new Date("2026-09-24T13:27:00Z")} />);
  expect(screen.getByRole("heading", { name: "Lagos, Nigeria" })).toBeVisible();
  expect(screen.getByText("14:27")).toBeVisible();
});
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `npm test -- --run tests/components/local-time-hero.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the first meaningful homepage slice**

Render the compact header, detected local city, live clock, date, zone, optional weather slot, and city search. Use `Intl.DateTimeFormat().resolvedOptions().timeZone` after hydration, fall back to UTC, and save an explicit city choice in `localStorage` under `aworldtime:city`.

- [ ] **Step 4: Start the development server and show the first preview**

Run the Sites portable preview workflow. Confirm the page loads without a runtime error before opening the single user-facing preview.

- [ ] **Step 5: Complete the approved homepage**

Add the four compact city clocks, `Convert time` and `Plan a meeting` links, and latest-guide summaries. Keep advanced panels off the page. At widths below 640px, omit seconds, stack actions, and make city clocks horizontally scrollable within their own region.

- [ ] **Step 6: Verify component behavior**

Run: `npm test -- --run tests/components/local-time-hero.test.tsx`

Expected: the city and time assertions pass; fake timers confirm the clock updates without shifting layout.

- [ ] **Step 7: Commit**

```bash
git add app components tests/components/local-time-hero.test.tsx
git commit -m "feat: build local-time homepage"
```

### Task 4: Add weather as a non-blocking enhancement

**Files:**
- Create: `lib/weather.ts`
- Create: `app/api/weather/route.ts`
- Modify: `components/local-time-hero.tsx`
- Test: `tests/weather.test.ts`

**Interfaces:**
- Produces: `WeatherSummary` and `getWeatherSummary(latitude, longitude, signal)` returning `{ temperatureC, condition } | null`.

- [ ] **Step 1: Write failing adapter tests**

```ts
import { mapWeatherCode } from "@/lib/weather";

it("maps a clear-sky code", () => {
  expect(mapWeatherCode(0)).toBe("Clear");
});

it("returns a neutral label for an unknown code", () => {
  expect(mapWeatherCode(999)).toBe("Current conditions");
});
```

- [ ] **Step 2: Implement the weather adapter and route**

Use Open-Meteo's current-weather endpoint with numeric latitude and longitude validation, a short timeout, and `Cache-Control` suitable for a 15-minute summary. Return `204` on upstream failure so time rendering continues without weather.

- [ ] **Step 3: Verify graceful failure**

Run: `npm test -- --run tests/weather.test.ts`

Expected: mapping tests pass and a mocked upstream failure returns no weather data rather than throwing into the page.

- [ ] **Step 4: Commit**

```bash
git add lib/weather.ts app/api/weather/route.ts components/local-time-hero.tsx tests/weather.test.ts
git commit -m "feat: add optional local weather summary"
```

### Task 5: Build the world clock, converter, and meeting planner

**Files:**
- Create: `app/(public)/world-clock/page.tsx`
- Create: `app/(public)/converter/page.tsx`
- Create: `app/(public)/meeting-planner/page.tsx`
- Create: `components/time-converter.tsx`
- Create: `components/meeting-grid.tsx`
- Test: `tests/components/time-converter.test.tsx`

**Interfaces:**
- Consumes: `City`, `findCity`, and time helpers from Task 2.
- Produces: public tools linked from the homepage.

- [ ] **Step 1: Write a failing converter interaction test**

```tsx
it("shows the converted city time", async () => {
  render(<TimeConverter initialFrom="Africa/Lagos" initialTo="America/New_York" />);
  await userEvent.clear(screen.getByLabelText("Time"));
  await userEvent.type(screen.getByLabelText("Time"), "14:27");
  expect(await screen.findByText("09:27")).toBeVisible();
});
```

- [ ] **Step 2: Implement the three utility pages**

The world clock filters bundled cities. The converter accepts date, time, origin, and destination. The meeting planner shows a 24-hour comparison and emphasizes overlapping 09:00–17:00 local working hours without claiming that the highlighted time is available on anyone's calendar.

- [ ] **Step 3: Verify the public tools**

Run: `npm test -- --run tests/components/time-converter.test.tsx tests/time.test.ts`

Expected: conversion, date rollover, and daylight-saving tests pass.

- [ ] **Step 4: Commit**

```bash
git add app/'(public)' components/time-converter.tsx components/meeting-grid.tsx tests/components/time-converter.test.tsx
git commit -m "feat: add world time utilities"
```

### Task 6: Create the Supabase blog schema and access policies

**Files:**
- Create: `supabase/migrations/001_blog.sql`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/middleware.ts`
- Create: `middleware.ts`
- Modify: `.env.example`
- Test: `tests/seo.test.ts`

**Interfaces:**
- Produces: `Post`, `PostStatus`, authenticated server/client Supabase factories, and database policies consumed by Tasks 7 and 8.

- [ ] **Step 1: Define the migration**

Create `profiles` and `posts` tables. `posts` includes `id`, `title`, `slug`, `excerpt`, `content`, `category`, `featured_image_url`, `status`, `published_at`, `created_at`, `updated_at`, `seo_title`, `meta_description`, `canonical_url`, `og_title`, `og_description`, `og_image_url`, `noindex`, and `author_id`. Add unique slug and publication indexes.

- [ ] **Step 2: Add row-level security**

Anonymous and authenticated public reads must require `status = 'published'`, `published_at <= now()`, and `noindex` must not affect readability. Insert, update, and delete policies require an authenticated profile with `role = 'admin'`. Create a `blog-images` bucket with public reads and admin-only writes.

- [ ] **Step 3: Add authenticated Supabase clients and middleware**

Use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Refresh sessions in middleware and protect `/admin/:path*`, except `/admin/login`. Never expose the service-role key to browser code.

- [ ] **Step 4: Validate the migration locally or against the configured project**

Run the Supabase migration validation workflow. Query the catalog to confirm RLS is enabled on both tables and the four mutation policies require the admin role.

- [ ] **Step 5: Commit**

```bash
git add supabase lib/supabase middleware.ts .env.example
git commit -m "feat: add secure blog data model"
```

### Task 7: Build public blog pages and SEO outputs

**Files:**
- Create: `lib/posts.ts`
- Create: `lib/seo.ts`
- Create: `app/(public)/blog/page.tsx`
- Create: `app/(public)/blog/[slug]/page.tsx`
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `app/feed.xml/route.ts`
- Modify: `components/blog/post-card.tsx`
- Test: `tests/seo.test.ts`

**Interfaces:**
- Produces: `listPublishedPosts()`, `getPublishedPost(slug)`, `buildPostMetadata(post)`, and `buildArticleJsonLd(post)`.

- [ ] **Step 1: Write failing publication and metadata tests**

```ts
it("excludes future scheduled posts", () => {
  const post = fixturePost({ status: "scheduled", published_at: "2099-01-01T00:00:00Z" });
  expect(isPublicPost(post, new Date("2026-09-24T00:00:00Z"))).toBe(false);
});

it("uses the SEO title when present", () => {
  const post = fixturePost({ title: "Article", seo_title: "Search title" });
  expect(buildPostMetadata(post).title).toBe("Search title");
});
```

- [ ] **Step 2: Implement public post queries and routes**

Render only published posts whose `published_at` is not in the future. Return `notFound()` for drafts, future posts, and missing slugs. Sanitize or render the chosen structured content format without allowing arbitrary script execution.

- [ ] **Step 3: Add search outputs**

Generate page metadata, canonical links, Article and BreadcrumbList JSON-LD, `sitemap.xml`, `robots.txt`, and RSS. Exclude admin and preview URLs. Use `https://aworldtime.com` as the production canonical origin through one environment-backed helper that falls back to the same origin.

- [ ] **Step 4: Verify SEO behavior**

Run: `npm test -- --run tests/seo.test.ts`

Expected: draft and future-post tests pass; metadata, canonical URL, JSON-LD, sitemap filtering, and RSS escaping assertions pass.

- [ ] **Step 5: Commit**

```bash
git add lib/posts.ts lib/seo.ts app/'(public)'/blog app/sitemap.ts app/robots.ts app/feed.xml components/blog/post-card.tsx tests/seo.test.ts
git commit -m "feat: add public SEO blog"
```

### Task 8: Build the private blog admin

**Files:**
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/actions.ts`
- Create: `app/admin/page.tsx`
- Create: `app/admin/posts/new/page.tsx`
- Create: `app/admin/posts/[id]/page.tsx`
- Create: `components/admin/post-editor.tsx`
- Create: `components/admin/seo-preview.tsx`
- Test: `tests/admin-actions.test.ts`

**Interfaces:**
- Consumes: Supabase clients and `Post` from Task 6.
- Produces: `signIn`, `signOut`, `savePost`, `deletePost`, and `uploadFeaturedImage` server actions.

- [ ] **Step 1: Write failing validation tests**

```ts
it("rejects a post without a title", () => {
  const result = postSchema.safeParse({ title: "", slug: "missing-title", content: "Body" });
  expect(result.success).toBe(false);
});

it("normalizes a safe slug", () => {
  expect(normalizeSlug("  Meeting Across Time Zones ")).toBe("meeting-across-time-zones");
});
```

- [ ] **Step 2: Implement authentication and protected post listing**

The login form uses email and password. The protected admin home lists title, status, publish date, and edit action. Failed login text says `Email or password is incorrect.` without exposing account existence.

- [ ] **Step 3: Implement the editor and server actions**

Use Zod validation. Support title, slug, excerpt, category, content, image upload, status, schedule, and all specified SEO fields. The preview shows a search-title and description approximation and states that truncation depends on the search engine and device. Revalidate affected public paths after a successful write.

- [ ] **Step 4: Verify admin validation and authorization**

Run: `npm test -- --run tests/admin-actions.test.ts`

Expected: validation tests pass; mocked anonymous mutations are rejected; authenticated admin create, update, schedule, publish, and delete actions succeed.

- [ ] **Step 5: Commit**

```bash
git add app/admin components/admin tests/admin-actions.test.ts
git commit -m "feat: add private SEO blog admin"
```

### Task 9: Run full browser and accessibility verification

**Files:**
- Create: `tests/e2e/public-site.spec.ts`
- Create: `tests/e2e/admin.spec.ts`
- Modify: implementation files only for failures found by these tests.

**Interfaces:**
- Consumes: all public and admin routes.
- Produces: verified desktop, mobile, keyboard, and authenticated workflows.

- [ ] **Step 1: Add public browser tests**

```ts
test("mobile homepage starts with local time", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Lagos|UTC/ })).toBeVisible();
  await expect(page.getByPlaceholder("Search any city or time zone")).toBeVisible();
});
```

Add checks for converter output, keyboard focus, no horizontal document overflow, blog metadata, and a 404 for a future post.

- [ ] **Step 2: Add authenticated admin browser tests**

Use a dedicated test-admin account supplied through test-only environment variables. Verify login, draft creation, scheduling, preview, publication, edit, and deletion. Delete the test post during cleanup.

- [ ] **Step 3: Run the complete verification suite**

Run: `npm test -- --run && npm run test:e2e && npm run build`

Expected: all unit, component, and browser tests pass and the production build succeeds.

- [ ] **Step 4: Inspect responsive screenshots**

Capture the homepage at 390×844 and 1440×1000. Confirm the local time is dominant, controls remain readable, no approved homepage exclusions returned, and the mobile page has no horizontal document scroll.

- [ ] **Step 5: Commit**

```bash
git add tests app components lib
git commit -m "test: verify AWORLDTIME user journeys"
```

### Task 10: Push, deploy, and prepare verified DNS records

**Files:**
- Create or modify: `.openai/hosting.json` only if required by the selected hosting workflow.
- Modify: `README.md` with setup, environment, admin bootstrap, deployment, and DNS notes.

**Interfaces:**
- Consumes: passing production build and configured Supabase project.
- Produces: GitHub repository URL, verified Vercel deployment URL, and exact domain records for `aworldtime.com` and `www.aworldtime.com`.

- [ ] **Step 1: Document configuration without secrets**

List `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, and test-only variables. Explain how the first approved account receives the `admin` profile role. Do not commit `.env.local` or credentials.

- [ ] **Step 2: Create and push the GitHub repository**

Create the private or public repository named `aworldtime` according to the user's GitHub choice, set it as `origin`, push `main`, and confirm the remote commit matches local `HEAD`.

- [ ] **Step 3: Configure and deploy on Vercel**

Connect the GitHub repository, add the Supabase environment variables to Preview and Production, deploy, and wait for a terminal Ready state. Run browser checks against the production URL.

- [ ] **Step 4: Add the production domain and read Vercel's required records**

Add `aworldtime.com` and `www.aworldtime.com` to the verified project. Record the exact apex and `www` values Vercel returns. Inspect existing DNS before asking the user to replace or remove conflicting records.

- [ ] **Step 5: Give the user the DNS handoff**

Provide a small table with record type, host, exact value, TTL guidance, and conflicting record notes. Do not claim the custom domain works until Vercel reports valid configuration and HTTPS loads successfully.

- [ ] **Step 6: Commit final documentation**

```bash
git add README.md .openai/hosting.json
git commit -m "docs: add deployment and domain setup"
git push origin main
```
