"use client";

import { useRef, useState, type RefObject } from "react";

import { insertLink, insertTable, prefixLines, wrapSelection, type MarkdownEdit } from "@/lib/markdown-editing";

type MarkdownToolbarProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onEdit: (edit: MarkdownEdit) => void;
};

export function MarkdownToolbar({ textareaRef, value, onEdit }: MarkdownToolbarProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  function selection() {
    return { start: textareaRef.current?.selectionStart ?? value.length, end: textareaRef.current?.selectionEnd ?? value.length };
  }

  function insertText(text: string) {
    const { start, end } = selection();
    onEdit({ value: `${value.slice(0, start)}${text}${value.slice(end)}`, selectionStart: start + text.length, selectionEnd: start + text.length });
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.set("image", file);
    formData.set("alt", file.name.replace(/\.[^.]+$/, "").replaceAll(/[-_]+/g, " "));
    try {
      const response = await fetch("/api/admin/images", { method: "POST", body: formData });
      const result = await response.json() as { markdown?: string; error?: string };
      if (!response.ok || !result.markdown) throw new Error(result.error || "The image could not be uploaded.");
      insertText(result.markdown);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "The image could not be uploaded.");
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  }

  return (
    <div className="markdown-toolbar" aria-label="Markdown formatting">
      <button type="button" aria-label="Bold" onClick={() => { const { start, end } = selection(); onEdit(wrapSelection(value, start, end, "**", "**")); }}><strong>B</strong></button>
      <button type="button" aria-label="Italic" onClick={() => { const { start, end } = selection(); onEdit(wrapSelection(value, start, end, "_", "_")); }}><em>I</em></button>
      <button type="button" aria-label="Heading" onClick={() => { const { start, end } = selection(); onEdit(prefixLines(value, start, end, "## ")); }}>H2</button>
      <button type="button" aria-label="Bulleted list" onClick={() => { const { start, end } = selection(); onEdit(prefixLines(value, start, end, "- ")); }}>List</button>
      <button type="button" aria-label="Link" onClick={() => { const { start, end } = selection(); onEdit(insertLink(value, start, end)); }}>Link</button>
      <button type="button" aria-label="Table" onClick={() => insertText(insertTable())}>Table</button>
      <button type="button" aria-label="Upload article image" disabled={uploading} onClick={() => imageInputRef.current?.click()}>{uploading ? "Uploading…" : "Image"}</button>
      <input ref={imageInputRef} className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file); }} />
      {uploadError ? <span className="toolbar-error" role="alert">{uploadError}</span> : null}
    </div>
  );
}
