import { CITIES } from "@/lib/cities";

export type CountryZone = {
  timeZone: string;
  regions: string;
};

export type CountryTimePage = {
  slug: string;
  name: string;
  countryCode: string;
  summary: string;
  updatedAt: string;
  zones: CountryZone[];
};

const UPDATED_AT = "2026-11-15T00:00:00.000Z";

const CURATED_COUNTRY_TIME_PAGES: CountryTimePage[] = [
  {
    slug: "brazil",
    name: "Brazil",
    countryCode: "BR",
    summary: "Brazil spans several time zones across the mainland and its Atlantic islands. The zone list below shows which clock applies in each region.",
    updatedAt: UPDATED_AT,
    zones: [
      { timeZone: "America/Noronha", regions: "Atlantic islands" },
      { timeZone: "America/Belem", regions: "Eastern Pará and Amapá" },
      { timeZone: "America/Fortaleza", regions: "Maranhão, Piauí, Ceará, Rio Grande do Norte and Paraíba" },
      { timeZone: "America/Recife", regions: "Pernambuco" },
      { timeZone: "America/Araguaina", regions: "Tocantins" },
      { timeZone: "America/Maceio", regions: "Alagoas and Sergipe" },
      { timeZone: "America/Bahia", regions: "Bahia" },
      { timeZone: "America/Sao_Paulo", regions: "Goiás, Federal District, Minas Gerais, Espírito Santo, Rio de Janeiro, São Paulo, Paraná, Santa Catarina and Rio Grande do Sul" },
      { timeZone: "America/Campo_Grande", regions: "Mato Grosso do Sul" },
      { timeZone: "America/Cuiaba", regions: "Mato Grosso" },
      { timeZone: "America/Santarem", regions: "Western Pará" },
      { timeZone: "America/Porto_Velho", regions: "Rondônia" },
      { timeZone: "America/Boa_Vista", regions: "Roraima" },
      { timeZone: "America/Manaus", regions: "Eastern Amazonas" },
      { timeZone: "America/Eirunepe", regions: "Western Amazonas" },
      { timeZone: "America/Rio_Branco", regions: "Acre" },
    ],
  },
  {
    slug: "bangladesh",
    name: "Bangladesh",
    countryCode: "BD",
    summary: "Bangladesh uses one national time zone. The same local time applies in Dhaka and throughout the country.",
    updatedAt: UPDATED_AT,
    zones: [{ timeZone: "Asia/Dhaka", regions: "All of Bangladesh" }],
  },
  {
    slug: "turkey",
    name: "Turkey",
    countryCode: "TR",
    summary: "Turkey uses one national time zone. Istanbul, Ankara and the rest of the country follow the same clock.",
    updatedAt: UPDATED_AT,
    zones: [{ timeZone: "Europe/Istanbul", regions: "All of Turkey" }],
  },
  {
    slug: "chile",
    name: "Chile",
    countryCode: "CL",
    summary: "Chile has separate IANA zones for most of the mainland, Aysén, Magallanes and Easter Island. Their seasonal clock rules do not always match.",
    updatedAt: UPDATED_AT,
    zones: [
      { timeZone: "America/Santiago", regions: "Most of Chile" },
      { timeZone: "America/Coyhaique", regions: "Aysén Region" },
      { timeZone: "America/Punta_Arenas", regions: "Magallanes Region" },
      { timeZone: "Pacific/Easter", regions: "Easter Island" },
    ],
  },
  {
    slug: "japan",
    name: "Japan",
    countryCode: "JP",
    summary: "Japan uses one national time zone. Tokyo, Osaka, Hokkaido and Okinawa all follow the same clock.",
    updatedAt: UPDATED_AT,
    zones: [{ timeZone: "Asia/Tokyo", regions: "All of Japan" }],
  },
  {
    slug: "germany",
    name: "Germany",
    countryCode: "DE",
    summary: "Most of Germany uses the Europe/Berlin zone. Büsingen has its own IANA identifier because of its position inside Switzerland.",
    updatedAt: UPDATED_AT,
    zones: [
      { timeZone: "Europe/Berlin", regions: "Most of Germany" },
      { timeZone: "Europe/Busingen", regions: "Büsingen am Hochrhein" },
    ],
  },
  {
    slug: "algeria",
    name: "Algeria",
    countryCode: "DZ",
    summary: "Algeria uses one national time zone. Algiers and every other region follow the same clock.",
    updatedAt: UPDATED_AT,
    zones: [{ timeZone: "Africa/Algiers", regions: "All of Algeria" }],
  },
  {
    slug: "france",
    name: "France",
    countryCode: "FR",
    summary: "This page covers mainland France, which follows Europe/Paris. Overseas territories have their own country codes and are not grouped here.",
    updatedAt: UPDATED_AT,
    zones: [{ timeZone: "Europe/Paris", regions: "Mainland France" }],
  },
  {
    slug: "canada",
    name: "Canada",
    countryCode: "CA",
    summary: "Canada spans several time zones from Newfoundland to the Pacific and Yukon. Some regions keep a fixed offset while others change clocks seasonally.",
    updatedAt: UPDATED_AT,
    zones: [
      { timeZone: "America/St_Johns", regions: "Newfoundland and southeastern Labrador" },
      { timeZone: "America/Halifax", regions: "Atlantic Canada" },
      { timeZone: "America/Toronto", regions: "Most of Ontario and Quebec" },
      { timeZone: "America/Winnipeg", regions: "Manitoba and northwestern Ontario" },
      { timeZone: "America/Regina", regions: "Most of Saskatchewan, which keeps standard time year-round" },
      { timeZone: "America/Edmonton", regions: "Alberta and parts of western Canada" },
      { timeZone: "America/Vancouver", regions: "Most of British Columbia" },
      { timeZone: "America/Whitehorse", regions: "Yukon" },
    ],
  },
  {
    slug: "united-states",
    name: "United States",
    countryCode: "US",
    summary: "The United States spans several time zones across the mainland, Alaska, the Aleutian Islands and Hawaii. Arizona and Hawaii do not follow the seasonal clock changes used in most states.",
    updatedAt: UPDATED_AT,
    zones: [
      { timeZone: "America/New_York", regions: "Eastern Time" },
      { timeZone: "America/Chicago", regions: "Central Time" },
      { timeZone: "America/Denver", regions: "Mountain Time" },
      { timeZone: "America/Phoenix", regions: "Most of Arizona, which keeps standard time year-round" },
      { timeZone: "America/Los_Angeles", regions: "Pacific Time" },
      { timeZone: "America/Anchorage", regions: "Most of Alaska" },
      { timeZone: "America/Adak", regions: "Western Aleutian Islands" },
      { timeZone: "Pacific/Honolulu", regions: "Hawaii, which keeps standard time year-round" },
    ],
  },
];

function countrySlug(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function derivedCountryPages(): CountryTimePage[] {
  const curatedCodes = new Set(CURATED_COUNTRY_TIME_PAGES.map((country) => country.countryCode));
  const countries = new Map<string, { name: string; zones: Map<string, string[]> }>();

  for (const city of CITIES) {
    if (curatedCodes.has(city.countryCode)) continue;
    const country = countries.get(city.countryCode) ?? { name: city.country, zones: new Map<string, string[]>() };
    const cities = country.zones.get(city.timeZone) ?? [];
    cities.push(city.name);
    country.zones.set(city.timeZone, cities);
    countries.set(city.countryCode, country);
  }

  return [...countries.entries()].map(([countryCode, country]) => {
    const zones = [...country.zones.entries()].map(([timeZone, cities]) => ({
      timeZone,
      regions: country.zones.size === 1 ? `All of ${country.name}` : `Areas using ${cities.join(", ")}'s time zone`,
    }));
    const summary = zones.length === 1
      ? `${country.name} uses one national time zone. The same local time applies across the country.`
      : `${country.name} uses more than one time zone. The clocks below show the zones represented by its city pages.`;
    return {
      slug: countrySlug(country.name),
      name: country.name,
      countryCode,
      summary,
      updatedAt: UPDATED_AT,
      zones,
    };
  });
}

export const COUNTRY_TIME_PAGES: CountryTimePage[] = [
  ...CURATED_COUNTRY_TIME_PAGES,
  ...derivedCountryPages(),
].sort((a, b) => a.name.localeCompare(b.name));

export function countryTimeBySlug(slug: string) {
  return COUNTRY_TIME_PAGES.find((country) => country.slug === slug);
}

export function countryTimeByCode(code: string) {
  const normalized = code.trim().toUpperCase();
  return COUNTRY_TIME_PAGES.find((country) => country.countryCode === normalized);
}

export function countrySeoTitle(country: CountryTimePage) {
  return country.zones.length > 1
    ? `Time in ${country.name} Now: Current Local Times by Region`
    : `Time in ${country.name} Now: Current Local Time`;
}

export function countrySeoDescription(country: CountryTimePage) {
  const lead = country.summary.split(".")[0];
  return country.zones.length > 1
    ? `${lead}. See all ${country.zones.length} IANA zones with current times, UTC offsets and DST rules.`
    : `${lead}. See its current local time, UTC offset, DST rules and next clock change.`;
}
export function citiesForCountryZone(countryCode: string, timeZone: string) {
  const normalizedCode = countryCode.trim().toUpperCase();
  return CITIES.filter((city) => city.countryCode === normalizedCode && city.timeZone === timeZone);
}
