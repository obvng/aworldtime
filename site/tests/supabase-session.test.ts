import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ createBrowserClient: vi.fn(), createServerClient: vi.fn(), cookies: vi.fn() }));

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: mocks.createBrowserClient,
  createServerClient: mocks.createServerClient,
}));
vi.mock("next/headers", () => ({ cookies: mocks.cookies }));

describe("Supabase admin session cookies", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable";
    mocks.createBrowserClient.mockReset();
    mocks.createServerClient.mockReset();
    mocks.cookies.mockResolvedValue({ getAll: () => [], set: vi.fn() });
  });

  it("uses a 90-day cookie when a browser session is issued", async () => {
    const { createClient } = await import("@/lib/supabase/client");
    createClient();

    expect(mocks.createBrowserClient).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({ cookieOptions: expect.objectContaining({ maxAge: 7_776_000 }) }),
    );
  });

  it("uses the same 90-day cookie for server-side sign-in", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    await createClient();

    expect(mocks.createServerClient).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({ cookieOptions: expect.objectContaining({ maxAge: 7_776_000 }) }),
    );
  });
});
