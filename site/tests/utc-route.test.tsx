import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("UTC route", () => {
  it("uses stable self-canonical metadata", async () => {
    const { generateMetadata } = await import("@/app/utc/page");
    const metadata = generateMetadata();

    expect(metadata.title).toEqual({ absolute: "UTC Time Now: Current Coordinated Universal Time" });
    expect(metadata.description).toBe("See the current UTC time and compare major world time zones against Coordinated Universal Time.");
    expect(metadata.alternates?.canonical).toBe("https://www.aworldtime.com/utc");
  });

  it("renders UTC and at least ten unique comparison zones in the initial page", async () => {
    const { default: UtcPage } = await import("@/app/utc/page");
    const { UTC_COMPARISON_ZONES } = await import("@/lib/utc-comparisons");
    render(await UtcPage());

    expect(new Set(UTC_COMPARISON_ZONES.map((zone) => zone.timeZone)).size).toBeGreaterThanOrEqual(10);
    expect(screen.getByRole("heading", { level: 1, name: /utc time now/i })).toBeVisible();
    expect(screen.getByTestId("utc-live-clock")).toHaveTextContent(/\d{2}:\d{2}:\d{2} (AM|PM)/);
    expect(screen.getAllByTestId("utc-comparison-row")).toHaveLength(UTC_COMPARISON_ZONES.length);
    expect(screen.getAllByText("UTC+00:00").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Africa/Lagos")).toBeVisible();
    expect(screen.getByText("Asia/Tokyo")).toBeVisible();
  });
});
