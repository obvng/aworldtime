import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getPageSeo: vi.fn() }));

vi.mock("@/lib/page-seo", () => ({ getPageSeo: mocks.getPageSeo }));

const routes = [
  ["/", () => import("@/app/page")],
  ["/world-clock", () => import("@/app/world-clock/page")],
  ["/converter", () => import("@/app/converter/page")],
  ["/meeting-planner", () => import("@/app/meeting-planner/page")],
  ["/blog", () => import("@/app/blog/page")],
  ["/utc", () => import("@/app/utc/page")],
] as const;

describe("editable main-page metadata", () => {
  beforeEach(() => mocks.getPageSeo.mockReset());

  it.each(routes)("uses the saved override on %s", async (path, loadRoute) => {
    mocks.getPageSeo.mockResolvedValue({
      path,
      seo_title: `Saved SEO title for ${path}`,
      meta_description: `Saved meta description for ${path} with enough specific text to satisfy the editor validation rules.`,
      updated_at: "2026-11-11T10:00:00.000Z",
    });
    const route = await loadRoute();

    const metadata = await route.generateMetadata();

    expect(metadata.title).toMatchObject({ absolute: `Saved SEO title for ${path}` });
    expect(metadata.description).toBe(`Saved meta description for ${path} with enough specific text to satisfy the editor validation rules.`);
    expect(metadata.alternates?.canonical).toBe(`https://www.aworldtime.com${path === "/" ? "/" : path}`);
  });
});
