import { beforeEach, describe, expect, it, vi } from "vitest";
import { fixturePost } from "@/lib/posts";
import robots from "@/app/robots";
import { CITIES } from "@/lib/cities";
import { COUNTRY_TIME_PAGES } from "@/lib/country-times";

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
      rules: [
        { userAgent: "*", allow: "/", disallow: ["/admin/", "/preview/"] },
        { userAgent: "OAI-SearchBot", allow: "/", disallow: ["/admin/", "/preview/"] },
        { userAgent: "GPTBot", allow: "/", disallow: ["/admin/", "/preview/"] },
        { userAgent: "Claude-SearchBot", allow: "/", disallow: ["/admin/", "/preview/"] },
        { userAgent: "ClaudeBot", allow: "/", disallow: ["/admin/", "/preview/"] },
      ],
      sitemap: "https://www.aworldtime.com/sitemap.xml",
      host: "https://www.aworldtime.com",
    });
  });

  it("publishes a plain-text discovery guide for AI systems", async () => {
    const { GET } = await import("@/app/llms.txt/route");
    const response = await GET();
    const content = await response.text();

    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(content).toContain("# AWORLDTIME.COM");
    expect(content).toContain("https://www.aworldtime.com/world-clock");
    expect(content).toContain("https://www.aworldtime.com/blog");
    expect(content).toContain("https://www.aworldtime.com/sitemap.xml");
  });

  it("returns canonical public routes with stable modification dates", async () => {
    listPublishedPosts.mockResolvedValue([]);
    const { default: sitemap } = await import("@/app/sitemap");
    const entries = await sitemap();

    expect(entries.slice(0, 5).map((entry) => entry.url)).toEqual([
      "https://www.aworldtime.com/",
      "https://www.aworldtime.com/world-clock",
      "https://www.aworldtime.com/converter",
      "https://www.aworldtime.com/meeting-planner",
      "https://www.aworldtime.com/blog",
    ]);
    const cityEntries = entries.filter((entry) => entry.url.includes("/world-clock/"));
    expect(cityEntries).toHaveLength(100);
    expect(cityEntries.map((entry) => entry.url)).toEqual(
      CITIES.map((city) => `https://www.aworldtime.com/world-clock/${city.slug}`),
    );
    expect(cityEntries[0]?.lastModified).toEqual(new Date(CITIES[0].contentUpdatedAt));
    const newToolEntries = entries.filter((entry) => entry.url.endsWith("/utc") || entry.url.includes("/time-in/"));
    expect(newToolEntries.map((entry) => entry.url)).toEqual([
      "https://www.aworldtime.com/utc",
      ...COUNTRY_TIME_PAGES.map((country) => `https://www.aworldtime.com/time-in/${country.slug}`),
    ]);
    expect(newToolEntries.every((entry) => new Date(entry.lastModified as Date).toISOString() === "2026-10-29T00:00:00.000Z")).toBe(true);
    expect(entries.slice(0, 5).every((entry) => new Date(entry.lastModified as Date).toISOString() === "2026-09-25T00:00:00.000Z")).toBe(true);
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
