import { render, screen } from "@testing-library/react";
import { Children, isValidElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { CityLiveClock } from "@/components/city-live-clock";
import { CITIES } from "@/lib/cities";

vi.mock("@/lib/page-seo", () => ({
  getPageSeo: vi.fn().mockResolvedValue(null),
}));

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
    }
  });

  it("builds city-specific canonical metadata", async () => {
    const { generateMetadata } = await import("@/app/world-clock/[city]/page");
    const metadata = await generateMetadata({ params: Promise.resolve({ city: "lagos" }) });

    expect(metadata.title).toContain("Lagos");
    expect(metadata.description).toContain("UTC+01:00");
    expect(metadata.description).toContain("sunrise");
    expect(metadata.alternates?.canonical).toBe("https://www.aworldtime.com/world-clock/lagos");
  });

  it("renders page-specific time, DST, sunrise and sunset facts", async () => {
    const { default: CityPage } = await import("@/app/world-clock/[city]/page");
    const page = await CityPage({ params: Promise.resolve({ city: "lagos" }) });
    expect(findLiveClock(page)).toEqual({ timeZone: "Africa/Lagos" });
    render(page);

    expect(screen.getByRole("heading", { level: 1, name: /current time in lagos/i })).toBeVisible();
    expect(screen.getByText("UTC+01:00")).toBeVisible();
    expect(screen.getByText(/does not observe daylight saving time/i)).toBeVisible();
    expect(screen.getByText(/^Sunrise on/)).toBeVisible();
    expect(screen.getByText(/^Sunset on/)).toBeVisible();
    expect(screen.getByText(/Sunrise on \d{2} \w+ \d{4}/)).toBeVisible();
  });
});
