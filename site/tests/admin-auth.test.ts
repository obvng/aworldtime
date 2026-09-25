import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClient, hasSupabaseConfig } = vi.hoisted(() => ({ createClient: vi.fn(), hasSupabaseConfig: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({ createClient, hasSupabaseConfig }));

import { AdminAuthError, requireAdmin } from "@/lib/admin-auth";

describe("admin authorization", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects missing sessions", async () => {
    hasSupabaseConfig.mockReturnValue(true);
    createClient.mockResolvedValue({ auth: { getClaims: vi.fn().mockResolvedValue({ data: {} }) } });
    await expect(requireAdmin()).rejects.toEqual(expect.objectContaining<Partial<AdminAuthError>>({ status: 401 }));
  });

  it("rejects signed-in users without the admin role", async () => {
    hasSupabaseConfig.mockReturnValue(true);
    createClient.mockResolvedValue({
      auth: { getClaims: vi.fn().mockResolvedValue({ data: { claims: { sub: "reader-1" } } }) },
      from: vi.fn(() => ({ select: () => ({ eq: () => ({ single: vi.fn().mockResolvedValue({ data: { role: "reader" } }) }) }) })),
    });
    await expect(requireAdmin()).rejects.toEqual(expect.objectContaining<Partial<AdminAuthError>>({ status: 403 }));
  });
});
