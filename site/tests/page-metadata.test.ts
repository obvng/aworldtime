import { describe, expect, it } from "vitest";

const cases = [
  [() => import("@/app/page"), "World Clock, Time Zone Converter & Meeting Planner", "https://www.aworldtime.com/"],
  [() => import("@/app/world-clock/page"), "World Clock: Current Time Around the World", "https://www.aworldtime.com/world-clock"],
  [() => import("@/app/converter/page"), "Time Zone Converter: Compare Times Worldwide", "https://www.aworldtime.com/converter"],
  [() => import("@/app/meeting-planner/page"), "World Meeting Planner Across Time Zones", "https://www.aworldtime.com/meeting-planner"],
  [() => import("@/app/blog/page"), "Time Zone, Travel and Meeting Guides", "https://www.aworldtime.com/blog"],
] as const;

describe("public page metadata", () => {
  it.each(cases)("publishes unique search and social metadata for %s", async (loadRoute, title, url) => {
    const metadata = await (await loadRoute()).generateMetadata();
    expect(metadata.title).toBe(title);
    expect(metadata.description).toEqual(expect.any(String));
    expect(String(metadata.description).length).toBeGreaterThan(50);
    expect(metadata.alternates).toEqual({ canonical: url });
    expect(metadata.openGraph).toMatchObject({ title, url });
    expect(metadata.openGraph).toMatchObject({ images: [expect.objectContaining({ url: "https://www.aworldtime.com/opengraph-image", width: 1200, height: 630 })] });
    expect(metadata.twitter).toMatchObject({ title, card: "summary_large_image", images: ["https://www.aworldtime.com/opengraph-image"] });
  });
});
