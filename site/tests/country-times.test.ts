import { describe, expect, it } from "vitest";
import { CITIES } from "@/lib/cities";
import { COUNTRY_TIME_PAGES, citiesForCountryZone, countryTimeByCode, countryTimeBySlug } from "@/lib/country-times";

describe("country time catalogue", () => {
  it("contains a country route for every country represented by a city page", () => {
    const cityCountryCodes = [...new Set(CITIES.map((city) => city.countryCode))].sort();
    const pageCountryCodes = COUNTRY_TIME_PAGES.map((country) => country.countryCode).sort();

    expect(pageCountryCodes).toEqual(cityCountryCodes);
  });

  it("uses IANA zones supported by the production JavaScript runtime", () => {
    for (const country of COUNTRY_TIME_PAGES) {
      for (const zone of country.zones) {
        expect(() => new Intl.DateTimeFormat("en", { timeZone: zone.timeZone }), `${country.countryCode}: ${zone.timeZone}`).not.toThrow();
      }
    }
  });

  it("keeps every IANA zone listed for Brazil", () => {
    expect(countryTimeBySlug("brazil")?.zones.map((zone) => zone.timeZone)).toEqual([
      "America/Noronha",
      "America/Belem",
      "America/Fortaleza",
      "America/Recife",
      "America/Araguaina",
      "America/Maceio",
      "America/Bahia",
      "America/Sao_Paulo",
      "America/Campo_Grande",
      "America/Cuiaba",
      "America/Santarem",
      "America/Porto_Velho",
      "America/Boa_Vista",
      "America/Manaus",
      "America/Eirunepe",
      "America/Rio_Branco",
    ]);
  });

  it("keeps Chile's four regional zone identifiers", () => {
    expect(countryTimeByCode("cl")?.zones.map((zone) => zone.timeZone)).toEqual([
      "America/Santiago",
      "America/Coyhaique",
      "America/Punta_Arenas",
      "Pacific/Easter",
    ]);
  });

  it.each([
    ["russia", 27],
    ["argentina", 12],
    ["mexico", 12],
    ["indonesia", 4],
    ["portugal", 3],
    ["china", 2],
    ["malaysia", 2],
    ["new-zealand", 2],
  ])("uses the complete IANA zone list for %s", (slug, count) => {
    expect(countryTimeBySlug(slug)?.zones).toHaveLength(count);
  });

  it("does not claim a multi-zone country uses one national time zone", () => {
    for (const slug of ["russia", "argentina", "mexico", "indonesia", "portugal", "china", "malaysia", "new-zealand"]) {
      expect(countryTimeBySlug(slug)?.summary).not.toMatch(/uses one national time zone/i);
    }
  });

  it.each([
    ["bangladesh", "Asia/Dhaka"],
    ["turkey", "Europe/Istanbul"],
    ["japan", "Asia/Tokyo"],
    ["algeria", "Africa/Algiers"],
    ["france", "Europe/Paris"],
  ])("maps %s to its single IANA zone", (slug, timeZone) => {
    expect(countryTimeBySlug(slug)?.zones).toEqual([
      expect.objectContaining({ timeZone }),
    ]);
  });

  it("adds pages for Canada and the United States", () => {
    expect(countryTimeBySlug("canada")?.zones.map((zone) => zone.timeZone)).toEqual(expect.arrayContaining([
      "America/Toronto",
      "America/Vancouver",
      "America/Regina",
    ]));
    expect(countryTimeByCode("US")?.zones.map((zone) => zone.timeZone)).toEqual(expect.arrayContaining([
      "America/New_York",
      "America/Chicago",
      "America/Los_Angeles",
      "America/Phoenix",
      "Pacific/Honolulu",
    ]));
  });

  it("gives every Brazilian IANA zone a matching city clock", () => {
    const brazil = countryTimeBySlug("brazil");
    expect(brazil).toBeDefined();

    for (const zone of brazil!.zones) {
      expect(citiesForCountryZone("BR", zone.timeZone).length, zone.timeZone).toBeGreaterThan(0);
    }
  });
});
