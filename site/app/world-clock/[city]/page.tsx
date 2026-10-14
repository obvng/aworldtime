import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CityLiveClock } from "@/components/city-live-clock";
import { SiteHeader } from "@/components/site-header";
import { CITIES, cityBySlug, countryCodeToFlag } from "@/lib/cities";
import { citySeoTitle } from "@/lib/city-seo";
import { getPageSeo } from "@/lib/page-seo";
import { absoluteUrl, buildPageMetadata, serializeJsonLd } from "@/lib/seo";
import { describeTimeZone, getSolarTimes, timeZoneName } from "@/lib/time";

type CityPageProps = { params: Promise<{ city: string }> };

export const dynamicParams = false;
export const revalidate = 86_400;

export async function generateStaticParams() {
  return CITIES.map((city) => ({ city: city.slug }));
}

function cityFacts(slug: string, now = new Date()) {
  const city = cityBySlug(slug);
  if (!city) return null;
  return {
    city,
    zone: describeTimeZone(now, city.timeZone),
    solar: getSolarTimes(now, city),
    zoneName: timeZoneName(now, city.timeZone),
  };
}

function defaultSeo(slug: string) {
  const facts = cityFacts(slug);
  if (!facts) return null;
  const { city, zone, solar } = facts;
  const dstText = zone.isDaylightSavingTime ? "DST is active" : "DST is not active";
  const solarText = solar.sunrise && solar.sunset ? `sunrise ${solar.sunrise} and sunset ${solar.sunset}` : "today's daylight times";
  return {
    title: citySeoTitle(city),
    description: `See the current time in ${city.name}, ${city.country}, ${zone.offsetLabel}, ${dstText}, ${solarText}, and the next clock change.`,
  };
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city: slug } = await params;
  const city = cityBySlug(slug);
  const fallback = defaultSeo(slug);
  if (!city || !fallback) return {};
  const path = `/world-clock/${city.slug}`;
  const override = await getPageSeo(path);
  return buildPageMetadata({
    title: override?.seo_title || fallback.title,
    description: override?.meta_description || fallback.description,
    path,
    absoluteTitle: Boolean(override?.seo_title),
  });
}

export default async function CityPage({ params }: CityPageProps) {
  const { city: slug } = await params;
  const now = new Date();
  const facts = cityFacts(slug, now);
  if (!facts) notFound();
  const { city, zone, solar, zoneName } = facts;
  const related = CITIES.filter((candidate) => candidate.slug !== city.slug && (candidate.country === city.country || candidate.timeZone === city.timeZone)).slice(0, 6);
  const solarDate = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric", timeZone: city.timeZone }).format(now);
  const transition = zone.nextTransition
    ? new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: city.timeZone }).format(zone.nextTransition)
    : null;
  const pageUrl = absoluteUrl(`/world-clock/${city.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Current time in ${city.name}, ${city.country}`,
    url: pageUrl,
    about: { "@type": "City", name: city.name, containedInPlace: { "@type": "Country", name: city.country } },
    dateModified: city.contentUpdatedAt,
  };

  return (
    <div className="site-shell city-page-shell">
      <SiteHeader />
      <main className="city-detail-page">
        <nav className="city-breadcrumb" aria-label="Breadcrumb"><Link href="/world-clock">World clock</Link><span>/</span><span>{city.name}</span></nav>
        <section className="city-detail-hero">
          <p className="city-detail-kicker">Current local time</p>
          <h1>Current time in {city.name}, {city.country} <span role="img" aria-label={`${city.country} flag`}>{countryCodeToFlag(city.countryCode)}</span></h1>
          <CityLiveClock timeZone={city.timeZone} />
          <p>{city.name} uses {zoneName} ({zone.offsetLabel}).</p>
        </section>

        <section className="city-fact-grid" aria-label={`${city.name} time and daylight facts`}>
          <article><span>UTC offset on {solarDate}</span><strong>{zone.offsetLabel}</strong><p>{zoneName}</p></article>
          <article><span>Daylight saving time</span><strong>{zone.isDaylightSavingTime ? "In effect" : "Not in effect"}</strong><p>{zone.nextTransition ? `Next change: ${transition} to ${zone.nextOffsetLabel}` : `${city.name} does not observe daylight saving time.`}</p></article>
          <article><span>Sunrise on {solarDate}</span><strong>{solar.sunrise ?? "No sunrise"}</strong><p>Local time in {city.name}</p></article>
          <article><span>Sunset on {solarDate}</span><strong>{solar.sunset ?? "No sunset"}</strong><p>{solar.dayLengthMinutes ? `${Math.floor(solar.dayLengthMinutes / 60)} hr ${solar.dayLengthMinutes % 60} min of daylight on ${solarDate}` : `Polar day or night on ${solarDate}`}</p></article>
        </section>

        <section className="city-explainer">
          <h2>Time in {city.name}</h2>
          <p>{city.name} follows the {city.timeZone} time zone. Its current offset is {zone.offsetLabel}. {zone.isDaylightSavingTime ? `Daylight saving time is currently active, and the next offset change is scheduled for ${transition}.` : zone.nextTransition ? `Daylight saving time is not active now. The next offset change is scheduled for ${transition}.` : `${city.name} keeps the same UTC offset throughout the year.`}</p>
          <p>On {solarDate}, sunrise is at {solar.sunrise ?? "an unavailable time"} and sunset is at {solar.sunset ?? "an unavailable time"}, using coordinates {Math.abs(city.latitude).toFixed(4)}°{city.latitude >= 0 ? "N" : "S"}, {Math.abs(city.longitude).toFixed(4)}°{city.longitude >= 0 ? "E" : "W"}.</p>
          <Link className="admin-primary" href={`/converter?from=${encodeURIComponent(city.slug)}`}>Convert {city.name} time</Link>
        </section>

        {related.length ? <section className="related-cities"><h2>Related city clocks</h2><div>{related.map((item) => <Link key={item.slug} href={`/world-clock/${item.slug}`}>{item.name}, {item.country}</Link>)}</div></section> : null}
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
    </div>
  );
}
