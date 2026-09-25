import type { Metadata } from "next";
import type { Post } from "@/lib/posts";

export const SITE_ORIGIN = "https://www.aworldtime.com";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function absoluteUrl(path: string) {
  return new URL(path, `${SITE_ORIGIN}/`).toString().replace(/\/$/, path === "/" ? "/" : "");
}

export function buildPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: "AWORLDTIME.COM",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: `${SITE_ORIGIN}/`,
        name: "AWORLDTIME.COM",
        description: "World clocks, time-zone conversion, meeting planning, and practical time guides.",
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_ORIGIN}/#organization`,
        url: `${SITE_ORIGIN}/`,
        name: "AWORLDTIME.COM",
      },
    ],
  };
}

export function serializeJsonLd(value: object) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

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
      ...(images ? { images: [{ url: images, alt: post.featured_image_alt ?? undefined }] } : {}),
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
