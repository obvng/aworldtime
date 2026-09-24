import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TimeConverter } from "@/components/time-converter";

describe("TimeConverter", () => {
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
});
