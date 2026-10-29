import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ZoneLiveTime } from "@/components/zone-live-time";
import { absoluteUrl, buildPageMetadata, serializeJsonLd } from "@/lib/seo";
import { describeTimeZone, timeZoneName } from "@/lib/time";
import { UTC_COMPARISON_ZONES } from "@/lib/utc-comparisons";

const title = "UTC Time Now: Current Coordinated Universal Time";
const description = "See the current UTC time and compare major world time zones against Coordinated Universal Time.";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return buildPageMetadata({ title, description, path: "/utc", absoluteTitle: true });
}

export default async function UtcPage() {
  const now = new Date();
  const initialNow = now.toISOString();
  const comparisons = UTC_COMPARISON_ZONES.map((zone) => ({
    ...zone,
    details: describeTimeZone(now, zone.timeZone),
    name: timeZoneName(now, zone.timeZone),
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: absoluteUrl("/utc"),
    description,
    dateModified: "2026-10-29",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: comparisons.length,
      itemListElement: comparisons.map((zone, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${zone.label} — ${zone.timeZone}`,
      })),
    },
  };

  return (
    <div className="site-shell utc-page-shell">
      <SiteHeader />
      <main className="utc-page">
        <nav className="city-breadcrumb" aria-label="Breadcrumb">
          <Link href="/world-clock">World clock</Link><span>/</span><span>UTC</span>
        </nav>
        <header className="utc-hero">
          <p className="city-detail-kicker">Coordinated Universal Time</p>
          <h1>UTC time now</h1>
          <div data-testid="utc-live-clock"><ZoneLiveTime timeZone="UTC" initialNow={initialNow} includeDate /></div>
          <p>UTC is the reference used to compare civil time zones worldwide. It does not move forward or backward for daylight saving.</p>
        </header>

        <section className="utc-comparison-section" aria-labelledby="utc-comparison-heading">
          <div className="utc-section-heading">
            <div><p className="city-detail-kicker">World comparison</p><h2 id="utc-comparison-heading">Major time zones compared with UTC</h2></div>
            <Link href="/converter">Open time converter</Link>
          </div>
          <div className="utc-comparison-table" role="table" aria-label="Major time zones compared with UTC">
            <div className="utc-comparison-header" role="row">
              <span role="columnheader">Place</span><span role="columnheader">Local time</span><span role="columnheader">UTC offset</span>
            </div>
            {comparisons.map((zone) => (
              <div className="utc-comparison-row" role="row" data-testid="utc-comparison-row" key={zone.timeZone}>
                <div role="cell"><strong>{zone.label}</strong><span>{zone.timeZone}</span><small>{zone.name}</small></div>
                <div role="cell"><ZoneLiveTime timeZone={zone.timeZone} initialNow={initialNow} /></div>
                <strong role="cell">{zone.details.offsetLabel}</strong>
              </div>
            ))}
          </div>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
    </div>
  );
}
