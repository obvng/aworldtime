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
    expect(headers.get("Content-Security-Policy")).toContain("form-action 'self'");
  });

  it("prevents admin pages and APIs from being stored in shared caches", async () => {
    const headerRules = await nextConfig.headers?.();
    const protectedRules = headerRules?.filter((rule) => rule.source.startsWith("/admin") || rule.source.startsWith("/api/admin"));

    expect(protectedRules).toHaveLength(2);
    for (const rule of protectedRules ?? []) {
      expect(new Map(rule.headers.map(({ key, value }) => [key, value])).get("Cache-Control")).toBe("private, no-store, max-age=0");
    }
  });
});
