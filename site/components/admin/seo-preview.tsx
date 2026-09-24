type SeoPreviewProps = {
  title?: string | null;
  description?: string | null;
  slug?: string;
};

export function SeoPreview({ title, description, slug }: SeoPreviewProps) {
  return (
    <aside className="seo-preview" aria-label="Search preview">
      <p>Search preview</p>
      <span>aworldtime.com › blog › {slug || "article-url"}</span>
      <h3>{title || "Your search title"}</h3>
      <small>{description || "Your meta description will appear here."}</small>
      <em>Search engines may shorten this text depending on the device and query.</em>
    </aside>
  );
}
