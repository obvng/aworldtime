import { describe, expect, it } from "vitest";
import { metadata } from "@/app/layout";

describe("site metadata", () => {
  it("publishes the Google Search Console verification token", () => {
    expect(metadata.verification).toEqual({
      google: "SsFYfch7pPzhqxvKb0WBvhV9_EJ2pC0DeP-DyrJ7UaE",
    });
  });

  it("publishes canonical site-wide defaults", () => {
    expect(metadata.metadataBase?.toString()).toBe("https://www.aworldtime.com/");
    expect(metadata.applicationName).toBe("AWORLDTIME.COM");
    expect(metadata.alternates).toMatchObject({
      types: { "application/rss+xml": "https://www.aworldtime.com/feed.xml" },
    });
    expect(metadata.title).toMatchObject({
      default: "World Clock, Time Zone Converter & Meeting Planner | AWORLDTIME.COM",
      template: "%s | AWORLDTIME.COM",
    });
  });
});
