import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorldClockDirectory } from "@/components/world-clock-directory";
import { CITIES } from "@/lib/cities";

describe("world clock directory discovery", () => {
  it("renders crawlable links to all 100 city pages without interaction", () => {
    render(<WorldClockDirectory />);
    const cityLinks = screen.getAllByRole("link").filter((link) => link.getAttribute("href")?.startsWith("/world-clock/"));

    expect(cityLinks).toHaveLength(100);
    expect(cityLinks.map((link) => link.getAttribute("href"))).toEqual(
      CITIES.map((city) => `/world-clock/${city.slug}`),
    );
  });
});
