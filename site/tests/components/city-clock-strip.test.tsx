import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CityClockStrip } from "@/components/city-clock-strip";

describe("CityClockStrip", () => {
  const matchMedia = vi.fn(() => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));

  beforeEach(() => {
    matchMedia.mockClear();
    vi.stubGlobal("matchMedia", matchMedia);
  });

  it("shows all six approved city clocks", () => {
    render(<CityClockStrip initialNow="2026-09-24T13:27:00.000Z" />);

    expect(screen.getAllByRole("article")).toHaveLength(6);
    for (const city of ["London", "New York", "Dubai", "Tokyo", "Toronto", "Beijing"]) {
      expect(screen.getByText(city)).toBeVisible();
    }
    expect(screen.getAllByText(/AM|PM/)).toHaveLength(6);
    expect(screen.getAllByText(/AM|PM/)[0]).toHaveClass("city-clock-period");
  });

  it("does not use JavaScript viewport detection for layout", () => {
    render(<CityClockStrip initialNow="2026-09-24T13:27:00.000Z" />);

    expect(matchMedia).not.toHaveBeenCalled();
  });
});
