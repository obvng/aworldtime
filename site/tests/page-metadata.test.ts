import { describe, expect, it } from "vitest";
import { metadata as homeMetadata } from "@/app/page";
import { metadata as worldClockMetadata } from "@/app/world-clock/page";
import { metadata as converterMetadata } from "@/app/converter/page";
import { metadata as meetingMetadata } from "@/app/meeting-planner/page";
import { metadata as blogMetadata } from "@/app/blog/page";

const cases = [
  [homeMetadata, "World Clock, Time Zone Converter & Meeting Planner", "https://www.aworldtime.com/"],
  [worldClockMetadata, "World Clock: Current Time Around the World", "https://www.aworldtime.com/world-clock"],
  [converterMetadata, "Time Zone Converter: Compare Times Worldwide", "https://www.aworldtime.com/converter"],
  [meetingMetadata, "World Meeting Planner Across Time Zones", "https://www.aworldtime.com/meeting-planner"],
  [blogMetadata, "Time Zone, Travel and Meeting Guides", "https://www.aworldtime.com/blog"],
] as const;

describe("public page metadata", () => {
  it.each(cases)("publishes unique search and social metadata for %s", (metadata, title, url) => {
    expect(metadata.title).toBe(title);
    expect(metadata.description).toEqual(expect.any(String));
    expect(String(metadata.description).length).toBeGreaterThan(50);
    expect(metadata.alternates).toEqual({ canonical: url });
    expect(metadata.openGraph).toMatchObject({ title, url });
    expect(metadata.twitter).toMatchObject({ title, card: "summary_large_image" });
  });
});
