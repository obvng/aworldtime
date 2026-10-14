import { describe, expect, it } from "vitest";
import { CITIES, cityBySlug } from "@/lib/cities";

describe("city page catalogue", () => {
  it("contains exactly 100 cities with unique, valid slugs", () => {
    expect(CITIES).toHaveLength(100);
    expect(new Set(CITIES.map((city) => city.slug)).size).toBe(100);
    expect(CITIES.every((city) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(city.slug))).toBe(true);
  });

  it("contains valid IANA zones, coordinates, and meaningful update dates", () => {
    for (const city of CITIES) {
      expect(() => new Intl.DateTimeFormat("en", { timeZone: city.timeZone })).not.toThrow();
      expect(city.latitude).toBeGreaterThanOrEqual(-90);
      expect(city.latitude).toBeLessThanOrEqual(90);
      expect(city.longitude).toBeGreaterThanOrEqual(-180);
      expect(city.longitude).toBeLessThanOrEqual(180);
      expect(Number.isNaN(Date.parse(city.contentUpdatedAt))).toBe(false);
    }
  });

  it("finds a city by its public slug", () => {
    expect(cityBySlug("new-york")?.timeZone).toBe("America/New_York");
    expect(cityBySlug("does-not-exist")).toBeUndefined();
  });
});
