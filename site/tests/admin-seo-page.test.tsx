import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/admin-auth", () => ({
  requireAdminPage: vi.fn(async () => ({
    supabase: {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({ maybeSingle: vi.fn(async () => ({ data: null })) })),
        })),
      })),
    },
  })),
}));

describe("page SEO admin", () => {
  it("loads country pages as editable SEO targets", async () => {
    const { default: PageSeoAdminPage } = await import("@/app/admin/seo/page");

    render(await PageSeoAdminPage({ searchParams: Promise.resolve({ country: "france" }) }));

    expect(screen.getByRole("heading", { name: "Edit page search text" })).toBeVisible();
    expect(screen.getByLabelText("Page")).toHaveValue("/time-in/france");
    expect(screen.getByDisplayValue("/time-in/france")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View page" })).toHaveAttribute("href", "/time-in/france");
  });

  it("lists all six main pages and loads UTC for editing", async () => {
    const { default: PageSeoAdminPage } = await import("@/app/admin/seo/page");

    render(await PageSeoAdminPage({ searchParams: Promise.resolve({ path: "/utc" }) }));

    const picker = screen.getByLabelText("Page");
    expect(picker).toHaveValue("/utc");
    expect(screen.getByRole("option", { name: "Home" })).toBeInTheDocument();
    for (const path of ["/", "/world-clock", "/converter", "/meeting-planner", "/blog", "/utc"]) {
      expect(picker.querySelector(`option[value="${path}"]`)).not.toBeNull();
    }
    expect(screen.getByRole("link", { name: "View page" })).toHaveAttribute("href", "/utc");
  });
});
