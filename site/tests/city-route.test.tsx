import { render, screen } from "@testing-library/react";
import { Children, isValidElement, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CityLiveClock } from "@/components/city-live-clock";
import { CITIES } from "@/lib/cities";

const { getPageSeo } = vi.hoisted(() => ({ getPageSeo: vi.fn() }));

vi.mock("@/lib/page-seo", () => ({ getPageSeo }));

function findLiveClock(node: ReactNode): Record<string, unknown> | null {
  if (!isValidElement(node)) return null;
  if (node.type === CityLiveClock) return node.props as Record<string, unknown>;
  for (const child of Children.toArray((node.props as { children?: ReactNode }).children)) {
    const found = findLiveClock(child);
    if (found) return found;
  }
  return null;
}

describe("generated city route", () => {
  afterEach(() => {
    getPageSeo.mockReset();
    getPageSeo.mockResolvedValue(null);
    vi.useRealTimers();
  });

  it("prebuilds exactly the 100 catalogue slugs", async () => {
    const { generateStaticParams } = await import("@/app/world-clock/[city]/page");
    const params = await generateStaticParams();

    expect(params).toHaveLength(100);
    expect(params).toContainEqual({ city: "lagos" });
  });

  it("gives every city a self-referencing canonical and no noindex directive", async () => {
    const { generateMetadata } = await import("@/app/world-clock/[city]/page");
    for (const city of CITIES) {
      const metadata = await generateMetadata({ params: Promise.resolve({ city: city.slug }) });
      expect(metadata.alternates?.canonical).toBe(`https://www.aworldtime.com/world-clock/${city.slug}`);
      expect(metadata.robots).not.toMatchObject({ index: false });
      const fullTitle = `Time in ${city.name}, ${city.country}: Current Local Time and UTC Offset`;
      const expectedTitle = fullTitle.length <= 70 ? fullTitle : `Time in ${city.name}: Current Local Time and UTC Offset`;
      expect(metadata.title).toBe(expectedTitle);
      expect(String(metadata.title).length).toBeLessThanOrEqual(70);
      expect(String(metadata.title)).not.toContain("AWORLDTIME.COM");
      expect(String(metadata.title)).not.toContain("Daylight");
    }
  });

  it("builds city-specific canonical metadata", async () => {
    getPageSeo.mockResolvedValue(null);
    const { generateMetadata } = await import("@/app/world-clock/[city]/page");
    const metadata = await generateMetadata({ params: Promise.resolve({ city: "lagos" }) });

    expect(metadata.title).toContain("Lagos");
    expect(metadata.description).toBe("Check the current local time in Lagos, Nigeria, plus its UTC offset, daylight-saving status, sunrise and sunset today.");
    expect(metadata.alternates?.canonical).toBe("https://www.aworldtime.com/world-clock/lagos");
  });

  it("keeps generated descriptions stable when a city enters daylight saving time", async () => {
    getPageSeo.mockResolvedValue(null);
    vi.useFakeTimers();
    const { generateMetadata } = await import("@/app/world-clock/[city]/page");

    vi.setSystemTime(new Date("2026-01-15T12:00:00.000Z"));
    const winter = await generateMetadata({ params: Promise.resolve({ city: "london" }) });
    vi.setSystemTime(new Date("2026-07-15T12:00:00.000Z"));
    const summer = await generateMetadata({ params: Promise.resolve({ city: "london" }) });

    expect(winter.description).toBe("Check the current local time in London, United Kingdom, plus its UTC offset, daylight-saving status, sunrise and sunset today.");
    expect(summer.description).toBe(winter.description);
  });

  it("renders page-specific time, DST, sunrise and sunset facts", async () => {
    getPageSeo.mockResolvedValue(null);
    const { default: CityPage } = await import("@/app/world-clock/[city]/page");
    const page = await CityPage({ params: Promise.resolve({ city: "lagos" }) });
    expect(findLiveClock(page)).toMatchObject({ timeZone: "Africa/Lagos", initialNow: expect.any(String) });
    render(page);

    expect(screen.getByRole("heading", { level: 1, name: /current time in lagos/i })).toBeVisible();
    expect(screen.getByText("UTC+01:00")).toBeVisible();
    expect(screen.getByText(/does not observe daylight saving time/i)).toBeVisible();
    expect(screen.getByText(/^Sunrise on/)).toBeVisible();
    expect(screen.getByText(/^Sunset on/)).toBeVisible();
    expect(screen.getByText(/Sunrise on \d{2} \w+ \d{4}/)).toBeVisible();
  });
});
