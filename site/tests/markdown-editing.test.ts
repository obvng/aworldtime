import { describe, expect, it } from "vitest";

import { insertImageMarkdown, insertLink, prefixLines, wrapSelection } from "@/lib/markdown-editing";

describe("Markdown editing helpers", () => {
  it("wraps selected text", () => {
    expect(wrapSelection("Lagos", 0, 5, "**", "**")).toEqual({
      value: "**Lagos**",
      selectionStart: 2,
      selectionEnd: 7,
    });
  });

  it("prefixes every selected line", () => {
    expect(prefixLines("Lagos\nLondon", 0, 12, "- ").value).toBe("- Lagos\n- London");
  });

  it("inserts links and images with useful fallback text", () => {
    expect(insertLink("Lagos", 0, 5).value).toBe("[Lagos](https://)");
    expect(insertImageMarkdown("https://example.com/lagos.webp", "Lagos skyline")).toBe(
      "![Lagos skyline](https://example.com/lagos.webp)",
    );
  });
});
