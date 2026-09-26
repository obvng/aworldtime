import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdminLoginPage from "@/app/admin/login/page";

describe("admin login recovery entry point", () => {
  it("links an owner to password recovery", async () => {
    render(await AdminLoginPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("link", { name: "Forgot password?" })).toHaveAttribute(
      "href",
      "/admin/forgot-password",
    );
  });

  it("confirms that a recovered password is ready to use", async () => {
    render(await AdminLoginPage({ searchParams: Promise.resolve({ reset: "success" }) }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Your password has been updated. Sign in with your new password.",
    );
  });
});
