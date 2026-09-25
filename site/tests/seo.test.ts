import { describe, expect, it } from "vitest";
import {
  SITE_ORIGIN,
  absoluteUrl,
  buildPageMetadata,
  buildWebApplicationJsonLd,
  buildWebsiteJsonLd,
  serializeJsonLd,
} from "@/lib/seo";

describe("shared SEO helpers", () => {
  it("uses the canonical www origin for internal URLs", () => {
    expect(SITE_ORIGIN).toBe("https://www.aworldtime.com");
    expect(absoluteUrl("/converter")).toBe("https://www.aworldtime.com/converter");
  });

  it("builds canonical and social metadata for a public page", () => {
    expect(buildPageMetadata({
      title: "Time Zone Converter",
      description: "Convert a date and time between cities and time zones.",
      path: "/converter",
    })).toMatchObject({
      alternates: { canonical: "https://www.aworldtime.com/converter" },
      openGraph: {
        title: "Time Zone Converter",
        description: "Convert a date and time between cities and time zones.",
        url: "https://www.aworldtime.com/converter",
        siteName: "AWORLDTIME.COM",
      },
      twitter: {
        card: "summary_large_image",
        title: "Time Zone Converter",
        description: "Convert a date and time between cities and time zones.",
      },
    });
  });

  it("builds linked website and organization schema", () => {
    expect(buildWebsiteJsonLd()).toMatchObject({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebSite", "@id": "https://www.aworldtime.com/#website" },
        { "@type": "Organization", "@id": "https://www.aworldtime.com/#organization" },
      ],
    });
  });

  it("escapes markup-significant characters in JSON-LD", () => {
    expect(serializeJsonLd({ name: "</script>" })).not.toContain("</script>");
    expect(serializeJsonLd({ name: "</script>" })).toContain("\\u003c/script>");
  });

  it("describes a free browser-based time tool", () => {
    expect(buildWebApplicationJsonLd(
      "Time Zone Converter",
      "Convert a date and time between cities.",
      "/converter",
    )).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Time Zone Converter",
      url: "https://www.aworldtime.com/converter",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
    });
  });
});
