import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CityLiveClock } from "@/components/city-live-clock";
import { renderToString } from "react-dom/server";

describe("CityLiveClock", () => {
  afterEach(() => vi.useRealTimers());

  it("ticks from the visitor's device clock in the city time zone", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-24T13:27:00.000Z"));
    render(<CityLiveClock timeZone="Africa/Lagos" />);

    act(() => vi.advanceTimersByTime(0));
    expect(screen.getByTestId("city-live-time")).toHaveTextContent("02:27:00 PM");
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByTestId("city-live-time")).toHaveTextContent("02:27:01 PM");
  });

  it("corrects a stale generated time from the visitor's device clock", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-24T13:38:00.000Z"));
    render(<CityLiveClock timeZone="Africa/Lagos" />);

    act(() => vi.advanceTimersByTime(0));
    expect(screen.getByTestId("city-live-time")).toHaveTextContent("02:38:00 PM");
  });

  it("does not bake a frozen wall-clock time into server HTML", () => {
    const html = renderToString(<CityLiveClock timeZone="Africa/Lagos" />);

    expect(html).not.toContain("02:27:00");
    expect(html).not.toContain("2026-09-24T13:27:00.000Z");
    expect(html).toContain("Local time loads in your browser");
  });
});
