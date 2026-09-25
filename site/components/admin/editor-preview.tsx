import { MarkdownArticle } from "@/components/blog/markdown-article";

export function EditorPreview({ content }: { content: string }) {
  return (
    <section className="editor-preview" aria-label="Article preview">
      {content ? <MarkdownArticle content={content} /> : <p>Start writing to see the article preview.</p>}
    </section>
  );
}
