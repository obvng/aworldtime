import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { ZoneLiveTime } from "@/components/zone-live-time";

describe("ZoneLiveTime", () => {
  afterEach(() => vi.useRealTimers());

  it("renders the request-time clock in server HTML", () => {
    const html = renderToString(
      <ZoneLiveTime timeZone="Asia/Dhaka" initialNow="2026-10-29T06:00:00.000Z" includeDate />,
    );

    expect(html).toContain("12:00:00");
    expect(html).toContain("PM");
    expect(html).toContain("2026-10-29T06:00:00.000Z");
    expect(html).toContain("Thursday, 29 October 2026");
  });

  it("ticks from the visitor's clock after hydration", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-29T06:00:05.000Z"));
    render(<ZoneLiveTime timeZone="UTC" initialNow="2026-10-29T06:00:00.000Z" />);

    act(() => vi.advanceTimersByTime(0));
    expect(screen.getByTestId("zone-live-time")).toHaveTextContent("06:00:05 AM");
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByTestId("zone-live-time")).toHaveTextContent("06:00:06 AM");
  });
});
