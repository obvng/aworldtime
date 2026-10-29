import type { Metadata } from "next";
import type { Post } from "@/lib/posts";

export const SITE_ORIGIN = "https://www.aworldtime.com";
export const DEFAULT_SOCIAL_IMAGE = `${SITE_ORIGIN}/opengraph-image`;

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
};

export function absoluteUrl(path: string) {
  return new URL(path, `${SITE_ORIGIN}/`).toString().replace(/\/$/, path === "/" ? "/" : "");
}

export function buildPageMetadata({ title, description, path, absoluteTitle = false }: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: "AWORLDTIME.COM",
      images: [{ url: DEFAULT_SOCIAL_IMAGE, width: 1200, height: 630, alt: "AWORLDTIME.COM world clock" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_SOCIAL_IMAGE],
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

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildWebApplicationJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: absoluteUrl(path),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
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
  const socialImage = images || DEFAULT_SOCIAL_IMAGE;
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
      siteName: "AWORLDTIME.COM",
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      images: [{ url: socialImage, alt: images ? post.featured_image_alt ?? undefined : "AWORLDTIME.COM world clock" }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.og_title || title,
      description: post.og_description || description,
      images: [socialImage],
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
    publisher: { "@type": "Organization", "@id": `${SITE_ORIGIN}/#organization`, name: "AWORLDTIME.COM", url: SITE_ORIGIN },
    ...(image ? { image: [image] } : {}),
  };
}

export function xmlEscape(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}
