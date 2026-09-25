import type { MetadataRoute } from "next";
import { listPublishedPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

const STATIC_LAST_MODIFIED = new Date("2026-09-25T00:00:00.000Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPublishedPosts();
  const routes = ["/", "/world-clock", "/converter", "/meeting-planner", "/blog"];
  return [
    ...routes.map((route) => ({ url: absoluteUrl(route), lastModified: STATIC_LAST_MODIFIED, changeFrequency: route === "/" ? "daily" as const : "weekly" as const })),
    ...posts.filter((post) => !post.noindex).map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: new Date(post.updated_at), changeFrequency: "monthly" as const })),
  ];
}
