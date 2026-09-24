import type { Post } from "@/lib/posts";
import { savePost } from "@/app/admin/actions";
import { SeoPreview } from "@/components/admin/seo-preview";

export function PostEditor({ post }: { post?: Post | null }) {
  const action = savePost.bind(null, post?.id ?? null);
  const dateValue = post?.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : "";
  return (
    <form action={action} className="post-editor">
      <div className="editor-main">
        <label>Title<input name="title" required maxLength={180} defaultValue={post?.title ?? ""} /></label>
        <label>URL slug<input name="slug" required defaultValue={post?.slug ?? ""} placeholder="meeting-across-time-zones" /></label>
        <label>Excerpt<textarea name="excerpt" rows={3} maxLength={320} defaultValue={post?.excerpt ?? ""} /></label>
        <label>Article<textarea name="content" rows={16} required defaultValue={post?.content ?? ""} placeholder="Write the article in clear paragraphs." /></label>
      </div>
      <aside className="editor-side">
        <label>Category<input name="category" defaultValue={post?.category ?? "Guides"} /></label>
        <label>Status<select name="status" defaultValue={post?.status ?? "draft"}><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option></select></label>
        <label>Publication date<input name="published_at" type="datetime-local" defaultValue={dateValue} /></label>
        <label>Featured image<input name="featured_image" type="file" accept="image/png,image/jpeg,image/webp" /></label>
        <h2>Search settings</h2>
        <label>SEO title<input name="seo_title" maxLength={180} defaultValue={post?.seo_title ?? ""} /></label>
        <label>Meta description<textarea name="meta_description" rows={4} maxLength={320} defaultValue={post?.meta_description ?? ""} /></label>
        <label>Canonical URL<input name="canonical_url" type="url" defaultValue={post?.canonical_url ?? ""} /></label>
        <label>Social title<input name="og_title" maxLength={180} defaultValue={post?.og_title ?? ""} /></label>
        <label>Social description<textarea name="og_description" rows={3} maxLength={320} defaultValue={post?.og_description ?? ""} /></label>
        <label className="checkbox-row"><input name="noindex" type="checkbox" defaultChecked={post?.noindex ?? false} /> Keep this article out of search results</label>
        <SeoPreview title={post?.seo_title || post?.title} description={post?.meta_description || post?.excerpt} slug={post?.slug} />
        <button type="submit" className="admin-primary">Save post</button>
      </aside>
    </form>
  );
}
