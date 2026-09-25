import { describe, expect, it } from "vitest";
import { metadata } from "@/app/layout";

describe("site metadata", () => {
  it("publishes the Google Search Console verification token", () => {
    expect(metadata.verification).toEqual({
      google: "SsFYfch7pPzhqxvKb0WBvhV9_EJ2pC0DeP-DyrJ7UaE",
    });
  });
});
