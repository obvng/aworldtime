import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/page-seo", () => ({ getPageSeo: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/posts", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/posts")>()),
  listPublishedPosts: vi.fn().mockResolvedValue([]),
}));
vi.mock("@/lib/time", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/time")>()),
  describeTimeZone: vi.fn().mockReturnValue({
    offsetMinutes: -300,
    offsetLabel: "UTC-05:00",
    isDaylightSavingTime: true,
    nextTransition: null,
    nextOffsetLabel: null,
  }),
  timeZoneName: vi.fn().mockReturnValue("Central Daylight Time"),
}));

describe("country permanent-offset wording", () => {
  it("does not call a fixed offset both daylight saving and unchanged", async () => {
    const { default: CountryTimePage } = await import("@/app/time-in/[country]/page");
    render(await CountryTimePage({ params: Promise.resolve({ country: "canada" }) }));

    expect(screen.queryByText("In effect")).not.toBeInTheDocument();
    expect(screen.getAllByText("Fixed year-round").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/uses a permanent UTC-05:00 offset/i).length).toBeGreaterThan(0);
  });
});
