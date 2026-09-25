import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LocalTimeHero } from "@/components/local-time-hero";

describe("LocalTimeHero", () => {
  afterEach(() => vi.useRealTimers());

  it("puts the visitor's city and local time first", () => {
    render(
      <LocalTimeHero
        initialTimeZone="Africa/Lagos"
        now={new Date("2026-09-24T13:27:00Z")}
      />,
    );

    expect(screen.getByRole("heading", { name: "Lagos, Nigeria" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Nigeria flag" })).toHaveTextContent("🇳🇬");
    expect(screen.getByRole("img", { name: "Nigeria flag" })).toHaveClass("hero-country-flag");
    expect(screen.getByTestId("local-time")).toHaveTextContent("02:27:00");
    expect(screen.getByTestId("local-time")).toHaveTextContent("PM");
    expect(screen.getAllByText("PM")[0]).toHaveClass("clock-period");
    expect(screen.getByText("Thursday, 24 September 2026")).toBeVisible();
    expect(screen.getByTestId("city-skyline")).toHaveStyle({
      backgroundImage: 'url("/cities/lagos.webp")',
    });
    expect(screen.getByRole("button", { name: "Search cities" })).toBeVisible();
  });

  it("updates the clock after one second", () => {
    vi.useFakeTimers();
    render(
      <LocalTimeHero
        initialTimeZone="Africa/Lagos"
        now={new Date("2026-09-24T13:27:00Z")}
      />,
    );

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByTestId("local-time")).toHaveTextContent("02:27:01 PM");
  });

  it("syncs a detected local clock to the visitor's device time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-24T13:38:00Z"));

    render(
      <LocalTimeHero
        initialTimeZone="Africa/Lagos"
        now={new Date("2026-09-24T13:27:00Z")}
        detectTimeZone
      />,
    );

    act(() => vi.advanceTimersByTime(0));
    expect(screen.getByTestId("local-time")).toHaveTextContent("02:38:00 PM");
  });

  it("falls back to UTC when the browser zone is unknown", () => {
    render(
      <LocalTimeHero
        initialTimeZone="Mars/Olympus"
        now={new Date("2026-09-24T13:27:00Z")}
      />,
    );

    expect(screen.getByRole("heading", { name: "Your city" })).toBeVisible();
    expect(screen.getByText("Choose your city")).toBeVisible();
  });
});
