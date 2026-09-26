import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const resetPasswordForEmail = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createRecoveryClient: () => ({ auth: { resetPasswordForEmail } }),
}));

import { AdminPasswordResetForm } from "@/components/admin/admin-password-reset-form";

describe("AdminPasswordResetForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetPasswordForEmail.mockResolvedValue({ error: null });
  });

  it("sends a recovery email back to the secure admin password page", async () => {
    const user = userEvent.setup();
    render(<AdminPasswordResetForm />);

    await user.type(screen.getByLabelText("Admin email"), "owner@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(resetPasswordForEmail).toHaveBeenCalledWith("owner@example.com", {
      redirectTo: "http://localhost:3000/admin/setup?mode=reset",
    });
    expect(await screen.findByRole("status")).toHaveTextContent(
      "If that email belongs to the admin account, a reset link is on its way.",
    );
  });

  it("does not reveal account details when the recovery request fails", async () => {
    resetPasswordForEmail.mockResolvedValue({ error: new Error("User not found") });
    const user = userEvent.setup();
    render(<AdminPasswordResetForm />);

    await user.type(screen.getByLabelText("Admin email"), "unknown@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We could not send the reset email. Wait a moment and try again.",
    );
    expect(screen.queryByText("User not found")).not.toBeInTheDocument();
  });
});
