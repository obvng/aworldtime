import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

describe("security response headers", () => {
  it("prevents browsers from sniffing uploaded content as executable code", async () => {
    const headerRules = await nextConfig.headers?.();
    const globalRule = headerRules?.find((rule) => rule.source === "/(.*)");
    const headers = new Map(globalRule?.headers.map(({ key, value }) => [key, value]));

    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("Content-Security-Policy")).toContain("object-src 'none'");
    expect(headers.get("Content-Security-Policy")).toContain("base-uri 'self'");
    expect(headers.get("Content-Security-Policy")).toContain("frame-ancestors 'none'");
  });
});
