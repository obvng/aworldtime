"use client";

import type { RefObject } from "react";

import { insertLink, insertTable, prefixLines, wrapSelection, type MarkdownEdit } from "@/lib/markdown-editing";

type MarkdownToolbarProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onEdit: (edit: MarkdownEdit) => void;
};

export function MarkdownToolbar({ textareaRef, value, onEdit }: MarkdownToolbarProps) {
  function selection() {
    return { start: textareaRef.current?.selectionStart ?? value.length, end: textareaRef.current?.selectionEnd ?? value.length };
  }

  function insertText(text: string) {
    const { start, end } = selection();
    onEdit({ value: `${value.slice(0, start)}${text}${value.slice(end)}`, selectionStart: start + text.length, selectionEnd: start + text.length });
  }

  return (
    <div className="markdown-toolbar" aria-label="Markdown formatting">
      <button type="button" aria-label="Bold" onClick={() => { const { start, end } = selection(); onEdit(wrapSelection(value, start, end, "**", "**")); }}><strong>B</strong></button>
      <button type="button" aria-label="Italic" onClick={() => { const { start, end } = selection(); onEdit(wrapSelection(value, start, end, "_", "_")); }}><em>I</em></button>
      <button type="button" aria-label="Heading" onClick={() => { const { start, end } = selection(); onEdit(prefixLines(value, start, end, "## ")); }}>H2</button>
      <button type="button" aria-label="Bulleted list" onClick={() => { const { start, end } = selection(); onEdit(prefixLines(value, start, end, "- ")); }}>List</button>
      <button type="button" aria-label="Link" onClick={() => { const { start, end } = selection(); onEdit(insertLink(value, start, end)); }}>Link</button>
      <button type="button" aria-label="Table" onClick={() => insertText(insertTable())}>Table</button>
      <button type="button" aria-label="Image Markdown" onClick={() => insertText("![Image description](https://)")}>Image</button>
    </div>
  );
}
