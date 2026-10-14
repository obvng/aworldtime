import { describe, expect, it } from "vitest";
import { normalizeConverterPair, resolveConverterSelections } from "@/lib/converter-usage";

describe("converter URL and usage data", () => {
  it("resolves valid city slugs and falls back safely", () => {
    expect(resolveConverterSelections({ from: "lagos", to: "london" })).toEqual({ from: "lagos", to: "london" });
    expect(resolveConverterSelections({ from: "unknown", to: "dubai" })).toEqual({ from: "lagos", to: "dubai" });
  });

  it("stores an unordered canonical pair", () => {
    expect(normalizeConverterPair("london", "lagos")).toEqual({ cityA: "lagos", cityB: "london" });
    expect(normalizeConverterPair("lagos", "london")).toEqual({ cityA: "lagos", cityB: "london" });
    expect(() => normalizeConverterPair("lagos", "lagos")).toThrow();
  });
});
