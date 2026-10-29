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

const UPDATED_AT = "2026-10-29T00:00:00.000Z";

export const COUNTRY_TIME_PAGES: CountryTimePage[] = [
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
    summary: "Mainland France uses the Europe/Paris time zone. Overseas territories have their own country codes and are not grouped into this page.",
    updatedAt: UPDATED_AT,
    zones: [{ timeZone: "Europe/Paris", regions: "Mainland France" }],
  },
];

export function countryTimeBySlug(slug: string) {
  return COUNTRY_TIME_PAGES.find((country) => country.slug === slug);
}

export function countryTimeByCode(code: string) {
  const normalized = code.trim().toUpperCase();
  return COUNTRY_TIME_PAGES.find((country) => country.countryCode === normalized);
}
