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

const COMPARISON_ZONES = [
  { label: "UTC", timeZone: "UTC" },
  { label: "London", timeZone: "Europe/London" },
  { label: "New York", timeZone: "America/New_York" },
  { label: "Lagos", timeZone: "Africa/Lagos" },
] as const;

function durationLabel(minutes: number) {
  if (minutes === 0) return "the same time";
  const absolute = Math.abs(minutes);
  const hours = Math.floor(absolute / 60);
  const remaining = absolute % 60;
  const amount = [hours ? `${hours} ${hours === 1 ? "hour" : "hours"}` : "", remaining ? `${remaining} minutes` : ""].filter(Boolean).join(" ");
  return `${amount} ${minutes > 0 ? "ahead" : "behind"}`;
}

function comparisonLabel(countryOffsets: number[], referenceOffset: number) {
  const differences = [...new Set(countryOffsets.map((offset) => offset - referenceOffset))].sort((a, b) => a - b);
  if (differences.length === 1) return durationLabel(differences[0]);
  return `${durationLabel(differences[0])} to ${durationLabel(differences.at(-1)!)}`;
}

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

  const [posts, pageSeo] = await Promise.all([
    listPublishedPosts(),
    getPageSeo(`/time-in/${country.slug}`),
  ]);
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
  const countryOffsets = zoneFacts.map((zone) => zone.details.offsetMinutes);
  const comparisons = COMPARISON_ZONES.map((reference) => ({
    ...reference,
    difference: comparisonLabel(countryOffsets, describeTimeZone(now, reference.timeZone).offsetMinutes),
  }));
  const changingZones = zoneFacts.filter((zone) => zone.details.nextTransition);
  const nextChange = changingZones
    .filter((zone) => zone.details.nextTransition)
    .sort((left, right) => left.details.nextTransition!.getTime() - right.details.nextTransition!.getTime())[0];
  const offsetLabels = [...new Set(zoneFacts.map((zone) => zone.details.offsetLabel))];
  const offsetAnswer = offsetLabels.length === 1
    ? `${country.name} currently uses ${offsetLabels[0]}.`
    : `${country.name}'s current offsets run from ${offsetLabels[0]} to ${offsetLabels.at(-1)} across ${country.zones.length} IANA zones.`;
  const dstAnswer = changingZones.length
    ? `${changingZones.length} of ${country.zones.length} ${changingZones.length === 1 ? "zone has" : "zones have"} a seasonal clock change scheduled.`
    : `No seasonal clock change is scheduled in the IANA zones listed for ${country.name}.`;
  const nextChangeAnswer = nextChange?.details.nextTransition
    ? `The next scheduled change is in ${nextChange.regions} on ${new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: nextChange.timeZone }).format(nextChange.details.nextTransition)}, when the offset becomes ${nextChange.details.nextOffsetLabel}.`
    : `No future seasonal clock change is currently scheduled for ${country.name}.`;
  const faqs = [
    { question: `How many time zones does ${country.name} use?`, answer: `${country.name} has ${country.zones.length} ${country.zones.length === 1 ? "IANA time zone" : "IANA time zones"} on this page: ${country.zones.map((zone) => zone.timeZone).join(", ")}.` },
    { question: `What is the UTC offset in ${country.name}?`, answer: offsetAnswer },
    { question: `Does ${country.name} use daylight saving time?`, answer: dstAnswer },
    { question: `When is the next clock change in ${country.name}?`, answer: nextChangeAnswer },
  ];
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
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

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

        {pageSeo?.country_text ? (
          <section className="country-time-copy">
            <h2>About time in {country.name}</h2>
            <p>{pageSeo.country_text}</p>
          </section>
        ) : null}

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
                  <div><dt>Daylight saving</dt><dd>{zone.details.nextTransition ? (zone.details.isDaylightSavingTime ? "In effect" : "Not in effect") : "Fixed year-round"}</dd></div>
                </dl>
                <p className="country-zone-change">
                  {zone.details.nextTransition
                    ? `Next clock change: ${transition} to ${zone.details.nextOffsetLabel}.`
                    : `${zone.timeZone} uses a permanent ${zone.details.offsetLabel} offset with no scheduled seasonal clock change.`}
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

        <section className="country-time-copy">
          <h2>Time differences from {country.name}</h2>
          <p>These differences use the current offsets. They can change when another country moves its clocks.</p>
          <dl className="country-comparison-list">
            {comparisons.map((comparison) => (
              <div key={comparison.label}><dt>{country.name} compared with {comparison.label}</dt><dd>{comparison.difference}</dd></div>
            ))}
          </dl>
        </section>

        {countryCities.length ? (
          <section className="related-cities">
            <h2>Major city clocks in {country.name}</h2>
            <nav aria-label={`City clocks in ${country.name}`}>
              <div>{countryCities.map((city) => <Link key={city.slug} href={`/world-clock/${city.slug}`}>{city.name}</Link>)}</div>
            </nav>
          </section>
        ) : null}

        <section className="country-time-copy">
          <h2>Questions about time in {country.name}</h2>
          <div className="country-faq-list">
            {faqs.map((faq) => <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}
          </div>
        </section>

        {relatedGuides.length ? (
          <section className="related-cities">
            <h2>Related time guides</h2>
            <div>{relatedGuides.map((guide) => <Link key={guide.slug} href={`/blog/${guide.slug}`}>{guide.title}</Link>)}</div>
          </section>
        ) : null}
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }} />
    </div>
  );
}
