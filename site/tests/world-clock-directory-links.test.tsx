import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorldClockDirectory } from "@/components/world-clock-directory";
import { CITIES } from "@/lib/cities";
import { COUNTRY_TIME_PAGES } from "@/lib/country-times";

describe("world clock directory discovery", () => {
  it("renders crawlable links to all 100 city pages without interaction", () => {
    render(<WorldClockDirectory />);
    const cityLinks = screen.getAllByRole("link").filter((link) => link.getAttribute("href")?.startsWith("/world-clock/"));

    expect(cityLinks).toHaveLength(100);
    expect(cityLinks.map((link) => link.getAttribute("href"))).toEqual(
      CITIES.map((city) => `/world-clock/${city.slug}`),
    );
  });

  it("renders crawlable links to UTC and every approved country page", () => {
    render(<WorldClockDirectory />);

    expect(screen.getByRole("link", { name: /utc time now/i })).toHaveAttribute("href", "/utc");
    for (const country of COUNTRY_TIME_PAGES) {
      expect(screen.getByRole("link", { name: new RegExp(`time in ${country.name}`, "i") })).toHaveAttribute("href", `/time-in/${country.slug}`);
    }
  });
});
