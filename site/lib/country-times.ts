import { CITIES } from "@/lib/cities";
import ianaCountryData from "@/lib/iana-country-zones.generated.json";
import { describeTimeZone } from "@/lib/time";

export type CountryZone = { timeZone: string; regions: string };
export type CountryTimePage = {
  slug: string;
  name: string;
  countryCode: string;
  summary: string;
  updatedAt: string;
  zones: CountryZone[];
};

const UPDATED_AT = ianaCountryData.generatedAt;
const IANA_COUNTRY_ZONES = ianaCountryData.countries as Record<string, CountryZone[]>;

const COUNTRY_OVERRIDES: Record<string, { slug?: string; name?: string; summary?: string }> = {
  BR: { summary: "Brazil spans several time zones across the mainland and its Atlantic islands. The zone list below shows which clock applies in each region." },
  CA: { summary: "Canada spans several time zones from Newfoundland to the Pacific and Yukon. Some regions keep a fixed offset while others change clocks seasonally." },
  CL: { summary: "Chile has separate IANA zones for the mainland, Aysén, Magallanes and Easter Island. Their seasonal clock rules do not always match." },
  FR: { summary: "This page covers mainland France, which follows Europe/Paris. Overseas territories have their own country codes and are not grouped here." },
  TR: { slug: "turkey", name: "Turkey" },
  US: { summary: "The United States spans several time zones across the mainland, Alaska, the Aleutian Islands and Hawaii. Arizona and Hawaii do not follow the seasonal clock changes used in most states." },
};

function countrySlug(name: string) {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function buildCountryPages(): CountryTimePage[] {
  const countryNames = new Map<string, string>();
  for (const city of CITIES) countryNames.set(city.countryCode, city.country);

  return [...countryNames.entries()].map(([countryCode, catalogueName]) => {
    const override = COUNTRY_OVERRIDES[countryCode];
    const name = override?.name ?? catalogueName;
    const ianaZones = IANA_COUNTRY_ZONES[countryCode];
    if (!ianaZones?.length) throw new Error(`No IANA zone1970 data found for ${countryCode}`);
    const zones = ianaZones.map((zone) => ({
      ...zone,
      regions: ianaZones.length === 1 && zone.regions === "All areas represented by this IANA country code"
        ? `All of ${name}`
        : zone.regions,
    }));
    const summary = override?.summary ?? (zones.length === 1
      ? `${name} is represented by ${zones[0].timeZone} in the IANA time-zone database.`
      : `${name} has ${zones.length} IANA time zones. Each clock below shows the current time and UTC offset for its region.`);
    return {
      slug: override?.slug ?? countrySlug(name), name, countryCode, summary,
      updatedAt: UPDATED_AT, zones,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}

export const COUNTRY_TIME_PAGES = buildCountryPages();

export function countryTimeBySlug(slug: string) {
  return COUNTRY_TIME_PAGES.find((country) => country.slug === slug);
}

export function countryTimeByCode(code: string) {
  const normalized = code.trim().toUpperCase();
  return COUNTRY_TIME_PAGES.find((country) => country.countryCode === normalized);
}

function currentZoneFacts(country: CountryTimePage, date: Date) {
  return country.zones.map((zone) => ({ zone, details: describeTimeZone(date, zone.timeZone) }));
}

export function countrySeoTitle(country: CountryTimePage, date = new Date()) {
  if (country.zones.length > 1) return `Time in ${country.name} Now: ${country.zones.length} Time Zones and UTC Offsets`;
  const [{ details }] = currentZoneFacts(country, date);
  return `Time in ${country.name} Now: ${details.offsetLabel} and Local Time`;
}

export function countrySeoDescription(country: CountryTimePage, date = new Date()) {
  const facts = currentZoneFacts(country, date);
  const offsets = [...new Set(facts.map(({ details }) => details.offsetLabel))]
    .sort((a, b) => facts.find(({ details }) => details.offsetLabel === a)!.details.offsetMinutes - facts.find(({ details }) => details.offsetLabel === b)!.details.offsetMinutes);
  const zonesWithChanges = facts.filter(({ details }) => details.nextTransition).length;
  const clockCopy = zonesWithChanges
    ? `${zonesWithChanges} ${zonesWithChanges === 1 ? "zone has" : "zones have"} a scheduled clock change.`
    : "No seasonal clock change is currently scheduled.";

  if (country.zones.length === 1) {
    return `${country.summary} ${country.zones[0].timeZone} currently uses ${offsets[0]}. ${clockCopy}`;
  }
  const offsetCopy = offsets.length === 1 ? offsets[0] : `${offsets[0]} to ${offsets.at(-1)}`;
  const lead = country.summary.split(".")[0];
  const offsetSentence = /IANA time zones/i.test(lead)
    ? `Current UTC offsets run from ${offsetCopy}.`
    : `Its ${country.zones.length} IANA zones currently run from ${offsetCopy}.`;
  return `${lead}. ${offsetSentence} ${clockCopy}`;
}

export function citiesForCountryZone(countryCode: string, timeZone: string) {
  const normalizedCode = countryCode.trim().toUpperCase();
  return CITIES.filter((city) => city.countryCode === normalizedCode && city.timeZone === timeZone);
}
