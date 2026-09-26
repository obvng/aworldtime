import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const resetPasswordForEmail = vi.fn();
const verifyOtp = vi.fn();
const updateUser = vi.fn();
const signOut = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createRecoveryClient: () => ({ auth: { resetPasswordForEmail, verifyOtp, updateUser, signOut } }),
}));

import { AdminPasswordResetForm } from "@/components/admin/admin-password-reset-form";

describe("AdminPasswordResetForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetPasswordForEmail.mockResolvedValue({ error: null });
    verifyOtp.mockResolvedValue({ data: { session: { access_token: "recovery-session" } }, error: null });
    updateUser.mockResolvedValue({ error: null });
    signOut.mockResolvedValue({ error: null });
  });

  it("requests a six-digit recovery code without relying on a browser-specific link", async () => {
    const user = userEvent.setup();
    render(<AdminPasswordResetForm />);

    await user.type(screen.getByLabelText("Admin email"), "owner@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset code" }));

    expect(resetPasswordForEmail).toHaveBeenCalledWith("owner@example.com");
    expect(await screen.findByLabelText("Six-digit code")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "If that email belongs to the admin account, a six-digit code is on its way.",
    );
  });

  it("verifies the recovery code before changing the password", async () => {
    const user = userEvent.setup();
    render(<AdminPasswordResetForm />);

    await user.type(screen.getByLabelText("Admin email"), "owner@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset code" }));
    await user.type(await screen.findByLabelText("Six-digit code"), "482913");
    await user.type(screen.getByLabelText("New password"), "secure-owner-password");
    await user.type(screen.getByLabelText("Confirm password"), "secure-owner-password");
    await user.click(screen.getByRole("button", { name: "Save new password" }));

    expect(verifyOtp).toHaveBeenCalledWith({ email: "owner@example.com", token: "482913", type: "recovery" });
    expect(updateUser).toHaveBeenCalledWith({ password: "secure-owner-password" });
    expect(await screen.findByRole("status")).toHaveTextContent("Your password has been updated.");
  });

  it("does not change the password when the code is invalid", async () => {
    verifyOtp.mockResolvedValue({ data: { session: null }, error: new Error("expired") });
    const user = userEvent.setup();
    render(<AdminPasswordResetForm />);

    await user.type(screen.getByLabelText("Admin email"), "owner@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset code" }));
    await user.type(await screen.findByLabelText("Six-digit code"), "000000");
    await user.type(screen.getByLabelText("New password"), "secure-owner-password");
    await user.type(screen.getByLabelText("Confirm password"), "secure-owner-password");
    await user.click(screen.getByRole("button", { name: "Save new password" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("That code is invalid or has expired.");
    expect(updateUser).not.toHaveBeenCalled();
  });
});
