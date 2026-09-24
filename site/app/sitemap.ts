import type { MetadataRoute } from "next";
import { listPublishedPosts } from "@/lib/posts";
import { SITE_ORIGIN } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPublishedPosts();
  const routes = ["", "/world-clock", "/converter", "/meeting-planner", "/blog"];
  return [
    ...routes.map((route) => ({ url: `${SITE_ORIGIN}${route}`, lastModified: new Date(), changeFrequency: route === "" ? "daily" as const : "weekly" as const })),
    ...posts.filter((post) => !post.noindex).map((post) => ({ url: `${SITE_ORIGIN}/blog/${post.slug}`, lastModified: new Date(post.updated_at), changeFrequency: "monthly" as const })),
  ];
}
