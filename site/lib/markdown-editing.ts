export type MarkdownEdit = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

export function wrapSelection(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  before: string,
  after: string,
): MarkdownEdit {
  const selected = value.slice(selectionStart, selectionEnd);
  return {
    value: `${value.slice(0, selectionStart)}${before}${selected}${after}${value.slice(selectionEnd)}`,
    selectionStart: selectionStart + before.length,
    selectionEnd: selectionEnd + before.length,
  };
}

export function prefixLines(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  prefix: string,
): MarkdownEdit {
  const start = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const selected = value.slice(start, selectionEnd);
  const changed = selected.split("\n").map((line) => `${prefix}${line}`).join("\n");
  return {
    value: `${value.slice(0, start)}${changed}${value.slice(selectionEnd)}`,
    selectionStart: start,
    selectionEnd: start + changed.length,
  };
}

export function insertLink(value: string, selectionStart: number, selectionEnd: number) {
  const selected = value.slice(selectionStart, selectionEnd) || "link text";
  const markdown = `[${selected}](https://)`;
  return {
    value: `${value.slice(0, selectionStart)}${markdown}${value.slice(selectionEnd)}`,
    selectionStart: selectionStart + selected.length + 3,
    selectionEnd: selectionStart + selected.length + 11,
  };
}

export function insertTable() {
  return "\n| Column | Column |\n| --- | --- |\n| Value | Value |\n";
}

export function insertImageMarkdown(url: string, alt: string) {
  return `![${alt.trim() || "Image"}](${url})`;
}
