"use client";

import { useEffect, useRef, useState } from "react";

import { savePost } from "@/app/admin/actions";
import { EditorPreview } from "@/components/admin/editor-preview";
import { MarkdownToolbar } from "@/components/admin/markdown-toolbar";
import { SeoPreview } from "@/components/admin/seo-preview";
import type { MarkdownEdit } from "@/lib/markdown-editing";
import { normalizeSlug } from "@/lib/post-validation";
import type { Post } from "@/lib/posts";

export function PostEditor({ post }: { post?: Post | null }) {
  const action = savePost.bind(null, post?.id ?? null);
  const dateValue = post?.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : "";
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(post?.slug));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [metaDescription, setMetaDescription] = useState(post?.meta_description ?? "");
  const [activeView, setActiveView] = useState<"write" | "preview">("write");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function updateTitle(value: string) {
    setTitle(value);
    if (!slugEdited) setSlug(normalizeSlug(value));
    setDirty(true);
  }

  function applyEdit(edit: MarkdownEdit) {
    setContent(edit.value);
    setDirty(true);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(edit.selectionStart, edit.selectionEnd);
    });
  }

  return (
    <form action={action} className="post-editor" onChange={() => setDirty(true)}>
      <div className="editor-main">
        <label>Title<input name="title" required maxLength={180} value={title} onChange={(event) => updateTitle(event.target.value)} /></label>
        <label>URL slug<input name="slug" required value={slug} placeholder="meeting-across-time-zones" onChange={(event) => { setSlug(event.target.value); setSlugEdited(true); }} /></label>
        <label>Excerpt<textarea name="excerpt" rows={3} maxLength={320} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} /></label>
        <div className="markdown-editor-heading">
          <span>Article</span>
          <div className="editor-view-tabs" aria-label="Editor view">
            <button type="button" aria-pressed={activeView === "write"} onClick={() => setActiveView("write")}>Write</button>
            <button type="button" aria-pressed={activeView === "preview"} onClick={() => setActiveView("preview")}>Preview</button>
          </div>
        </div>
        <MarkdownToolbar textareaRef={textareaRef} value={content} onEdit={applyEdit} />
        <div className={`markdown-workspace view-${activeView}`}>
          <label className="markdown-writing-pane">Article<textarea ref={textareaRef} name="content" rows={22} required value={content} onChange={(event) => setContent(event.target.value)} placeholder="Write in Markdown. Use the toolbar for headings, links, lists, tables, and images." /></label>
          <EditorPreview content={content} />
        </div>
      </div>
      <aside className="editor-side">
        <p className="editor-save-status" aria-live="polite">{dirty ? "Unsaved changes" : post ? "Saved" : "Not saved yet"}</p>
        <label>Category<input name="category" defaultValue={post?.category ?? "Guides"} /></label>
        <label>Status<select name="status" defaultValue={post?.status ?? "draft"}><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option></select></label>
        <label>Publication date<input name="published_at" type="datetime-local" defaultValue={dateValue} /></label>
        <input name="featured_image_url" type="hidden" value={post?.featured_image_url ?? ""} readOnly />
        <label>Featured image<input name="featured_image" type="file" accept="image/png,image/jpeg,image/webp" /></label>
        <label>Featured image description<input name="featured_image_alt" maxLength={240} defaultValue={post?.featured_image_alt ?? ""} placeholder="Describe what the image shows" /></label>
        <h2>Search settings</h2>
        <label>SEO title<input name="seo_title" maxLength={180} value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} /></label>
        <label>Meta description<textarea name="meta_description" rows={4} maxLength={320} value={metaDescription} onChange={(event) => setMetaDescription(event.target.value)} /></label>
        <label>Canonical URL<input name="canonical_url" type="url" defaultValue={post?.canonical_url ?? ""} /></label>
        <label>Social title<input name="og_title" maxLength={180} defaultValue={post?.og_title ?? ""} /></label>
        <label>Social description<textarea name="og_description" rows={3} maxLength={320} defaultValue={post?.og_description ?? ""} /></label>
        <label className="checkbox-row"><input name="noindex" type="checkbox" defaultChecked={post?.noindex ?? false} /> Keep this article out of search results</label>
        <SeoPreview title={seoTitle || title} description={metaDescription || excerpt} slug={slug} />
        <button type="submit" className="admin-primary">Save post</button>
      </aside>
    </form>
  );
}
