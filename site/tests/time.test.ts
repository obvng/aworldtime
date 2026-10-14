import { describe, expect, it } from "vitest";
import { countryCodeToFlag } from "@/lib/cities";
import {
  cityForTimeZone,
  convertWallTime,
  describeTimeZone,
  formatDate,
  formatTime,
  formatTimeWithPeriod,
  getSolarTimes,
} from "@/lib/time";

describe("world time helpers", () => {
  const instant = new Date("2026-09-24T13:27:00Z");

  it("maps a browser time zone to its representative city", () => {
    expect(cityForTimeZone("Africa/Lagos")?.name).toBe("Lagos");
  });

  it("turns an ISO country code into its flag", () => {
    expect(countryCodeToFlag("NG")).toBe("🇳🇬");
    expect(countryCodeToFlag("gb")).toBe("🇬🇧");
    expect(countryCodeToFlag("")).toBe("");
  });

  it("formats one instant in different zones", () => {
    expect(formatTime(instant, "Africa/Lagos", false)).toBe("14:27");
    expect(formatTime(instant, "America/New_York", false)).toBe("09:27");
  });

  it("formats display clocks with the correct AM or PM period", () => {
    expect(formatTimeWithPeriod(instant, "Africa/Lagos", false)).toEqual({
      time: "02:27",
      period: "PM",
    });
    expect(formatTimeWithPeriod(instant, "America/New_York", true)).toEqual({
      time: "09:27:00",
      period: "AM",
    });
  });

  it("formats the local calendar date", () => {
    expect(formatDate(instant, "Africa/Lagos")).toBe(
      "Thursday, 24 September 2026",
    );
  });

  it("converts a Lagos wall time to New York", () => {
    expect(
      convertWallTime({
        date: "2026-09-24",
        time: "14:27",
        from: "Africa/Lagos",
        to: "America/New_York",
      }).time,
    ).toBe("09:27");
  });

  it("uses daylight-saving offsets for the selected date", () => {
    expect(
      convertWallTime({
        date: "2026-01-15",
        time: "14:27",
        from: "Africa/Lagos",
        to: "America/New_York",
      }).time,
    ).toBe("08:27");
  });

  it("reports the destination date when conversion crosses midnight", () => {
    expect(
      convertWallTime({
        date: "2026-09-24",
        time: "23:30",
        from: "Africa/Lagos",
        to: "Asia/Tokyo",
      }),
    ).toEqual({ date: "2026-09-25", time: "07:30" });
  });

  it("reports the current UTC offset, DST state, and next transition", () => {
    const details = describeTimeZone(new Date("2026-01-15T12:00:00Z"), "Europe/London");

    expect(details.offsetLabel).toBe("UTC+00:00");
    expect(details.isDaylightSavingTime).toBe(false);
    expect(details.nextTransition?.toISOString()).toBe("2026-03-29T01:00:00.000Z");
    expect(details.nextOffsetLabel).toBe("UTC+01:00");
  });

  it("reports zones without daylight-saving transitions", () => {
    const details = describeTimeZone(new Date("2026-01-15T12:00:00Z"), "Africa/Lagos");

    expect(details.offsetLabel).toBe("UTC+01:00");
    expect(details.isDaylightSavingTime).toBe(false);
    expect(details.nextTransition).toBeNull();
  });

  it("calculates local sunrise and sunset from city coordinates", () => {
    const solar = getSolarTimes(new Date("2026-09-24T12:00:00Z"), {
      latitude: 6.5244,
      longitude: 3.3792,
      timeZone: "Africa/Lagos",
    });

    expect(solar.sunrise).toMatch(/^06:3\d$/);
    expect(solar.sunset).toBe("18:42");
    expect(solar.dayLengthMinutes).toBeGreaterThan(710);
    expect(solar.dayLengthMinutes).toBeLessThan(740);
  });
});
