import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { getClaims, createServerClient } = vi.hoisted(() => ({ getClaims: vi.fn(), createServerClient: vi.fn() }));

vi.mock("@supabase/ssr", () => ({
  createServerClient,
}));

import { updateSession } from "@/lib/supabase/proxy";

describe("admin session proxy", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable";
    getClaims.mockResolvedValue({ data: { claims: null } });
    createServerClient.mockImplementation((_url, _key, options) => ({
      auth: {
        getClaims: async () => {
          options.cookies.setAll([{ name: "sb-session", value: "refreshed", options: {} }], {});
          return getClaims();
        },
      },
    }));
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    vi.clearAllMocks();
  });

  it("allows an invited owner to open the password setup page without a server session", async () => {
    const response = await updateSession(new NextRequest("https://www.aworldtime.com/admin/setup"));

    expect(response.headers.get("location")).toBeNull();
  });

  it("allows an owner to request a password reset without a server session", async () => {
    const response = await updateSession(new NextRequest("https://www.aworldtime.com/admin/forgot-password"));

    expect(response.headers.get("location")).toBeNull();
  });

  it("keeps refreshed admin cookies for 90 days", async () => {
    const response = await updateSession(new NextRequest("https://www.aworldtime.com/admin/login"));

    expect(response.cookies.get("sb-session")).toMatchObject({ value: "refreshed" });
    expect(createServerClient).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({ cookieOptions: expect.objectContaining({ maxAge: 7_776_000 }) }),
    );
  });
});
