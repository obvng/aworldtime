import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getPublishedPost } from "@/lib/posts";
import { buildArticleJsonLd, buildPostMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  return post ? buildPostMetadata(post) : {};
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  const jsonLd = JSON.stringify(buildArticleJsonLd(post)).replaceAll("<", "\\u003c");
  return <div className="site-shell"><SiteHeader /><main className="article-page"><article><p className="article-category">{post.category}</p><h1>{post.title}</h1><p className="article-excerpt">{post.excerpt}</p><p className="article-date">Published {new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" }).format(new Date(post.published_at as string))}</p><div className="article-body">{post.content.split(/\n\n+/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} /></main></div>;
}
