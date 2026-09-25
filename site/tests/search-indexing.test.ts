import { beforeEach, describe, expect, it, vi } from "vitest";
import { fixturePost } from "@/lib/posts";
import robots from "@/app/robots";

const { listPublishedPosts } = vi.hoisted(() => ({ listPublishedPosts: vi.fn() }));

vi.mock("@/lib/posts", async () => {
  const actual = await vi.importActual<typeof import("@/lib/posts")>("@/lib/posts");
  return { ...actual, listPublishedPosts };
});

describe("search indexing documents", () => {
  beforeEach(() => {
    listPublishedPosts.mockReset();
  });

  it("points crawlers to the canonical www host and blocks private routes", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/preview/"],
      },
      sitemap: "https://www.aworldtime.com/sitemap.xml",
      host: "https://www.aworldtime.com",
    });
  });

  it("returns canonical public routes with stable modification dates", async () => {
    listPublishedPosts.mockResolvedValue([]);
    const { default: sitemap } = await import("@/app/sitemap");
    const entries = await sitemap();

    expect(entries.map((entry) => entry.url)).toEqual([
      "https://www.aworldtime.com/",
      "https://www.aworldtime.com/world-clock",
      "https://www.aworldtime.com/converter",
      "https://www.aworldtime.com/meeting-planner",
      "https://www.aworldtime.com/blog",
    ]);
    expect(entries.every((entry) => new Date(entry.lastModified as Date).toISOString() === "2026-09-25T00:00:00.000Z")).toBe(true);
    expect(entries.some((entry) => entry.url.includes("/admin"))).toBe(false);
  });

  it("includes only indexable articles and uses their update dates", async () => {
    listPublishedPosts.mockResolvedValue([
      fixturePost({ slug: "public-guide", updated_at: "2026-09-24T12:00:00.000Z" }),
      fixturePost({ slug: "private-guide", noindex: true, updated_at: "2026-09-24T13:00:00.000Z" }),
    ]);
    const { default: sitemap } = await import("@/app/sitemap");
    const entries = await sitemap();
    const articles = entries.filter((entry) => entry.url.includes("/blog/") && entry.url !== "https://www.aworldtime.com/blog");

    expect(articles).toEqual([{ 
      url: "https://www.aworldtime.com/blog/public-guide",
      lastModified: new Date("2026-09-24T12:00:00.000Z"),
      changeFrequency: "monthly",
    }]);
  });
});
