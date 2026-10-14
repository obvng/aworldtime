import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

vi.mock("@/lib/admin-auth", () => ({
  AdminAuthError: class AdminAuthError extends Error {},
  requireAdmin: mocks.requireAdmin,
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import { savePageSeoOverride } from "@/app/admin/actions";

describe("city SEO admin form action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("writes submitted form values and reads the same row back", async () => {
    let savedRow: Record<string, unknown> | null = null;
    const single = vi.fn(async () => ({ data: savedRow, error: null }));
    const select = vi.fn(() => ({ single }));
    const upsert = vi.fn((payload: Record<string, unknown>) => {
      savedRow = { ...payload, updated_at: "2026-10-14T10:00:00.000Z" };
      return { select };
    });
    mocks.requireAdmin.mockResolvedValue({
      userId: "admin-user",
      supabase: { from: vi.fn(() => ({ upsert })) },
    });

    const formData = new FormData();
    formData.set("path", "/world-clock/lagos");
    formData.set("seo_title", "Lagos Current Time and UTC Offset");
    formData.set("meta_description", "Check the live time in Lagos, UTC offset, daylight-saving status, sunrise and sunset today.");

    await expect(savePageSeoOverride(formData)).rejects.toThrow("REDIRECT:/admin/seo?city=lagos&saved=1");
    expect(savedRow).toMatchObject({
      path: "/world-clock/lagos",
      seo_title: "Lagos Current Time and UTC Offset",
      meta_description: "Check the live time in Lagos, UTC offset, daylight-saving status, sunrise and sunset today.",
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/world-clock/lagos");
  });
});
