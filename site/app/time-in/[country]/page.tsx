import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ZoneLiveTime } from "@/components/zone-live-time";
import { CITIES, countryCodeToFlag } from "@/lib/cities";
import { citiesForCountryZone, COUNTRY_TIME_PAGES, countrySeoDescription, countrySeoTitle, countryTimeBySlug } from "@/lib/country-times";
import { getPageSeo } from "@/lib/page-seo";
import { listPublishedPosts } from "@/lib/posts";
import { selectRelatedGuides } from "@/lib/related-guides";
import { absoluteUrl, buildBreadcrumbJsonLd, buildPageMetadata, serializeJsonLd } from "@/lib/seo";
import { describeTimeZone, timeZoneName } from "@/lib/time";

type CountryPageProps = { params: Promise<{ country: string }> };

export const dynamicParams = false;
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return COUNTRY_TIME_PAGES.map((country) => ({ country: country.slug }));
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const country = countryTimeBySlug(slug);
  if (!country) return {};
  const override = await getPageSeo(`/time-in/${country.slug}`);
  return buildPageMetadata({
    title: override?.seo_title || countrySeoTitle(country),
    description: override?.meta_description || countrySeoDescription(country),
    path: `/time-in/${country.slug}`,
    absoluteTitle: true,
  });
}

export default async function CountryTimePage({ params }: CountryPageProps) {
  const { country: slug } = await params;
  const country = countryTimeBySlug(slug);
  if (!country) notFound();

  const posts = await listPublishedPosts();
  const countryCities = CITIES.filter((city) => city.countryCode === country.countryCode);
  const relatedGuides = selectRelatedGuides(posts, { countryCode: country.countryCode });
  const now = new Date();
  const initialNow = now.toISOString();
  const pageUrl = absoluteUrl(`/time-in/${country.slug}`);
  const zoneFacts = country.zones.map((entry) => ({
    ...entry,
    details: describeTimeZone(now, entry.timeZone),
    name: timeZoneName(now, entry.timeZone),
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: countrySeoTitle(country),
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
            const zoneCities = citiesForCountryZone(country.countryCode, zone.timeZone);
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
                {zoneCities[0] ? (
                  <Link href={`/world-clock/${zoneCities[0].slug}`}>
                    {zoneCities[0].name} city clock
                  </Link>
                ) : null}
              </article>
            );
          })}
        </section>

        {countryCities.length ? (
          <section className="related-cities">
            <h2>City clocks in {country.name}</h2>
            <nav aria-label={`City clocks in ${country.name}`}>
              <div>{countryCities.map((city) => <Link key={city.slug} href={`/world-clock/${city.slug}`}>{city.name}</Link>)}</div>
            </nav>
          </section>
        ) : null}

        {relatedGuides.length ? (
          <section className="related-cities">
            <h2>Related time guides</h2>
            <div>{relatedGuides.map((guide) => <Link key={guide.slug} href={`/blog/${guide.slug}`}>{guide.title}</Link>)}</div>
          </section>
        ) : null}
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }} />
    </div>
  );
}
