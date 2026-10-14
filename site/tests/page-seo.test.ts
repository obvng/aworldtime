import { describe, expect, it, vi } from "vitest";
import { pageSeoSchema, persistPageSeo } from "@/lib/page-seo";
import { buildPageMetadata } from "@/lib/seo";

describe("page SEO persistence", () => {
  it("rejects paths outside public city pages", () => {
    expect(pageSeoSchema.safeParse({ path: "/admin", seo_title: "Bad", meta_description: "Bad" }).success).toBe(false);
  });

  it("upserts and reads back the saved title and description", async () => {
    const stored: Record<string, unknown> = {};
    const maybeSingle = vi.fn(async () => ({ data: stored, error: null }));
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    const upsert = vi.fn(async (payload: Record<string, unknown>) => {
      Object.assign(stored, payload, { updated_at: "2026-10-14T10:00:00.000Z" });
      return { error: null };
    });
    const client = { from: vi.fn(() => ({ upsert, select })) };

    const result = await persistPageSeo(client, {
      path: "/world-clock/lagos",
      seo_title: "Lagos Time Now and Today’s UTC Offset",
      meta_description: "Check the time in Lagos, its UTC+01:00 offset, daylight-saving status, sunrise and sunset.",
    });

    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({ path: "/world-clock/lagos" }), { onConflict: "path" });
    expect(result.seo_title).toBe("Lagos Time Now and Today’s UTC Offset");
    expect(result.meta_description).toContain("sunrise and sunset");
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
