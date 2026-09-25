# AWORLDTIME global SEO design

## Goal

Make every public AWORLDTIME route crawlable, canonical, understandable in search results, and ready for global discovery. Keep private administration routes out of search results. This pass does not create programmatic city pages.

## Canonical domain

The canonical origin is `https://www.aworldtime.com`.

- Every public page declares a self-referencing canonical URL on that origin.
- `robots.txt`, the sitemap, RSS links, Open Graph URLs, and structured data use the same origin.
- External canonical URLs entered for articles remain supported.

## Page metadata

The root layout defines a title template, site description, metadata base, application name, RSS discovery link, Open Graph defaults, and X/Twitter card defaults.

Each public route supplies a unique title, description, canonical URL, Open Graph URL, and social title and description:

- `/`
- `/world-clock`
- `/converter`
- `/meeting-planner`
- `/blog`
- `/blog/[slug]`

Private `/admin` routes remain `noindex, nofollow`. The public sitemap never includes them.

## Structured data

The homepage includes `WebSite` and `Organization` JSON-LD using the canonical origin. Tool pages describe the actual tool with `WebApplication` JSON-LD. Blog articles retain `Article` JSON-LD with their canonical URL, publication date, modification date, author, publisher, and optional image.

All JSON-LD is serialized safely by escaping `<` before insertion.

## Sitemap and robots

The sitemap is available at `https://www.aworldtime.com/sitemap.xml`.

- Static routes use deliberate, stable modification dates instead of the build time.
- Published articles use their database `updated_at` value.
- Articles marked `noindex` are excluded.
- Scheduled, draft, and future-dated articles are excluded by the existing publication query and row-level security.

`robots.txt` allows public pages, blocks `/admin/` and `/preview/`, and points to the canonical `www` sitemap.

## Internal discovery

The root metadata advertises `/feed.xml`. Existing navigation and homepage links remain the main crawl paths. No hidden keyword blocks, doorway pages, or mass-generated city pages are added.

## Failure handling

If Supabase is unavailable, the current safe article fallback remains in place. Sitemap and feed generation must still return valid documents. A missing blog post continues to return the existing 404 response.

## Verification

Automated tests cover canonical URL generation, page metadata, robots output, sitemap URLs and dates, structured data, article indexing rules, and admin `noindex` behavior. The full test suite, lint, and production build must pass.

After deployment, verify the live HTML for every public route, `robots.txt`, `sitemap.xml`, article metadata when a published article exists, HTTP redirects, and the absence of admin routes from the sitemap.
