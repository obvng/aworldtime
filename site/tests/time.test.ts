import { describe, expect, it } from "vitest";
import { countryCodeToFlag } from "@/lib/cities";
import {
  cityForTimeZone,
  convertWallTime,
  formatDate,
  formatTime,
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
});
