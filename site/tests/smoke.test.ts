import { describe, expect, it } from "vitest";
import { metadata } from "@/app/layout";

describe("AWORLDTIME application", () => {
  it("uses the public brand and description", () => {
    expect(metadata.title).toBe("AWORLDTIME.COM");
    expect(metadata.description).toBe(
      "Local time, world clocks, time conversion, and practical guides.",
    );
  });
});
