import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const updateUser = vi.fn();
const getSession = vi.fn();
const exchangeCodeForSession = vi.fn();
const setSession = vi.fn();
const replace = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ auth: { exchangeCodeForSession, getSession, setSession, updateUser } }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

import { AdminSetupForm } from "@/components/admin/admin-setup-form";

describe("AdminSetupForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, "", "/admin/setup");
    getSession.mockResolvedValue({ data: { session: { user: { id: "owner" } } } });
    exchangeCodeForSession.mockResolvedValue({ data: { session: { user: { id: "owner" } } }, error: null });
    setSession.mockResolvedValue({ data: { session: { user: { id: "owner" } } }, error: null });
    updateUser.mockResolvedValue({ error: null });
  });

  it("exchanges the recovery code before setting the password", async () => {
    window.history.replaceState({}, "", "/admin/setup?code=recovery-code");
    const user = userEvent.setup();
    render(<AdminSetupForm />);

    await user.type(screen.getByLabelText("New password"), "secure-owner-password");
    await user.type(screen.getByLabelText("Confirm password"), "secure-owner-password");
    await user.click(screen.getByRole("button", { name: "Create admin password" }));

    expect(exchangeCodeForSession).toHaveBeenCalledWith("recovery-code");
    expect(updateUser).toHaveBeenCalledWith({ password: "secure-owner-password" });
  });

  it("sets the invited owner's password and opens the admin dashboard", async () => {
    const user = userEvent.setup();
    render(<AdminSetupForm />);

    await user.type(screen.getByLabelText("New password"), "secure-owner-password");
    await user.type(screen.getByLabelText("Confirm password"), "secure-owner-password");
    await user.click(screen.getByRole("button", { name: "Create admin password" }));

    expect(updateUser).toHaveBeenCalledWith({ password: "secure-owner-password" });
    expect(replace).toHaveBeenCalledWith("/admin");
  });

  it("returns a recovered owner to sign in with the new password", async () => {
    window.history.replaceState({}, "", "/admin/setup?mode=reset&code=recovery-code");
    const user = userEvent.setup();
    render(<AdminSetupForm mode="reset" />);

    await user.type(screen.getByLabelText("New password"), "secure-owner-password");
    await user.type(screen.getByLabelText("Confirm password"), "secure-owner-password");
    await user.click(screen.getByRole("button", { name: "Save new password" }));

    expect(updateUser).toHaveBeenCalledWith({ password: "secure-owner-password" });
    expect(replace).toHaveBeenCalledWith("/admin/login?reset=success");
  });

  it("accepts a recovery link opened outside the browser that requested it", async () => {
    window.history.replaceState(
      {},
      "",
      "/admin/setup?mode=reset#access_token=recovery-access&refresh_token=recovery-refresh&type=recovery",
    );
    getSession.mockResolvedValue({ data: { session: null }, error: null });
    const user = userEvent.setup();
    render(<AdminSetupForm mode="reset" />);

    await user.type(screen.getByLabelText("New password"), "secure-owner-password");
    await user.type(screen.getByLabelText("Confirm password"), "secure-owner-password");
    await user.click(screen.getByRole("button", { name: "Save new password" }));

    expect(updateUser).toHaveBeenCalledWith({ password: "secure-owner-password" });
    expect(replace).toHaveBeenCalledWith("/admin/login?reset=success");
  });

  it("explains when a recovery link has expired", async () => {
    window.history.replaceState({}, "", "/admin/setup?mode=reset&code=expired-code");
    exchangeCodeForSession.mockResolvedValue({ data: { session: null }, error: new Error("expired") });
    const user = userEvent.setup();
    render(<AdminSetupForm mode="reset" />);

    await user.type(screen.getByLabelText("New password"), "secure-owner-password");
    await user.type(screen.getByLabelText("Confirm password"), "secure-owner-password");
    await user.click(screen.getByRole("button", { name: "Save new password" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "This reset link is invalid or has expired. Request a new reset link.",
    );
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("rejects passwords that do not match", async () => {
    const user = userEvent.setup();
    render(<AdminSetupForm />);

    await user.type(screen.getByLabelText("New password"), "secure-owner-password");
    await user.type(screen.getByLabelText("Confirm password"), "different-password");
    await user.click(screen.getByRole("button", { name: "Create admin password" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Passwords do not match.");
    expect(updateUser).not.toHaveBeenCalled();
  });
});
