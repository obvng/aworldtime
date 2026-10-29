import { describe, expect, it } from "vitest";
import { alt, contentType, size } from "@/app/opengraph-image";

describe("default social image", () => {
  it("uses the large social-card dimensions and an accessible description", () => {
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe("image/png");
    expect(alt).toBe("AWORLDTIME.COM world clock");
  });
});
