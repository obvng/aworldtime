import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const getClaims = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({ auth: { getClaims } }),
}));

import { updateSession } from "@/lib/supabase/proxy";

describe("admin session proxy", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable";
    getClaims.mockResolvedValue({ data: { claims: null } });
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
});
