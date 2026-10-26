import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

describe("legacy URL redirects", () => {
  it("redirects the malformed homepage URL reported by Search Console", async () => {
    const redirects = await nextConfig.redirects?.();

    expect(redirects).toContainEqual({
      source: "/&",
      destination: "/",
      permanent: true,
    });
  });
});
