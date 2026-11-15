import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";
import { GET as obsoleteHostingPage } from "@/app/cgi-sys/suspendedpage.cgi/route";

describe("legacy URL redirects", () => {
  it("redirects the malformed homepage URL reported by Search Console", async () => {
    const redirects = await nextConfig.redirects?.();

    expect(redirects).toContainEqual({
      source: "/&",
      destination: "/",
      permanent: true,
    });
  });

  it("retires the obsolete cPanel suspension URL with 410 Gone", () => {
    const response = obsoleteHostingPage();

    expect(response.status).toBe(410);
  });
});
