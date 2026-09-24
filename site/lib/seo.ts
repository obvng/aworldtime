import type { Metadata } from "next";
import type { Post } from "@/lib/posts";

export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aworldtime.com";

export function postUrl(post: Post) {
  return post.canonical_url || `${SITE_ORIGIN}/blog/${post.slug}`;
}

export function buildPostMetadata(post: Post): Metadata {
  const title = post.seo_title || post.title;
  const description = post.meta_description || post.excerpt;
  const images = post.og_image_url || post.featured_image_url;
  return {
    title,
    description,
    alternates: { canonical: postUrl(post) },
    robots: post.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "article",
      title: post.og_title || title,
      description: post.og_description || description,
      url: postUrl(post),
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      ...(images ? { images: [images] } : {}),
    },
  };
}

export function buildArticleJsonLd(post: Post) {
  const image = post.og_image_url || post.featured_image_url;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    mainEntityOfPage: postUrl(post),
    author: { "@type": "Organization", name: "AWORLDTIME.COM" },
    publisher: { "@type": "Organization", name: "AWORLDTIME.COM", url: SITE_ORIGIN },
    ...(image ? { image: [image] } : {}),
  };
}

export function xmlEscape(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}
