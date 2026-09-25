import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PostEditor } from "@/components/admin/post-editor";

vi.mock("@/app/admin/actions", () => ({
  savePost: vi.fn(),
}));

describe("PostEditor", () => {
  it("suggests a slug until the owner edits it", async () => {
    const user = userEvent.setup();
    render(<PostEditor />);

    await user.type(screen.getByLabelText("Title"), "Lagos Time Guide");
    expect(screen.getByLabelText("URL slug")).toHaveValue("lagos-time-guide");

    await user.clear(screen.getByLabelText("URL slug"));
    await user.type(screen.getByLabelText("URL slug"), "my-lagos-url");
    await user.clear(screen.getByLabelText("Title"));
    await user.type(screen.getByLabelText("Title"), "Different title");
    expect(screen.getByLabelText("URL slug")).toHaveValue("my-lagos-url");
  });

  it("inserts bold Markdown and renders a preview", async () => {
    const user = userEvent.setup();
    render(<PostEditor />);
    const article = screen.getByLabelText("Article") as HTMLTextAreaElement;

    await user.type(article, "Lagos");
    article.setSelectionRange(0, 5);
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(article).toHaveValue("**Lagos**");

    await user.click(screen.getByRole("button", { name: "Preview" }));
    expect(screen.getByText("Lagos")).toBeVisible();
  });

  it("includes featured-image alt text and a save status", () => {
    render(<PostEditor />);
    expect(screen.getByLabelText("Featured image description")).toBeVisible();
    expect(screen.getByText("Not saved yet")).toBeVisible();
  });
});
