# AWORLDTIME Global SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every public AWORLDTIME page correct global search metadata, structured data, crawl controls, and a canonical `www` sitemap.

**Architecture:** Centralize canonical URL and reusable metadata/JSON-LD builders in `lib/seo.ts`. Route files remain responsible for their own search copy, while `robots.ts` and `sitemap.ts` consume the same canonical origin. Tests exercise returned metadata objects and generated route documents before live deployment checks inspect rendered HTML.

**Tech Stack:** Next.js 16 App Router metadata APIs, TypeScript, React JSON-LD script tags, Vitest, Vercel

**Spec:** `docs/superpowers/specs/2026-09-25-global-seo-design.md`

## Global Constraints

- The canonical origin is exactly `https://www.aworldtime.com`.
- Public routes are `/`, `/world-clock`, `/converter`, `/meeting-planner`, `/blog`, and published `/blog/[slug]` pages.
- Private `/admin` routes remain `noindex, nofollow` and never appear in the sitemap.
- Do not add generated city landing pages in this pass.
- Preserve externally supplied article canonical URLs.
- Escape `<` before inserting JSON-LD into HTML.
- Sitemap dates for static routes must be stable and article dates must use `updated_at`.

---

### Task 1: Canonical metadata foundation

**Files:**
- Modify: `site/lib/seo.ts`
- Modify: `site/app/layout.tsx`
- Create: `site/tests/seo.test.ts`
- Modify: `site/tests/metadata.test.ts`

**Interfaces:**
- Produces: `SITE_ORIGIN`, `absoluteUrl(path: string): string`, `buildPageMetadata(input: PageMetadataInput): Metadata`, `buildWebsiteJsonLd(): object`, and `serializeJsonLd(value: object): string`.
- Consumes: Next.js `Metadata` and the existing `Post` type.

- [ ] **Step 1: Write failing tests for the canonical origin and shared page metadata**

```ts
expect(SITE_ORIGIN).toBe("https://www.aworldtime.com");
expect(absoluteUrl("/converter")).toBe("https://www.aworldtime.com/converter");
expect(buildPageMetadata({
  title: "Time Zone Converter",
  description: "Convert a date and time between cities and time zones.",
  path: "/converter",
})).toMatchObject({
  alternates: { canonical: "https://www.aworldtime.com/converter" },
  openGraph: { url: "https://www.aworldtime.com/converter" },
  twitter: { card: "summary_large_image" },
});
```

- [ ] **Step 2: Run the focused tests and confirm they fail because the new helpers do not exist**

Run: `cd site && npm test -- --run tests/seo.test.ts tests/metadata.test.ts`

- [ ] **Step 3: Implement the canonical helpers and root defaults**

Define `SITE_ORIGIN` as the fixed production `www` origin, normalize paths in `absoluteUrl`, and have `buildPageMetadata` return the route title, description, canonical, Open Graph URL/title/description/site name, and `summary_large_image` X/Twitter metadata. Add `metadataBase`, title template, application name, RSS alternate, and matching root social defaults to `app/layout.tsx` while preserving Google verification and Analytics.

- [ ] **Step 4: Add safe homepage JSON-LD**

`buildWebsiteJsonLd()` must return an `@graph` containing `WebSite` and `Organization` nodes tied to `https://www.aworldtime.com/#website` and `https://www.aworldtime.com/#organization`. Render it once in the root layout through `serializeJsonLd`, which uses `JSON.stringify(value).replaceAll("<", "\\u003c")`.

- [ ] **Step 5: Run focused tests**

Run: `cd site && npm test -- --run tests/seo.test.ts tests/metadata.test.ts`
Expected: both files pass.

- [ ] **Step 6: Commit the foundation**

```bash
git add site/lib/seo.ts site/app/layout.tsx site/tests/seo.test.ts site/tests/metadata.test.ts
git commit -m "Add canonical SEO foundation"
```

### Task 2: Unique metadata and structured data for public tools

**Files:**
- Modify: `site/app/page.tsx`
- Modify: `site/app/world-clock/page.tsx`
- Modify: `site/app/converter/page.tsx`
- Modify: `site/app/meeting-planner/page.tsx`
- Modify: `site/app/blog/page.tsx`
- Modify: `site/lib/seo.ts`
- Create: `site/tests/page-metadata.test.ts`

**Interfaces:**
- Consumes: `buildPageMetadata` and `serializeJsonLd` from Task 1.
- Produces: `buildWebApplicationJsonLd(name: string, description: string, path: string): object`.

- [ ] **Step 1: Write failing route metadata tests**

Import each route's `metadata` export and assert a unique title, description, self-referencing canonical, matching Open Graph URL, and Twitter card. Assert the homepage title describes the product instead of returning only `AWORLDTIME.COM`.

- [ ] **Step 2: Run the route metadata tests and confirm canonical assertions fail**

Run: `cd site && npm test -- --run tests/page-metadata.test.ts`

- [ ] **Step 3: Replace each route's metadata object with `buildPageMetadata`**

Use direct global wording:

- `/`: `World Clock, Time Zone Converter & Meeting Planner`
- `/world-clock`: `World Clock: Current Time Around the World`
- `/converter`: `Time Zone Converter: Compare Times Worldwide`
- `/meeting-planner`: `World Meeting Planner Across Time Zones`
- `/blog`: `Time Zone, Travel and Meeting Guides`

Descriptions must explain the page's working tool or content in one sentence without claims the page cannot support.

- [ ] **Step 4: Add `WebApplication` JSON-LD to tool routes**

`buildWebApplicationJsonLd` returns `@type: "WebApplication"`, `applicationCategory: "UtilitiesApplication"`, `operatingSystem: "Any"`, `isAccessibleForFree: true`, the supplied name and description, and the canonical URL. Render it on `/world-clock`, `/converter`, and `/meeting-planner` with safe serialization.

- [ ] **Step 5: Run route metadata tests**

Run: `cd site && npm test -- --run tests/page-metadata.test.ts tests/seo.test.ts`
Expected: both files pass.

- [ ] **Step 6: Commit public route SEO**

```bash
git add site/app/page.tsx site/app/world-clock/page.tsx site/app/converter/page.tsx site/app/meeting-planner/page.tsx site/app/blog/page.tsx site/lib/seo.ts site/tests/page-metadata.test.ts site/tests/seo.test.ts
git commit -m "Add public page SEO metadata"
```

### Task 3: Blog metadata and article schema

**Files:**
- Modify: `site/lib/seo.ts`
- Modify: `site/app/blog/[slug]/page.tsx`
- Modify: `site/tests/seo.test.ts`

**Interfaces:**
- Consumes: `Post`, `SITE_ORIGIN`, `postUrl`, and `serializeJsonLd`.
- Produces: complete `buildPostMetadata(post: Post): Metadata` and `buildArticleJsonLd(post: Post): object` output.

- [ ] **Step 1: Add failing article tests**

Using `fixturePost`, assert the default article canonical uses the `www` origin, an external `canonical_url` is preserved, `noindex` changes robots to `index: false, follow: false`, Open Graph uses `article`, Twitter metadata uses the article image when present, and Article JSON-LD includes canonical URL and publisher identity.

- [ ] **Step 2: Run the tests and confirm the missing Twitter and canonical expectations fail**

Run: `cd site && npm test -- --run tests/seo.test.ts`

- [ ] **Step 3: Complete article metadata and reuse safe serialization**

Add X/Twitter title, description, card, and optional image. Keep external canonicals intact. Replace the route's local `JSON.stringify(...).replaceAll(...)` with `serializeJsonLd(buildArticleJsonLd(post))`.

- [ ] **Step 4: Run article tests**

Run: `cd site && npm test -- --run tests/seo.test.ts`
Expected: pass.

- [ ] **Step 5: Commit article SEO**

```bash
git add 'site/app/blog/[slug]/page.tsx' site/lib/seo.ts site/tests/seo.test.ts
git commit -m "Complete article search metadata"
```

### Task 4: Correct robots and sitemap output

**Files:**
- Modify: `site/app/robots.ts`
- Modify: `site/app/sitemap.ts`
- Create: `site/tests/search-indexing.test.ts`

**Interfaces:**
- Consumes: `SITE_ORIGIN` and `listPublishedPosts()`.
- Produces: Next.js `MetadataRoute.Robots` and `MetadataRoute.Sitemap` values.

- [ ] **Step 1: Write failing indexing tests**

Assert robots uses `https://www.aworldtime.com/sitemap.xml`, blocks `/admin/` and `/preview/`, and reports the `www` host. Assert every static sitemap entry begins with `https://www.aworldtime.com`, carries a stable date literal, and excludes `/admin`. Mock `listPublishedPosts` with one indexable and one `noindex` post, then assert only the indexable article appears with its `updated_at` date.

- [ ] **Step 2: Run the indexing test and confirm the origin and date assertions fail**

Run: `cd site && npm test -- --run tests/search-indexing.test.ts`

- [ ] **Step 3: Correct robots and sitemap generation**

Use `SITE_ORIGIN` for host and sitemap. Define a stable `STATIC_LAST_MODIFIED = new Date("2026-09-25T00:00:00.000Z")` for this release rather than `new Date()` during every request. Keep published article `updated_at` dates and the existing `noindex` filter.

- [ ] **Step 4: Run indexing tests**

Run: `cd site && npm test -- --run tests/search-indexing.test.ts`
Expected: pass.

- [ ] **Step 5: Commit crawl controls**

```bash
git add site/app/robots.ts site/app/sitemap.ts site/tests/search-indexing.test.ts
git commit -m "Correct sitemap and crawl controls"
```

### Task 5: Full verification and deployment

**Files:**
- Verify: all changed source and test files

**Interfaces:**
- Consumes: the completed implementation from Tasks 1–4.
- Produces: a deployed site whose live HTML and crawl documents match the spec.

- [ ] **Step 1: Run the complete local checks**

```bash
cd site
npm test -- --run
npm run lint
npm run build -- --webpack
```

Expected: all tests pass, lint has zero errors and warnings, and the production build exits zero. The known local Node 20 deprecation notice is environmental; Vercel uses the repository's declared Node 22 minimum.

- [ ] **Step 2: Review the final diff and commit any verification-only adjustments**

Run: `git diff --check && git status --short`

- [ ] **Step 3: Push `main` to GitHub**

Run: `git push origin main`

- [ ] **Step 4: Verify the live deployment**

For `/`, `/world-clock`, `/converter`, `/meeting-planner`, and `/blog`, inspect the live HTML for unique title, description, canonical, Open Graph URL, Twitter card, and expected JSON-LD. Confirm `/robots.txt` points to the `www` sitemap and blocks admin paths. Confirm `/sitemap.xml` contains only canonical public URLs and no admin routes.

- [ ] **Step 5: Submit the final sitemap location**

Report `https://www.aworldtime.com/sitemap.xml` to the user for Google Search Console submission.
