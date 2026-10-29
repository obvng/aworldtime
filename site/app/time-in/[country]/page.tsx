import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ZoneLiveTime } from "@/components/zone-live-time";
import { countryCodeToFlag } from "@/lib/cities";
import { COUNTRY_TIME_PAGES, citiesForCountryZone, countryTimeBySlug } from "@/lib/country-times";
import { absoluteUrl, buildBreadcrumbJsonLd, buildPageMetadata, serializeJsonLd } from "@/lib/seo";
import { describeTimeZone, timeZoneName } from "@/lib/time";

type CountryPageProps = { params: Promise<{ country: string }> };

export const dynamicParams = false;
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return COUNTRY_TIME_PAGES.map((country) => ({ country: country.slug }));
}

function countryTitle(name: string, zoneCount: number) {
  return zoneCount > 1
    ? `Time in ${name} Now: Current Local Times by Region`
    : `Time in ${name} Now: Current Local Time`;
}

function countryDescription(name: string, zoneCount: number) {
  const zones = zoneCount > 1 ? "time zones" : "time zone";
  return `See the current time across ${name}'s IANA ${zones}, with regional coverage, UTC offsets and daylight-saving information.`;
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const country = countryTimeBySlug(slug);
  if (!country) return {};
  return buildPageMetadata({
    title: countryTitle(country.name, country.zones.length),
    description: countryDescription(country.name, country.zones.length),
    path: `/time-in/${country.slug}`,
    absoluteTitle: true,
  });
}

export default async function CountryTimePage({ params }: CountryPageProps) {
  const { country: slug } = await params;
  const country = countryTimeBySlug(slug);
  if (!country) notFound();

  const now = new Date();
  const initialNow = now.toISOString();
  const pageUrl = absoluteUrl(`/time-in/${country.slug}`);
  const zoneFacts = country.zones.map((entry) => ({
    ...entry,
    details: describeTimeZone(now, entry.timeZone),
    name: timeZoneName(now, entry.timeZone),
    cities: citiesForCountryZone(country.countryCode, entry.timeZone),
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: countryTitle(country.name, country.zones.length),
    url: pageUrl,
    dateModified: country.updatedAt,
    about: { "@type": "Country", name: country.name },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: country.zones.length,
      itemListElement: country.zones.map((zone, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: zone.timeZone,
      })),
    },
  };
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "World clock", path: "/world-clock" },
    { name: country.name, path: `/time-in/${country.slug}` },
  ]);

  return (
    <div className="site-shell country-time-shell">
      <SiteHeader />
      <main className="country-time-page">
        <nav className="city-breadcrumb" aria-label="Breadcrumb">
          <Link href="/world-clock">World clock</Link><span>/</span><span>{country.name}</span>
        </nav>
        <header className="country-time-hero">
          <p className="city-detail-kicker">Country time zones</p>
          <h1>Time in {country.name} now <span role="img" aria-label={`${country.name} flag`}>{countryCodeToFlag(country.countryCode)}</span></h1>
          <p>{country.summary}</p>
        </header>

        <section className="country-zone-grid" aria-label={`${country.name} time zones`}>
          {zoneFacts.map((zone) => {
            const transition = zone.details.nextTransition
              ? new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: zone.timeZone }).format(zone.details.nextTransition)
              : null;
            return (
              <article key={zone.timeZone} className="country-zone-card" data-testid="country-zone-card">
                <div className="country-zone-heading">
                  <div><span>{zone.regions}</span><h2>{zone.timeZone}</h2></div>
                  <strong>{zone.details.offsetLabel}</strong>
                </div>
                <ZoneLiveTime timeZone={zone.timeZone} initialNow={initialNow} includeDate />
                <dl>
                  <div><dt>Time-zone name</dt><dd>{zone.name}</dd></div>
                  <div><dt>Daylight saving</dt><dd>{zone.details.isDaylightSavingTime ? "In effect" : "Not in effect"}</dd></div>
                </dl>
                <p className="country-zone-change">
                  {zone.details.nextTransition
                    ? `Next clock change: ${transition} to ${zone.details.nextOffsetLabel}.`
                    : "No seasonal clock change is scheduled for this zone."}
                </p>
                {zone.cities.length ? (
                  <nav className="country-zone-cities" aria-label={`City clocks in ${zone.regions}`}>
                    <span>City clocks</span>
                    <div>{zone.cities.map((city) => <Link key={city.slug} href={`/world-clock/${city.slug}`}>{city.name}</Link>)}</div>
                  </nav>
                ) : null}
              </article>
            );
          })}
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }} />
    </div>
  );
}
