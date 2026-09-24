import { describe, expect, it } from "vitest";
import { mapWeatherCode, parseWeatherResponse } from "@/lib/weather";

describe("weather adapter", () => {
  it("maps a clear-sky code", () => {
    expect(mapWeatherCode(0)).toBe("Clear");
  });

  it("uses a neutral label for an unknown code", () => {
    expect(mapWeatherCode(999)).toBe("Current conditions");
  });

  it("rejects an incomplete upstream response", () => {
    expect(parseWeatherResponse({ current: { temperature_2m: null } })).toBeNull();
  });

  it("returns the concise weather summary", () => {
    expect(parseWeatherResponse({ current: { temperature_2m: 31.6, weather_code: 2 } })).toEqual({
      temperatureC: 32,
      condition: "Partly cloudy",
    });
  });
});
