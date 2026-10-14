import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const savePageSeoOverride = vi.hoisted(() => vi.fn());
vi.mock("@/app/admin/actions", () => ({ savePageSeoOverride }));

import { AdminPageSeoForm } from "@/components/admin-page-seo-form";

describe("AdminPageSeoForm", () => {
  it("shows a pending state until the database-confirmed response returns", async () => {
    let finish!: (value: { status: "success" }) => void;
    savePageSeoOverride.mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
    render(<AdminPageSeoForm
      path="/world-clock/lagos"
      title="Current Time in Lagos, Nigeria"
      description="Check the exact current time in Lagos, its UTC offset, sunrise and sunset today."
    />);

    fireEvent.submit(screen.getByRole("button", { name: "Save SEO settings" }).closest("form")!);
    expect(await screen.findByRole("button", { name: "Saving to database…" })).toBeDisabled();

    await act(async () => finish({ status: "success" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Saved to the database");
    expect(screen.getByRole("button", { name: "Save SEO settings" })).toBeEnabled();
  });
});
