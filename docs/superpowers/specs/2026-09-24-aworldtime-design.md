# AWORLDTIME.COM design specification

## Product goal

AWORLDTIME.COM will help visitors see their current local time immediately, find the time in another city, convert times, and plan meetings across time zones. A public blog will support regular search-focused publishing. A private admin area will let the owner write, schedule, update, and optimize posts without editing code.

The homepage will stay simple. Detailed calendars, forecasts, and secondary utilities will live on their own pages instead of competing with the local clock.

## Audience and primary journey

The site is for anyone who needs a clear answer to “What time is it here or there?” It must work equally well on phones and desktop computers.

On arrival, the site will:

1. Read the visitor’s browser time zone without requesting precise GPS permission.
2. Map that time zone to a useful city and country label.
3. Show the city, current local time, date, time-zone name, and offset in the largest area of the page.
4. Let the visitor search for another city or time zone.
5. Offer direct access to time conversion and meeting planning.

If the browser time zone is missing or unrecognized, the page will use UTC and show a clear “Choose your city” control. The selected city will be saved on that device.

## Public site structure

### Homepage

The homepage will contain only:

- compact header and navigation;
- detected local city and live time;
- local date, time zone, and a short weather summary when available;
- city and time-zone search;
- a small list of popular or saved city clocks;
- large links to the converter and meeting planner; and
- a short latest-guides section from the blog.

Dense weather data, calendars, maps, and advanced controls will not appear on the homepage.

### Utility pages

- `/world-clock`: searchable city directory with live clocks.
- `/converter`: compare a chosen date and time across multiple locations.
- `/meeting-planner`: compare working hours and find overlapping meeting times.
- `/blog`: published articles, categories, and search.
- `/blog/[slug]`: individual SEO article pages.

The first release will not include user accounts, saved cloud preferences, paid plans, advertisements, or a large astronomy section.

## Visual direction

The site will use the approved simplified mockup as its reference. The visual idea is a friendly global time utility, not a dense control panel.

### Color tokens

- Deep navy: `#0B1F3A`
- Cobalt blue: `#2563EB`
- White: `#FFFFFF`
- Pale sky: `#EAF3FF`
- Sunrise amber: `#F4A340`
- Cool gray: `#64748B`

### Typography and layout

A humanist sans-serif will carry the interface, with tabular numerals for clocks. The local time will be the dominant type element. Content will be left aligned on small screens and centered within the main time area on wider screens.

The desktop layout will use generous space, a centered local-time area, a full-width city search, and a compact city row. Mobile will use one column, large touch targets, a shorter clock display without seconds, and horizontally scrollable city clocks.

Motion will be limited to the live clock and direct interaction feedback. Reduced-motion settings will be respected.

## Blog and private admin

The public blog will render on the server so search engines receive complete article HTML. Each post will support:

- title, slug, excerpt, body, author, category, and featured image;
- draft, scheduled, and published status;
- publish date and updated date;
- SEO title and meta description;
- canonical URL;
- Open Graph title, description, and image;
- index or no-index control;
- related posts; and
- automatic Article structured data.

The private `/admin` area will require email and password authentication. Only approved administrator accounts will have access. It will include a post list, editor, preview, scheduling controls, image upload, and SEO fields. The editor will warn when a title or description is likely to be truncated in search results, without pretending that a particular score guarantees ranking.

## Search-engine foundations

The site will generate:

- page-specific titles and descriptions;
- canonical URLs;
- `sitemap.xml` covering public utility pages and published posts;
- `robots.txt`;
- an RSS feed;
- Organization, WebSite, BreadcrumbList, and Article structured data where applicable;
- semantic headings and internal links; and
- stable, readable blog URLs.

Drafts, scheduled posts before their publish time, admin pages, and preview pages will not be indexed or included in the sitemap.

## Architecture and data flow

The application will use Next.js with TypeScript. Vercel will host the public site and server functions. Supabase will provide PostgreSQL storage, administrator authentication, and blog-image storage.

Public time calculations will use browser and server time-zone APIs. City search will use a curated time-zone city dataset stored with the application, so the main clock and converter do not depend on a paid API.

Weather will be treated as optional enhancement data. If a free weather source is unavailable or slow, the time experience must still work. Weather failures will hide the summary instead of blocking the page.

Published blog pages will read only public posts. Admin mutations will run through authenticated server actions or protected server endpoints. Database row-level security will prevent anonymous writes and restrict administration to approved accounts.

## Responsive and accessible behavior

The site will support narrow phones through large desktop screens without horizontal page scrolling. Main text will remain usable when enlarged to 200%. All controls will have visible keyboard focus, accessible names, and sufficient contrast. Search, dialogs, menus, and forms will work by keyboard and touch.

Clocks will update without causing layout shifts. The server-rendered initial time will be corrected on the client after hydration to match the visitor’s browser time zone.

## Failure states

- Unknown time zone: show UTC and ask the visitor to choose a city.
- Search with no match: explain that no city was found and keep the query editable.
- Weather unavailable: omit weather without affecting time tools.
- Unauthorized admin request: redirect to the admin login page.
- Scheduled post not yet public: return a not-found response outside authenticated preview.
- Missing featured image: use a clean text-only article layout rather than a generic placeholder.

## Verification

Before deployment, the build will be checked for:

- correct local-time rendering in several time zones;
- converter behavior across date changes and daylight-saving transitions;
- usable desktop and mobile layouts;
- keyboard navigation and visible focus;
- admin login and unauthorized-access protection;
- draft, scheduled, published, edited, and deleted post flows;
- metadata, sitemap, robots, RSS, canonical links, and structured data;
- production build success; and
- deployed-route checks on Vercel.

## GitHub, Vercel, and domain handoff

The repository will be named `aworldtime` and pushed to the user’s GitHub account. The Vercel project will be connected to that repository and deployed on the free plan where account limits allow it.

The production deployment will be verified before DNS changes. After `aworldtime.com` is added to the Vercel project, the exact DNS records shown by Vercel will be given to the user. The apex domain and `www` domain will both be configured, with one redirecting to the other. Existing DNS records will not be changed until the required records and any conflicts have been identified.

## Completion criteria

The work is complete when the approved public pages and private admin are functional, the production build passes, the repository is on GitHub, the Vercel deployment works, and the user has the verified DNS records needed to connect `aworldtime.com`.
