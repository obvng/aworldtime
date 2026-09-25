import { describe, expect, it } from "vitest";

import { fixturePost, selectLatestGuides } from "@/lib/posts";

describe("homepage guides", () => {
  it("returns the two newest currently published posts", () => {
    const guides = selectLatestGuides(
      [
        fixturePost({ slug: "older", published_at: "2026-09-20T10:00:00Z" }),
        fixturePost({ slug: "draft", status: "draft", published_at: null }),
        fixturePost({ slug: "newest", published_at: "2026-09-24T10:00:00Z" }),
        fixturePost({ slug: "middle", published_at: "2026-09-22T10:00:00Z" }),
      ],
      new Date("2026-09-25T10:00:00Z"),
    );

    expect(guides.map((post) => post.slug)).toEqual(["newest", "middle"]);
  });

  it("does not show future scheduled posts", () => {
    const guides = selectLatestGuides(
      [
        fixturePost({ slug: "live", published_at: "2026-09-24T10:00:00Z" }),
        fixturePost({ slug: "future", published_at: "2026-09-26T10:00:00Z" }),
      ],
      new Date("2026-09-25T10:00:00Z"),
    );

    expect(guides.map((post) => post.slug)).toEqual(["live"]);
  });
});
