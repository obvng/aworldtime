import { describe, expect, it } from "vitest";

import { CITIES, POPULAR_CITIES, skylineForCity } from "@/lib/cities";

describe("city presentation data", () => {
  it("gives every catalogue city a skyline", () => {
    expect(CITIES).toHaveLength(19);
    expect(
      CITIES.every((city) => city.skylineImage.startsWith("/cities/")),
    ).toBe(true);
  });

  it("uses the approved six popular cities", () => {
    expect(POPULAR_CITIES.map((city) => city.name)).toEqual([
      "London",
      "New York",
      "Dubai",
      "Tokyo",
      "Toronto",
      "Beijing",
    ]);
  });

  it("uses a generic skyline when the city is not in the catalogue", () => {
    expect(skylineForCity()).toBe("/cities/fallback.webp");
  });
});
