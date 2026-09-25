import { describe, expect, it } from "vitest";
import { normalizeSlug, postSchema } from "@/lib/post-validation";

describe("admin post validation", () => {
  it("rejects a post without a title", () => {
    const result = postSchema.safeParse({ title: "", slug: "missing-title", content: "Body", status: "draft" });
    expect(result.success).toBe(false);
  });

  it("normalizes a safe slug", () => {
    expect(normalizeSlug("  Meeting Across Time Zones ")).toBe("meeting-across-time-zones");
  });

  it("requires a publication date for scheduled posts", () => {
    const result = postSchema.safeParse({ title: "Scheduled guide", slug: "scheduled-guide", content: "Body", status: "scheduled", published_at: "" });
    expect(result.success).toBe(false);
  });

  it("requires alt text when a featured image URL exists", () => {
    const result = postSchema.safeParse({
      title: "Lagos guide",
      slug: "lagos-guide",
      content: "Body",
      status: "draft",
      featured_image_url: "https://example.com/lagos.webp",
      featured_image_alt: "",
    });

    expect(result.success).toBe(false);
  });
});
