import { describe, expect, it } from "vitest";
import { COUNTRY_TIME_PAGES, countryTimeByCode, countryTimeBySlug } from "@/lib/country-times";

describe("country time catalogue", () => {
  it("contains only the eight demand-backed country routes", () => {
    expect(COUNTRY_TIME_PAGES.map((country) => country.slug)).toEqual([
      "brazil",
      "bangladesh",
      "turkey",
      "chile",
      "japan",
      "germany",
      "algeria",
      "france",
    ]);
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

  it("returns no page for an unsupported country", () => {
    expect(countryTimeBySlug("canada")).toBeUndefined();
    expect(countryTimeByCode("CA")).toBeUndefined();
  });
});
