import { SITE_ORIGIN } from "@/lib/seo";

const content = `# AWORLDTIME.COM

AWORLDTIME.COM provides current local times, a world clock, a time-zone converter, a meeting planner, and practical guides about time and date differences.

## Public tools

- World clock: ${SITE_ORIGIN}/world-clock
- Time-zone converter: ${SITE_ORIGIN}/converter
- Meeting planner: ${SITE_ORIGIN}/meeting-planner

## Guides

- Time guides: ${SITE_ORIGIN}/blog
- RSS feed: ${SITE_ORIGIN}/feed.xml

## Discovery

- XML sitemap: ${SITE_ORIGIN}/sitemap.xml
- Robots policy: ${SITE_ORIGIN}/robots.txt

Public pages may be crawled and cited. Private admin and preview routes are excluded.
`;

export function GET() {
  return new Response(content, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
