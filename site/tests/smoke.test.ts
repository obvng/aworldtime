import { describe, expect, it } from "vitest";
import { metadata, viewport } from "@/app/layout";

describe("AWORLDTIME application", () => {
  it("uses the public brand and description", () => {
    expect(metadata.title).toEqual({
      default: "World Clock, Time Zone Converter & Meeting Planner | AWORLDTIME.COM",
      template: "%s | AWORLDTIME.COM",
    });
    expect(metadata.description).toBe(
      "Check local time worldwide, convert time zones, plan global meetings, and read practical time guides.",
    );
  });

  it("uses the device width on mobile screens", () => {
    expect(viewport.width).toBe("device-width");
    expect(viewport.initialScale).toBe(1);
  });
});
