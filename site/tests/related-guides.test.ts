import { describe, expect, it } from "vitest";
import { fixturePost } from "@/lib/posts";
import { selectRelatedGuides } from "@/lib/related-guides";

describe("related guide selection", () => {
  it("matches a published guide by IANA zone without duplicating it", () => {
    const toronto = fixturePost({ slug: "is-toronto-on-est-or-edt", title: "Toronto guide" });

    expect(selectRelatedGuides([toronto, toronto], { countryCode: "CA", timeZone: "America/Toronto" })).toEqual([toronto]);
  });

  it("matches country guides and ignores unpublished or unrelated posts", () => {
    const brazil = fixturePost({ slug: "what-time-does-brazil-use", title: "Brazil guide" });
    const draft = fixturePost({ slug: "why-india-is-5-hours-30-minutes-ahead-of-utc", status: "draft" });
    const unrelated = fixturePost({ slug: "is-utc-the-same-as-gmt" });

    expect(selectRelatedGuides([brazil, draft, unrelated], { countryCode: "BR" })).toEqual([brazil]);
  });
});
