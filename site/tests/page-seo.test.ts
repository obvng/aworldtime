import { describe, expect, it, vi } from "vitest";
import { pageSeoSchema, persistPageSeo } from "@/lib/page-seo";
import { buildPageMetadata } from "@/lib/seo";

describe("page SEO persistence", () => {
  it("rejects paths outside public city pages", () => {
    expect(pageSeoSchema.safeParse({ path: "/admin", seo_title: "Bad", meta_description: "Bad" }).success).toBe(false);
  });

  it("upserts and reads back the saved title and description", async () => {
    const stored: Record<string, unknown> = {};
    const single = vi.fn(async () => ({ data: stored, error: null }));
    const select = vi.fn(() => ({ single }));
    const upsert = vi.fn((payload: Record<string, unknown>) => {
      Object.assign(stored, payload, { updated_at: "2026-10-14T10:00:00.000Z" });
      return { select };
    });
    const client = { from: vi.fn(() => ({ upsert })) };

    const result = await persistPageSeo(client, {
      path: "/world-clock/lagos",
      seo_title: "Lagos Time Now and Today’s UTC Offset",
      meta_description: "Check the time in Lagos, its UTC+01:00 offset, daylight-saving status, sunrise and sunset.",
    });

    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({ path: "/world-clock/lagos" }), { onConflict: "path" });
    expect(result.seo_title).toBe("Lagos Time Now and Today’s UTC Offset");
    expect(result.meta_description).toContain("sunrise and sunset");
  });

  it("rejects a swallowed write when the database returns the old row", async () => {
    const oldRow = {
      path: "/world-clock/lagos",
      seo_title: "Old Lagos SEO title",
      meta_description: "This is the old Lagos description that should have been replaced by the submitted form.",
      updated_at: "2026-10-14T08:43:36.000Z",
    };
    const client = {
      from: vi.fn(() => ({
        upsert: vi.fn(() => ({
          select: vi.fn(() => ({ single: vi.fn(async () => ({ data: oldRow, error: null })) })),
        })),
      })),
    };

    await expect(persistPageSeo(client, {
      path: "/world-clock/lagos",
      seo_title: "New Lagos SEO title",
      meta_description: "This is the new Lagos description submitted through the admin form for persistence testing.",
    })).rejects.toThrow("Your changes were not applied");
  });

  it("keeps a saved title absolute so the site name is not appended twice", () => {
    const metadata = buildPageMetadata({
      title: "Lagos Time Now | AWORLDTIME.COM",
      description: "Current time and daylight information for Lagos, Nigeria.",
      path: "/world-clock/lagos",
      absoluteTitle: true,
    });

    expect(metadata.title).toEqual({ absolute: "Lagos Time Now | AWORLDTIME.COM" });
  });
});
