import { describe, expect, it } from "vitest";
import { buildArticleJsonLd, buildPostMetadata, xmlEscape } from "@/lib/seo";
import { fixturePost, isPublicPost } from "@/lib/posts";

describe("blog publication and SEO", () => {
  it("excludes future scheduled posts", () => {
    const post = fixturePost({ status: "scheduled", published_at: "2099-01-01T00:00:00Z" });
    expect(isPublicPost(post, new Date("2026-09-24T00:00:00Z"))).toBe(false);
  });

  it("publishes posts whose publication date has arrived", () => {
    const post = fixturePost({ status: "published", published_at: "2026-09-23T00:00:00Z" });
    expect(isPublicPost(post, new Date("2026-09-24T00:00:00Z"))).toBe(true);
  });

  it("uses the SEO title and description when supplied", () => {
    const post = fixturePost({ title: "Article", seo_title: "Search title", meta_description: "Search description" });
    const metadata = buildPostMetadata(post);
    expect(metadata.title).toBe("Search title");
    expect(metadata.description).toBe("Search description");
  });

  it("adds image alt text to social metadata", () => {
    const post = fixturePost({ featured_image_url: "https://example.com/lagos.webp", featured_image_alt: "Lagos skyline at sunrise" });
    expect(buildPostMetadata(post).openGraph?.images).toEqual([{ url: post.featured_image_url, alt: post.featured_image_alt }]);
  });

  it("marks private search articles as no-index", () => {
    expect(buildPostMetadata(fixturePost({ noindex: true })).robots).toEqual({ index: false, follow: false });
  });

  it("builds article structured data with the canonical URL", () => {
    const post = fixturePost({ slug: "meeting-times" });
    expect(buildArticleJsonLd(post).mainEntityOfPage).toBe("https://aworldtime.com/blog/meeting-times");
  });

  it("escapes unsafe XML characters in RSS text", () => {
    expect(xmlEscape("Time & <Date>")).toBe("Time &amp; &lt;Date&gt;");
  });
});
