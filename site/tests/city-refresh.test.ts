import { describe, expect, it, vi } from "vitest";

const { revalidatePath } = vi.hoisted(() => ({ revalidatePath: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath }));

describe("daily city refresh", () => {
  it("rejects calls without the production cron secret", async () => {
    vi.stubEnv("CRON_SECRET", "release-secret");
    const { GET } = await import("@/app/api/cron/refresh-city-pages/route");
    const response = await GET(new Request("https://www.aworldtime.com/api/cron/refresh-city-pages"));

    expect(response.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("invalidates every generated city page pattern after authorization", async () => {
    vi.stubEnv("CRON_SECRET", "release-secret");
    const { GET } = await import("@/app/api/cron/refresh-city-pages/route");
    const response = await GET(new Request("https://www.aworldtime.com/api/cron/refresh-city-pages", { headers: { authorization: "Bearer release-secret" } }));

    expect(response.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/world-clock/[city]", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
  });
});
