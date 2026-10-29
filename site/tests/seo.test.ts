import { describe, expect, it } from "vitest";
import {
  SITE_ORIGIN,
  absoluteUrl,
  buildPageMetadata,
  buildWebApplicationJsonLd,
  buildWebsiteJsonLd,
  serializeJsonLd,
  buildArticleJsonLd,
  buildPostMetadata,
  buildBreadcrumbJsonLd,
  DEFAULT_SOCIAL_IMAGE,
} from "@/lib/seo";
import { fixturePost } from "@/lib/posts";

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
        images: [{ url: "https://www.aworldtime.com/opengraph-image", width: 1200, height: 630, alt: "AWORLDTIME.COM world clock" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Time Zone Converter",
        description: "Convert a date and time between cities and time zones.",
        images: ["https://www.aworldtime.com/opengraph-image"],
      },
    });
    expect(DEFAULT_SOCIAL_IMAGE).toBe("https://www.aworldtime.com/opengraph-image");
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

  it("builds a canonical breadcrumb list with one-based positions", () => {
    expect(buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "World clock", path: "/world-clock" },
      { name: "Paris", path: "/world-clock/paris" },
    ])).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.aworldtime.com/" },
        { "@type": "ListItem", position: 2, name: "World clock", item: "https://www.aworldtime.com/world-clock" },
        { "@type": "ListItem", position: 3, name: "Paris", item: "https://www.aworldtime.com/world-clock/paris" },
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

  it("builds canonical and social metadata for an article", () => {
    const post = fixturePost({
      slug: "meeting-times",
      featured_image_url: "https://images.example.com/meeting.webp",
      featured_image_alt: "People joining a global meeting",
    });
    const metadata = buildPostMetadata(post);

    expect(metadata.alternates).toEqual({ canonical: "https://www.aworldtime.com/blog/meeting-times" });
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      url: "https://www.aworldtime.com/blog/meeting-times",
      siteName: "AWORLDTIME.COM",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: ["https://images.example.com/meeting.webp"],
    });
  });

  it("preserves an external article canonical and noindex setting", () => {
    const metadata = buildPostMetadata(fixturePost({
      canonical_url: "https://example.com/original-guide",
      noindex: true,
    }));

    expect(metadata.alternates).toEqual({ canonical: "https://example.com/original-guide" });
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("connects Article schema to its canonical publisher", () => {
    expect(buildArticleJsonLd(fixturePost({ slug: "meeting-times" }))).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Article",
      mainEntityOfPage: "https://www.aworldtime.com/blog/meeting-times",
      publisher: {
        "@type": "Organization",
        "@id": "https://www.aworldtime.com/#organization",
        name: "AWORLDTIME.COM",
      },
    });
  });
});
