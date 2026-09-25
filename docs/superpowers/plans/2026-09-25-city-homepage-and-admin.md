# City Homepage and Private Markdown Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Match the approved AWORLDTIME visual reference with city-specific skyline art and six responsive city clocks, then provide the owner with a private Markdown publishing dashboard and complete SEO controls.

**Architecture:** Keep the existing Next.js App Router and Supabase data model. City presentation data will live beside the city catalogue, while optimized skyline images remain static assets selected by the local-time hero. The editor will store sanitized Markdown source in `posts.content`, render it through one shared Markdown component, and use authenticated server actions plus a small autosave endpoint for owner-only publishing.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Supabase Auth/Postgres/Storage, `react-markdown`, `remark-gfm`, `rehype-sanitize`, Vitest, Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-25-city-homepage-and-admin-design.md`

## Global Constraints

- Preserve the current rounded interface font stack and clock-number treatment.
- Use `/Users/mac/Downloads/ChatGPT Image Sep 25, 2026, 01_28_37 AM.png` as the visual source of truth.
- Blue is the primary accent; yellow is limited to weather and meeting-planner details.
- The six city cards are London, New York, Dubai, Tokyo, Toronto, and Beijing.
- Mobile uses two rows of three cards without horizontal scrolling.
- The admin supports one owner account and exposes no public registration.
- Store Markdown source, sanitize rendered output, and preserve existing article data.
- Do not connect the custom domain until the redesigned production deployment and admin flow pass verification.

---

### Task 1: Add the Markdown rendering foundation

**Files:**
- Modify: `site/package.json`
- Modify: `site/package-lock.json`
- Create: `site/components/blog/markdown-article.tsx`
- Create: `site/tests/components/markdown-article.test.tsx`

**Interfaces:**
- Consumes: Markdown text from `Post.content`.
- Produces: `MarkdownArticle({ content, className? }: { content: string; className?: string })` for public articles and admin previews.

- [ ] **Step 1: Write the failing sanitization and GFM tests**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarkdownArticle } from "@/components/blog/markdown-article";

describe("MarkdownArticle", () => {
  it("renders headings, links, lists, and tables", () => {
    render(<MarkdownArticle content={'## Lagos time\n\n- WAT\n\n| City | Time |\n| --- | --- |\n| Lagos | 14:27 |'} />);
    expect(screen.getByRole("heading", { name: "Lagos time" })).toBeVisible();
    expect(screen.getByText("WAT")).toBeVisible();
    expect(screen.getByRole("table")).toBeVisible();
  });

  it("does not render unsafe script content", () => {
    const { container } = render(<MarkdownArticle content={'<script>alert("x")</script>Safe'} />);
    expect(container.querySelector("script")).toBeNull();
    expect(screen.getByText(/Safe/)).toBeVisible();
  });
});
```

- [ ] **Step 2: Run the targeted test and verify it fails because the component does not exist**

Run: `cd site && npm test -- --run tests/components/markdown-article.test.tsx`

- [ ] **Step 3: Install the renderer packages**

Run: `cd site && npm install react-markdown remark-gfm rehype-sanitize`

- [ ] **Step 4: Implement the shared renderer**

```tsx
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export function MarkdownArticle({ content, className = "markdown-article" }: { content: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 5: Run the targeted test and full suite**

Run: `cd site && npm test -- --run tests/components/markdown-article.test.tsx && npm test -- --run`

- [ ] **Step 6: Commit**

```bash
git add site/package.json site/package-lock.json site/components/blog/markdown-article.tsx site/tests/components/markdown-article.test.tsx
git commit -m "feat: add safe markdown rendering"
```

### Task 2: Define skyline and popular-city presentation data

**Files:**
- Modify: `site/lib/cities.ts`
- Create: `site/tests/city-presentation.test.ts`
- Create: `site/public/cities/fallback.webp`
- Create: `site/public/cities/lagos.webp`
- Create: `site/public/cities/london.webp`
- Create: `site/public/cities/new-york.webp`
- Create: `site/public/cities/dubai.webp`
- Create: `site/public/cities/tokyo.webp`
- Create: `site/public/cities/accra.webp`
- Create: `site/public/cities/johannesburg.webp`
- Create: `site/public/cities/nairobi.webp`
- Create: `site/public/cities/cairo.webp`
- Create: `site/public/cities/paris.webp`
- Create: `site/public/cities/berlin.webp`
- Create: `site/public/cities/toronto.webp`
- Create: `site/public/cities/los-angeles.webp`
- Create: `site/public/cities/sao-paulo.webp`
- Create: `site/public/cities/delhi.webp`
- Create: `site/public/cities/singapore.webp`
- Create: `site/public/cities/beijing.webp`
- Create: `site/public/cities/sydney.webp`
- Create: `site/public/cities/auckland.webp`

**Interfaces:**
- Consumes: Existing `City` catalogue and approved visual reference.
- Produces: `City.skylineImage: string`, `POPULAR_CITIES` in the approved six-city order, and `skylineForCity(city?: City): string`.

- [ ] **Step 1: Write the failing catalogue tests**

```ts
import { CITIES, POPULAR_CITIES, skylineForCity } from "@/lib/cities";

it("gives every catalogue city a skyline", () => {
  expect(CITIES).toHaveLength(19);
  expect(CITIES.every((city) => city.skylineImage.startsWith("/cities/"))).toBe(true);
});

it("uses the approved six popular cities", () => {
  expect(POPULAR_CITIES.map((city) => city.name)).toEqual(["London", "New York", "Dubai", "Tokyo", "Toronto", "Beijing"]);
});

it("falls back when no catalogue city is available", () => {
  expect(skylineForCity()).toBe("/cities/fallback.webp");
});
```

- [ ] **Step 2: Run the test and verify the missing `skylineImage` failure**

Run: `cd site && npm test -- --run tests/city-presentation.test.ts`

- [ ] **Step 3: Generate the 20 approved skyline assets**

Use the image generation skill with the supplied reference image. Keep a fixed wide composition, white-to-pale-blue sky, low blue skyline along the bottom 28 percent, city-specific landmarks, sparse clouds, and no text, flags, clocks, people, logos, or UI. Export WebP assets at 1600×520 with each file below 220 KB where visual quality permits.

- [ ] **Step 4: Add skyline metadata and helper**

```ts
export type City = {
  // existing fields
  skylineImage: string;
};

export const POPULAR_CITIES = [
  "Europe/London",
  "America/New_York",
  "Asia/Dubai",
  "Asia/Tokyo",
  "America/Toronto",
  "Asia/Shanghai",
].map((timeZone) => CITIES.find((city) => city.timeZone === timeZone)).filter((city): city is City => Boolean(city));

export function skylineForCity(city?: City) {
  return city?.skylineImage ?? "/cities/fallback.webp";
}
```

- [ ] **Step 5: Run the city tests and verify every asset path exists**

Run: `cd site && npm test -- --run tests/city-presentation.test.ts && for f in public/cities/*.webp; do test -s "$f" || exit 1; done`

- [ ] **Step 6: Commit**

```bash
git add site/lib/cities.ts site/tests/city-presentation.test.ts site/public/cities
git commit -m "feat: add city skyline artwork"
```

### Task 3: Rebuild the local-time hero from the approved reference

**Files:**
- Modify: `site/components/local-time-hero.tsx`
- Modify: `site/components/city-search.tsx`
- Modify: `site/app/globals.css`
- Modify: `site/tests/components/local-time-hero.test.tsx`

**Interfaces:**
- Consumes: `skylineForCity`, current city selection, weather, and live clock.
- Produces: Reference-matched hero with `data-testid="city-skyline"` and a blue search action.

- [ ] **Step 1: Extend the hero test before editing the component**

```tsx
expect(screen.getByTestId("city-skyline")).toHaveStyle({ backgroundImage: 'url("/cities/lagos.webp")' });
expect(screen.getByRole("img", { name: "Nigeria flag" })).toHaveClass("hero-country-flag");
expect(screen.getByRole("button", { name: "Search cities" })).toBeVisible();
```

- [ ] **Step 2: Run the focused test and verify the new assertions fail**

Run: `cd site && npm test -- --run tests/components/local-time-hero.test.tsx`

- [ ] **Step 3: Restructure the hero without changing the clock font**

Add a decorative skyline layer, centered desktop content, left-aligned mobile content, large round flag, weather row, and the blue search button. Keep the existing `local-clock` font declarations and synchronization code unchanged.

- [ ] **Step 4: Replace conflicting duplicate mobile rules**

Consolidate the two `@media (max-width: 760px)` sections that control the hero and city cards. Retain the approved palette tokens and remove abstract orbit decorations that conflict with the skyline reference.

- [ ] **Step 5: Run focused tests and capture desktop and 390-pixel local screenshots**

Run: `cd site && npm test -- --run tests/components/local-time-hero.test.tsx`

Verify: city name, round flag, full desktop clock, mobile clock, date, zone, weather, skyline, and search button remain visible without overlap.

- [ ] **Step 6: Commit**

```bash
git add site/components/local-time-hero.tsx site/components/city-search.tsx site/app/globals.css site/tests/components/local-time-hero.test.tsx
git commit -m "feat: match the approved local-time hero"
```

### Task 4: Build the six-card city clock grid

**Files:**
- Modify: `site/components/city-clock-strip.tsx`
- Modify: `site/app/globals.css`
- Create: `site/tests/components/city-clock-strip.test.tsx`

**Interfaces:**
- Consumes: Approved `POPULAR_CITIES`, `formatTime`, `timeZoneName`, and country flag helper.
- Produces: Six complete city cards in one desktop row and two mobile rows.

- [ ] **Step 1: Write the failing six-city test**

```tsx
render(<CityClockStrip initialNow="2026-09-24T13:27:00.000Z" />);
expect(screen.getAllByRole("article")).toHaveLength(6);
for (const city of ["London", "New York", "Dubai", "Tokyo", "Toronto", "Beijing"]) {
  expect(screen.getByText(city)).toBeVisible();
}
```

- [ ] **Step 2: Run the test and verify it fails at four cards**

Run: `cd site && npm test -- --run tests/components/city-clock-strip.test.tsx`

- [ ] **Step 3: Remove the JavaScript viewport workaround and use one CSS grid**

Desktop rule: `grid-template-columns: repeat(6, minmax(0, 1fr))`.

Mobile rule: `grid-template-columns: repeat(3, minmax(0, 1fr))`.

Cards must use large circular flags, tabular times, short zone labels, ellipsis only for secondary labels, and no horizontal overflow.

- [ ] **Step 4: Run the component test and responsive browser check**

At 390 pixels, assert the first-row card rectangles remain within `0 <= left` and `right <= 390`, with Dubai visible and document overflow equal to zero.

- [ ] **Step 5: Commit**

```bash
git add site/components/city-clock-strip.tsx site/app/globals.css site/tests/components/city-clock-strip.test.tsx
git commit -m "feat: show six responsive city clocks"
```

### Task 5: Match the remaining homepage sections and real latest guides

**Files:**
- Modify: `site/app/page.tsx`
- Modify: `site/components/blog/post-card.tsx`
- Modify: `site/lib/posts.ts`
- Modify: `site/app/globals.css`
- Create: `site/tests/homepage-content.test.ts`

**Interfaces:**
- Consumes: `listPublishedPosts()`.
- Produces: Reference-matched quick actions and the latest two live articles instead of hard-coded guide records.

- [ ] **Step 1: Add a failing homepage data test**

```ts
import { describe, expect, it } from "vitest";
import { selectLatestGuides } from "@/lib/posts";

describe("selectLatestGuides", () => {
  it("returns the two newest published posts", () => {
    const guides = selectLatestGuides([
      fixturePost({ slug: "older", status: "published", published_at: "2026-09-20T10:00:00Z" }),
      fixturePost({ slug: "draft", status: "draft", published_at: null }),
      fixturePost({ slug: "newest", status: "published", published_at: "2026-09-24T10:00:00Z" }),
      fixturePost({ slug: "middle", status: "published", published_at: "2026-09-22T10:00:00Z" }),
    ]);

    expect(guides.map((post) => post.slug)).toEqual(["newest", "middle"]);
  });
});
```

Also keep smoke assertions for links to `/converter` and `/meeting-planner`.

- [ ] **Step 2: Change `Home` to an async server component**

```tsx
export default async function Home() {
  const guides = selectLatestGuides(await listPublishedPosts());
  // render existing time controls plus guides
}
```

`selectLatestGuides` filters to currently published records, sorts by `published_at` descending, and returns two posts.

- [ ] **Step 3: Match the mockup's wide action rows and image-led article cards**

Use blue for converter, reserve yellow for meeting planner, and render featured images with a neutral city/travel fallback when an article has none.

- [ ] **Step 4: Run smoke tests and visual checks**

Run: `cd site && npm test -- --run tests/homepage-content.test.ts tests/smoke.test.ts && npm run lint`

- [ ] **Step 5: Commit**

```bash
git add site/app/page.tsx site/components/blog/post-card.tsx site/lib/posts.ts site/app/globals.css site/tests/homepage-content.test.ts site/tests/smoke.test.ts
git commit -m "feat: complete the reference-matched homepage"
```

### Task 6: Extend the post schema for image accessibility

**Files:**
- Create: `site/supabase/migrations/20260925013000_markdown_editor.sql`
- Modify: `site/lib/posts.ts`
- Modify: `site/lib/post-validation.ts`
- Modify: `site/tests/admin-actions.test.ts`

**Interfaces:**
- Consumes: Existing `posts` rows.
- Produces: Nullable `featured_image_alt`, preserved Markdown `content`, and validation for accessible featured images.

- [ ] **Step 1: Add failing validation tests**

```ts
it("requires alt text when a featured image URL exists", () => {
  const result = postSchema.safeParse({ ...validPost, featured_image_url: "https://example.com/lagos.webp", featured_image_alt: "" });
  expect(result.success).toBe(false);
});
```

- [ ] **Step 2: Add the backwards-compatible migration**

```sql
alter table public.posts
add column if not exists featured_image_alt text;

comment on column public.posts.content is 'Sanitized Markdown source rendered by the application';
```

- [ ] **Step 3: Extend `Post` and `postSchema`**

Add `featured_image_alt: string | null` and validate it only when an existing or newly uploaded featured image is present.

- [ ] **Step 4: Run validation and SEO tests**

Run: `cd site && npm test -- --run tests/admin-actions.test.ts tests/seo.test.ts`

- [ ] **Step 5: Apply the migration to the linked Supabase project after reviewing the diff**

Run: `cd site && npx supabase db push --linked`

- [ ] **Step 6: Commit**

```bash
git add site/supabase/migrations/20260925013000_markdown_editor.sql site/lib/posts.ts site/lib/post-validation.ts site/tests/admin-actions.test.ts
git commit -m "feat: extend posts for markdown publishing"
```

### Task 7: Build the client Markdown editor

**Files:**
- Replace: `site/components/admin/post-editor.tsx`
- Create: `site/components/admin/markdown-toolbar.tsx`
- Create: `site/components/admin/editor-preview.tsx`
- Create: `site/lib/markdown-editing.ts`
- Create: `site/tests/components/post-editor.test.tsx`
- Create: `site/tests/markdown-editing.test.ts`
- Modify: `site/app/globals.css`

**Interfaces:**
- Consumes: Optional `Post`, `savePost`, and `MarkdownArticle`.
- Produces: `PostEditor` with controlled fields, toolbar insertion, live preview, dirty state, and save status.

- [ ] **Step 1: Test Markdown insertion helpers**

```ts
expect(wrapSelection("Lagos", 0, 5, "**", "**")).toEqual({ value: "**Lagos**", selectionStart: 2, selectionEnd: 7 });
expect(prefixLines("Lagos\nLondon", 0, 12, "- ").value).toBe("- Lagos\n- London");
```

- [ ] **Step 2: Test the editor interactions**

Test automatic slug suggestion, manual slug preservation, bold toolbar insertion, preview switching, dirty-state warning, image-alt input, and save-state text.

- [ ] **Step 3: Implement focused Markdown helpers**

Export `wrapSelection`, `prefixLines`, `insertLink`, `insertTable`, and `insertImageMarkdown` from `site/lib/markdown-editing.ts`.

- [ ] **Step 4: Implement the controlled editor**

Desktop displays editor and preview side by side. Mobile uses Write and Preview tabs. The toolbar must use buttons with accessible names and insert syntax at the textarea selection.

- [ ] **Step 5: Add unsaved-change protection**

Register `beforeunload` only while dirty and remove it after a successful save. Do not block ordinary navigation after saving.

- [ ] **Step 6: Run editor tests**

Run: `cd site && npm test -- --run tests/markdown-editing.test.ts tests/components/post-editor.test.tsx`

- [ ] **Step 7: Commit**

```bash
git add site/components/admin/post-editor.tsx site/components/admin/markdown-toolbar.tsx site/components/admin/editor-preview.tsx site/lib/markdown-editing.ts site/tests/components/post-editor.test.tsx site/tests/markdown-editing.test.ts site/app/globals.css
git commit -m "feat: add the private markdown editor"
```

### Task 8: Add authenticated image insertion and draft autosave

**Files:**
- Modify: `site/app/admin/actions.ts`
- Create: `site/app/api/admin/posts/[id]/autosave/route.ts`
- Create: `site/app/api/admin/images/route.ts`
- Create: `site/lib/admin-auth.ts`
- Create: `site/tests/admin-auth.test.ts`
- Create: `site/tests/admin-api.test.ts`

**Interfaces:**
- Consumes: Supabase session and admin profile.
- Produces: `requireAdmin()` shared guard, `POST /api/admin/images`, and `PATCH /api/admin/posts/:id/autosave`.

- [ ] **Step 1: Move and test the authorization guard**

`requireAdmin()` returns `{ supabase, userId }` only when claims contain a user and the profile role is `admin`. Missing sessions return 401 in route handlers and redirect from server pages/actions.

- [ ] **Step 2: Write failing API tests**

Cover unauthorized requests, unsupported image MIME types, files above 5 MB, successful public URL response, draft-only autosave, and attempted autosave of a published record.

- [ ] **Step 3: Implement the image route**

Accept PNG, JPEG, and WebP. Store under `${userId}/${crypto.randomUUID()}.${extension}` in `blog-images`. Return `{ url, markdown: '![alt text](url)' }`.

- [ ] **Step 4: Implement autosave**

Accept `{ title, slug, excerpt, content, category }`, validate the partial draft, update only a post owned by the admin, and return `{ savedAt: updated_at }`. Debounce client requests by 1.5 seconds and never autosave publication status.

- [ ] **Step 5: Run API tests**

Run: `cd site && npm test -- --run tests/admin-auth.test.ts tests/admin-api.test.ts`

- [ ] **Step 6: Commit**

```bash
git add site/app/admin/actions.ts site/app/api/admin/posts site/app/api/admin/images site/lib/admin-auth.ts site/tests/admin-auth.test.ts site/tests/admin-api.test.ts
git commit -m "feat: add secure autosave and image uploads"
```

### Task 9: Complete the owner dashboard and publishing actions

**Files:**
- Modify: `site/app/admin/page.tsx`
- Modify: `site/app/admin/posts/new/page.tsx`
- Modify: `site/app/admin/posts/[id]/page.tsx`
- Modify: `site/app/admin/actions.ts`
- Create: `site/components/admin/delete-post-button.tsx`
- Create: `site/components/admin/post-status-tabs.tsx`
- Modify: `site/app/globals.css`
- Modify: `site/tests/admin-actions.test.ts`

**Interfaces:**
- Consumes: Admin guard, post table, and editor.
- Produces: Status-filtered dashboard and explicit `publishPost`, `schedulePost`, `movePostToDraft`, and `deletePost` actions.

- [ ] **Step 1: Write action-state tests**

Cover immediate publication date creation, required future schedule date, moving a published post to draft, duplicate slug reporting, and failed database mutations leaving the prior status unchanged.

- [ ] **Step 2: Implement separate named actions**

Keep status changes out of ambiguous generic form values. Each action validates the target transition, updates the post, revalidates `/`, `/blog`, `/blog/[slug]`, `/sitemap.xml`, and `/feed.xml`, then returns a clear result or redirects.

- [ ] **Step 3: Add dashboard tabs and counts**

Render All, Drafts, Scheduled, and Published with URL query filtering. Show title, slug, status, publication time, update time, Edit, Preview, and Delete.

- [ ] **Step 4: Add explicit delete confirmation**

The delete button opens a confirmation dialog naming the article. Cancellation changes nothing. Confirmation submits the protected delete action.

- [ ] **Step 5: Run admin tests and inspect desktop/mobile dashboard layouts**

Run: `cd site && npm test -- --run tests/admin-actions.test.ts && npm run lint`

- [ ] **Step 6: Commit**

```bash
git add site/app/admin site/components/admin site/app/globals.css site/tests/admin-actions.test.ts
git commit -m "feat: complete the owner publishing dashboard"
```

### Task 10: Render Markdown and complete article SEO

**Files:**
- Modify: `site/app/blog/[slug]/page.tsx`
- Modify: `site/components/blog/post-card.tsx`
- Modify: `site/lib/seo.ts`
- Modify: `site/app/sitemap.ts`
- Modify: `site/app/feed.xml/route.ts`
- Modify: `site/app/globals.css`
- Modify: `site/tests/seo.test.ts`

**Interfaces:**
- Consumes: `MarkdownArticle`, complete `Post` metadata, and publication status.
- Produces: Sanitized public article HTML, complete metadata, JSON-LD, sitemap entries, and RSS items.

- [ ] **Step 1: Add failing SEO tests for image metadata and no-index**

```ts
expect(buildPostMetadata(post).openGraph?.images).toEqual([{ url: post.featured_image_url, alt: post.featured_image_alt }]);
expect(buildPostMetadata(fixturePost({ noindex: true })).robots).toEqual({ index: false, follow: false });
```

- [ ] **Step 2: Replace paragraph splitting with `MarkdownArticle`**

Render the featured image with its saved alt text, Markdown body, publication date, and category. Keep scripts limited to escaped JSON-LD produced by `buildArticleJsonLd`.

- [ ] **Step 3: Complete metadata fallback order**

Use SEO title then article title; meta description then excerpt; Open Graph title/description then SEO values; Open Graph image then featured image; canonical URL then the AWORLDTIME article URL.

- [ ] **Step 4: Verify scheduled and no-index behavior**

Scheduled future posts must remain absent from article lookup, homepage, blog listing, sitemap, and RSS. Published no-index posts remain readable by direct URL but stay out of the sitemap and receive no-index metadata.

- [ ] **Step 5: Run SEO and article tests**

Run: `cd site && npm test -- --run tests/seo.test.ts tests/components/markdown-article.test.tsx`

- [ ] **Step 6: Commit**

```bash
git add site/app/blog site/components/blog site/lib/seo.ts site/app/sitemap.ts site/app/feed.xml/route.ts site/app/globals.css site/tests/seo.test.ts
git commit -m "feat: publish markdown articles with complete SEO"
```

### Task 11: Add end-to-end owner and responsive checks

**Files:**
- Create: `site/e2e/homepage-mobile.spec.ts`
- Create: `site/e2e/admin-publishing.spec.ts`
- Modify: `site/playwright.config.ts`

**Interfaces:**
- Consumes: Local test server and seeded admin test account supplied through environment variables.
- Produces: Browser-level proof of the homepage and owner workflow.

- [ ] **Step 1: Add the 390-pixel homepage test**

```ts
test.use({ viewport: { width: 390, height: 844 } });

test("shows three complete city cards without horizontal overflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Dubai", { exact: true })).toBeVisible();
  const cards = page.locator(".city-clock").filter({ hasText: /London|New York|Dubai/ });
  await expect(cards).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
```

- [ ] **Step 2: Add the mobile-menu and skyline assertions**

Open the three-line menu, verify all four links, select a city, and assert that the hero background URL changes to that city's file.

- [ ] **Step 3: Add the admin publishing flow**

Log in with `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD`, create a uniquely slugged draft, insert Markdown and an image, preview it, publish it, verify its public metadata, return it to draft, and delete it.

- [ ] **Step 4: Run the complete local verification**

Run: `cd site && npm test -- --run && npm run lint && npm run build && npm run test:e2e`

- [ ] **Step 5: Commit**

```bash
git add site/e2e site/playwright.config.ts
git commit -m "test: cover responsive homepage and publishing"
```

### Task 12: Deploy, verify production, then connect the domain

**Files:**
- Modify only if required by deployment: `site/README.md`

**Interfaces:**
- Consumes: Passing main branch, linked Supabase project, Vercel production project, and domain registrar access controlled by the owner.
- Produces: Verified production release and DNS instructions for AWORLDTIME.COM.

- [ ] **Step 1: Push the verified branch to GitHub**

Confirm the branch includes every planned commit and no unrelated files. Push or merge to `main` using the user's approved GitHub workflow.

- [ ] **Step 2: Wait for Vercel production status `Ready`**

Open the unique production deployment URL. Do not rely on a previous alias or cached page.

- [ ] **Step 3: Verify the public production site**

At desktop and 390 pixels, verify current city, live time accuracy, correct skyline, round flags, six cards, no horizontal overflow, working mobile menu, converter link, meeting link, and published guides.

- [ ] **Step 4: Verify the owner workflow in production**

The owner signs in without sharing the password. Test draft save, autosave, Markdown preview, image upload, schedule, immediate publish, public article, sitemap, RSS, unpublish, and cleanup.

- [ ] **Step 5: Connect AWORLDTIME.COM only after the production checks pass**

Add the domain in Vercel, read the exact DNS records Vercel displays, then ask the owner to sign in to the domain registrar. Apply only those displayed records, wait for Vercel to show valid DNS and SSL, and verify both apex and `www` behavior.

- [ ] **Step 6: Record deployment and operating notes**

Document the live URL, admin path, image limits, Markdown syntax, publishing states, DNS records, and recovery steps in `site/README.md` without storing passwords or tokens.

- [ ] **Step 7: Commit documentation if changed**

```bash
git add site/README.md
git commit -m "docs: add publishing and deployment notes"
```
