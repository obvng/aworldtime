# Internal Links, Indexing Residue, and Admin Session Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add crawlable country/city/guide links, retire the obsolete hosting URL, preserve the malformed-homepage redirect, and set a 90-day admin browser session.

**Architecture:** Use the existing city and country catalogues for internal links, plus a pure explicit guide-matching catalogue. Keep URL cleanup in Next routes/config and centralize Supabase cookie settings for browser, server, and proxy clients.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase SSR, Vitest

**Spec:** `docs/superpowers/specs/2026-11-15-internal-links-index-residue-session-design.md`

## Global Constraints

- Do not change the converter, calculator arithmetic, page titles, or meta descriptions.
- Render all new links in server HTML.
- Show published guides only.
- Preserve Supabase logout, token rotation, RLS, and admin-role checks.

## Review Focus

- A country with cities in several IANA zones lists each catalogue city once.
- A guide that matches both country code and zone is not duplicated.
- An unpublished or missing mapped article is never linked.
- The obsolete cPanel URL returns 410, while `/&` remains a permanent homepage redirect.
- Refreshed and newly issued auth cookies both receive a 90-day lifetime.

---

### Task 1: Crawlable country and guide links

**Files:**
- Create: `site/lib/related-guides.ts`
- Modify: `site/app/time-in/[country]/page.tsx`
- Modify: `site/app/world-clock/[city]/page.tsx`
- Test: `site/tests/related-guides.test.ts`
- Test: `site/tests/country-route.test.tsx`
- Test: `site/tests/city-route.test.tsx`

**Interfaces:**
- Produces: `selectRelatedGuides(posts, context): Post[]`
- Consumes: `Post`, `CITIES`, country code, and IANA zone values.

- [ ] Write failing selector and rendered-link tests.
- [ ] Run the targeted tests and confirm the missing links fail.
- [ ] Add the guide catalogue, selector, and server-rendered page sections.
- [ ] Run the targeted tests and confirm they pass.

### Task 2: Search Console residue

**Files:**
- Create: `site/app/cgi-sys/suspendedpage.cgi/route.ts`
- Modify: `site/tests/redirects.test.ts`

**Interfaces:**
- Produces: `GET(): Response` with HTTP 410.

- [ ] Add a failing test for the obsolete hosting URL.
- [ ] Run it and confirm the route is missing.
- [ ] Add the 410 route without altering the existing `/&` redirect.
- [ ] Run the test and confirm both URL behaviors pass.

### Task 3: Ninety-day admin browser session

**Files:**
- Create: `site/lib/supabase/session-options.ts`
- Modify: `site/lib/supabase/client.ts`
- Modify: `site/lib/supabase/server.ts`
- Modify: `site/lib/supabase/proxy.ts`
- Test: `site/tests/admin-proxy.test.ts`
- Test: `site/tests/supabase-session.test.ts`

**Interfaces:**
- Produces: `ADMIN_SESSION_MAX_AGE_SECONDS` and `SUPABASE_SESSION_COOKIE_OPTIONS`.

- [ ] Add failing tests proving issued and refreshed cookies use 7,776,000 seconds.
- [ ] Run them and confirm the current 400-day default fails.
- [ ] Pass the shared options to all Supabase SSR clients.
- [ ] Run the tests and confirm they pass.

### Task 4: Full verification and release

**Files:**
- Verify all changed files and generated routes.

- [ ] Run the full test suite.
- [ ] Run lint.
- [ ] Run the production build.
- [ ] Review the diff and exclude unrelated files.
- [ ] Commit and push to the production branch.
- [ ] Wait for Vercel production readiness.
- [ ] Verify live country/city guide links, 410/redirect behavior, and admin cookie lifetime.

