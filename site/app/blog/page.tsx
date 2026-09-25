import type { Metadata } from "next";
import { PostCard } from "@/components/blog/post-card";
import { SiteHeader } from "@/components/site-header";
import { listPublishedPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Time Zone, Travel and Meeting Guides",
  description: "Read practical guides about time zones, daylight saving changes, international meetings, calendars, and global travel planning.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await listPublishedPosts();
  return <div className="site-shell"><SiteHeader /><main className="tool-page"><header className="tool-intro"><h1>Time guides</h1><p>Clear answers for meetings, travel, and changing clocks.</p></header><div className="blog-list">{posts.map((post) => <PostCard key={post.id} title={post.title} excerpt={post.excerpt} category={post.category} href={`/blog/${post.slug}`} />)}</div></main></div>;
}
