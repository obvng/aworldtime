# AWORLDTIME city homepage and admin design

## Goal

Rebuild AWORLDTIME.COM to match the approved visual reference while keeping the current rounded interface font and clock-number treatment. Add city-specific skyline artwork, six compact city clocks, and a private Markdown publishing dashboard for the site owner.

## Approved visual reference

The source of truth is `/Users/mac/Downloads/ChatGPT Image Sep 25, 2026, 01_28_37 AM.png`.

The implementation must preserve these visible characteristics:

- A white header above a pale blue illustrated city scene.
- A local city name, country flag, large clock, full date, time-zone name, and weather summary in the hero.
- A skyline sitting along the lower edge of the hero rather than a generic abstract background.
- A large white search field with a solid blue search button.
- Clear blue accents across controls and links.
- Yellow used only for weather details and the meeting-planner treatment.
- Large circular flags in the hero and city cards.
- Compact city cards that show the complete city name and time.

The current rounded interface font stack and clock-number font treatment must not change.

## Homepage structure

The homepage remains focused on local time. It contains, in order:

1. Site header with desktop navigation and a working mobile menu.
2. Local-time hero with the visitor's detected city shown first.
3. City search.
4. Six popular-city clocks.
5. Time converter and meeting planner links.
6. Latest published guides.
7. Footer.

The homepage must not expose admin controls or add complex tools above the fold.

## City artwork

Each of the 19 cities in `site/lib/cities.ts` receives a lightweight skyline illustration that matches the approved pale-blue visual style. The artwork should identify the city through recognizable architecture or skyline shape without becoming photorealistic.

The selected city's artwork appears in the hero. Lagos is the default for visitors in Nigeria. Changing the selected city changes the hero artwork without reloading the page.

Artwork requirements:

- Web-optimized files with desktop and mobile-safe composition.
- A shared pale-blue palette so text remains readable.
- City-specific alt-free decorative treatment because the city name is already visible text.
- A generic skyline fallback for a valid time zone that is not in the catalogue.
- No blocking image load before the local time becomes readable.

## Popular city clocks

The six approved cities are:

- London
- New York
- Dubai
- Tokyo
- Toronto
- Beijing

Desktop uses one row of six cards. Mobile uses two rows of three cards with no horizontal scrolling. Every card shows a circular flag, city name, full local time, short time-zone label, and compact weather summary when available.

At a 390-pixel viewport, the first three cards must remain fully within the viewport. Dubai's full time must be visible without swiping.

## Color system

- Deep clock navy: `#071A4D`
- Primary action blue: `#1268F3`
- Sky blue: `#DDF1FF`
- Pale panel blue: `#EDF7FF`
- White: `#FFFFFF`
- Weather yellow: `#FFBC24`

Blue is the main interactive color. Yellow must not spread to unrelated controls or decorative panels.

## Private admin authentication

The admin is for one owner account. Supabase Auth provides email-and-password authentication.

- `/admin/login` is the only sign-in entry point.
- Public registration is not provided.
- Unauthenticated visitors are redirected away from all `/admin` routes.
- The existing profile role and row-level security policies remain the authorization boundary.
- The admin session uses secure server-managed cookies.

## Admin dashboard

The dashboard lists posts by status and shows title, slug, status, publication date, last update, and edit actions. It provides clear views for drafts, scheduled posts, and published posts.

The dashboard supports:

- Create article.
- Edit article.
- Preview article.
- Publish immediately.
- Schedule publication.
- Return a published article to draft.
- Delete an article with an explicit confirmation.

## Markdown editor

The editor stores Markdown as the article source. It provides a formatting toolbar for headings, bold, italic, links, ordered and unordered lists, block quotes, code, tables, and images.

The writing area and rendered preview can be viewed side by side on desktop and switched with tabs on mobile. Preview rendering must use the same article styles as the public blog.

The editor includes:

- Automatic slug suggestion from the title, with manual editing allowed.
- Image upload to Supabase Storage and Markdown insertion at the cursor.
- Autosave for existing drafts.
- Visible saved, saving, and failed states.
- Warning before leaving with unsaved changes.
- Validation messages beside the relevant field.

## Publishing and SEO

Each article supports:

- Title
- Slug
- Excerpt
- Markdown body
- Category
- Featured image
- Image alt text
- Draft, scheduled, or published status
- Publication date and time
- SEO title
- Meta description
- Canonical URL
- Open Graph title
- Open Graph description
- No-index option

Publishing updates the public blog page, article page, sitemap, RSS feed, page metadata, Open Graph metadata, and article JSON-LD. Scheduled articles become public only after their publication time.

Markdown must be rendered through a sanitizing pipeline. Raw scripts and unsafe HTML must not reach public pages.

## Data changes

The existing `posts` table remains the source of truth. A migration may add fields needed for Markdown rendering, image alt text, and editor state while preserving existing post data.

Supabase Storage remains the image store. Uploads accept common web image formats, enforce file-size limits, and save stable public URLs in article records or Markdown.

## Error handling

- Failed location, weather, or skyline loading must not stop the clock.
- A missing city artwork uses the generic skyline.
- Failed autosave leaves the editor content intact and shows a retry action.
- Failed publishing does not change the visible post status.
- Invalid slugs, missing publication dates, and incomplete SEO fields receive specific messages.

## Accessibility and responsive behavior

- All controls are keyboard accessible and have visible focus states.
- The mobile menu exposes correct expanded state and readable link labels.
- Flags have country-specific accessible names.
- Decorative skyline artwork is ignored by screen readers.
- Text and controls meet readable contrast against the illustrated background.
- The homepage and admin have no horizontal overflow at 320, 390, 768, and 1280 pixels.

## Verification

Implementation is complete only when:

- Automated tests cover city selection, six-card rendering, mobile menu behavior, Markdown validation, admin authorization, saving, scheduling, publishing, and SEO output.
- Lint and production build pass.
- Desktop and 390-pixel mobile screenshots are compared with the approved reference.
- All six city cards fit in the approved desktop and mobile arrangements.
- The live deployment shows the correct city artwork and large circular flags.
- The live admin login, draft save, preview, image upload, scheduled publication, and immediate publication flows are tested with the owner's account.
