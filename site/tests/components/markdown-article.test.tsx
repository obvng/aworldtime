import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarkdownArticle } from "@/components/blog/markdown-article";

describe("MarkdownArticle", () => {
  it("renders GitHub-flavoured Markdown", () => {
    render(
      <MarkdownArticle
        content={
          "## Lagos time\n\n- WAT\n\n| City | Time |\n| --- | --- |\n| Lagos | 14:27 |"
        }
      />,
    );

    expect(screen.getByRole("heading", { name: "Lagos time" })).toBeVisible();
    expect(screen.getByText("WAT")).toBeVisible();
    expect(screen.getByRole("table")).toBeVisible();
  });

  it("does not render unsafe script content", () => {
    const { container } = render(
      <MarkdownArticle content={'<script>alert("x")</script>\n\nSafe'} />,
    );

    expect(container.querySelector("script")).toBeNull();
    expect(screen.getByText(/Safe/)).toBeVisible();
  });
});
