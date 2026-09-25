import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireAdmin } = vi.hoisted(() => ({ requireAdmin: vi.fn() }));
vi.mock("@/lib/admin-auth", async () => {
  const actual = await vi.importActual<typeof import("@/lib/admin-auth")>("@/lib/admin-auth");
  return { ...actual, requireAdmin };
});

import { POST } from "@/app/api/admin/images/route";
import { PATCH } from "@/app/api/admin/posts/[id]/autosave/route";
import { AdminAuthError } from "@/lib/admin-auth";

function imageRequest(file: File, alt?: string) {
  const body = new FormData();
  body.set("image", file);
  if (alt) body.set("alt", alt);
  return new Request("http://localhost/api/admin/images", { method: "POST", body });
}

describe("admin API", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when an image upload has no admin session", async () => {
    requireAdmin.mockRejectedValue(new AdminAuthError(401, "Sign in to continue."));
    expect((await POST(imageRequest(new File(["x"], "city.png", { type: "image/png" })))).status).toBe(401);
  });

  it("rejects unsupported image formats and oversized images", async () => {
    requireAdmin.mockResolvedValue({ supabase: {}, userId: "owner-1" });
    expect((await POST(imageRequest(new File(["x"], "city.gif", { type: "image/gif" })))).status).toBe(415);
    expect((await POST(imageRequest(new File([new Uint8Array(5_000_001)], "city.png", { type: "image/png" })))).status).toBe(413);
  });

  it("uploads an image and returns Markdown", async () => {
    const upload = vi.fn().mockResolvedValue({ error: null });
    const bucket = { upload, getPublicUrl: vi.fn(() => ({ data: { publicUrl: "https://cdn.example/city.webp" } })) };
    requireAdmin.mockResolvedValue({ supabase: { storage: { from: vi.fn(() => bucket) } }, userId: "owner-1" });
    const response = await POST(imageRequest(new File(["x"], "Lagos skyline.webp", { type: "image/webp" }), "Lagos skyline"));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(expect.objectContaining({ markdown: "![Lagos skyline](https://cdn.example/city.webp)" }));
  });

  it("refuses to autosave a published post", async () => {
    const single = vi.fn().mockResolvedValue({ data: { status: "published", author_id: "owner-1" } });
    const from = vi.fn(() => ({ select: () => ({ eq: () => ({ single }) }) }));
    requireAdmin.mockResolvedValue({ supabase: { from }, userId: "owner-1" });
    const request = new Request("http://localhost/api/admin/posts/post-1/autosave", {
      method: "PATCH",
      body: JSON.stringify({ title: "Title", slug: "title", excerpt: "", content: "Body", category: "Guides" }),
    });
    const response = await PATCH(request, { params: Promise.resolve({ id: "post-1" }) });
    expect(response.status).toBe(409);
  });
});
