import type { Metadata } from "next";
import { PostCard } from "@/components/blog/post-card";
import { SiteHeader } from "@/components/site-header";
import { listPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = { title: "Time and Travel Guides | AWORLDTIME.COM", description: "Practical guides about time zones, meetings, calendars, and global travel." };

export default async function BlogPage() {
  const posts = await listPublishedPosts();
  return <div className="site-shell"><SiteHeader /><main className="tool-page"><header className="tool-intro"><h1>Time guides</h1><p>Clear answers for meetings, travel, and changing clocks.</p></header><div className="blog-list">{posts.map((post) => <PostCard key={post.id} title={post.title} excerpt={post.excerpt} category={post.category} href={`/blog/${post.slug}`} />)}</div></main></div>;
}
