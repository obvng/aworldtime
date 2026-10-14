import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TimeConverter } from "@/components/time-converter";

describe("TimeConverter", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
  it("shows the converted city time", async () => {
    const user = userEvent.setup();
    render(
      <TimeConverter
        initialDate="2026-09-24"
        initialTime="14:27"
        initialFrom="Africa/Lagos"
        initialTo="America/New_York"
      />,
    );

    await user.clear(screen.getByLabelText("Time"));
    await user.type(screen.getByLabelText("Time"), "14:27");
    expect(screen.getByTestId("converted-time")).toHaveTextContent("09:27");
    expect(screen.getByText("New York")).toBeVisible();
  });

  it("logs a pair only after the visitor changes a city", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<TimeConverter initialFrom="lagos" initialTo="london" />);

    act(() => vi.advanceTimersByTime(1000));
    expect(fetchMock).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText("To"), { target: { value: "dubai" } });
    act(() => vi.advanceTimersByTime(800));
    expect(fetchMock).toHaveBeenCalledWith("/api/converter-usage", expect.objectContaining({ method: "POST" }));
  });
});
