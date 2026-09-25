import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { PostStatusTabs } from "@/components/admin/post-status-tabs";
import { requireAdminPage } from "@/lib/admin-auth";
import type { Post } from "@/lib/posts";

export const metadata: Metadata = { title: "Blog admin | AWORLDTIME.COM", robots: { index: false, follow: false } };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { supabase, userId } = await requireAdminPage();
  const requestedStatus = (await searchParams).status;
  const activeStatus = (["draft", "scheduled", "published"].includes(requestedStatus ?? "") ? requestedStatus : "all") as "all" | Post["status"];
  const { data } = await supabase.from("posts").select("*").eq("author_id", userId).order("updated_at", { ascending: false });
  const posts = (data ?? []) as Post[];
  const counts = { all: posts.length, draft: posts.filter((post) => post.status === "draft").length, scheduled: posts.filter((post) => post.status === "scheduled").length, published: posts.filter((post) => post.status === "published").length };
  const visiblePosts = activeStatus === "all" ? posts : posts.filter((post) => post.status === activeStatus);
  return <main className="admin-shell"><div className="admin-top"><strong>AWORLDTIME.COM</strong><div><Link href="/">View site</Link><form action={signOut}><button type="submit">Sign out</button></form></div></div><header className="admin-heading"><div><h1>Blog posts</h1><p>Write, schedule, publish, and update your search settings.</p></div><Link href="/admin/posts/new" className="admin-primary">New post</Link></header><PostStatusTabs active={activeStatus} counts={counts} /><div className="admin-table"><div className="admin-table-head"><span>Title</span><span>Status</span><span>Updated</span><span /></div>{visiblePosts.map((post) => <div className="admin-table-row" key={post.id}><span><strong>{post.title}</strong><small>/blog/{post.slug}</small></span><span className={`status status-${post.status}`}>{post.status}</span><span><small>{post.published_at ? `Publishes ${new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(post.published_at))}` : "Not published"}</small>{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(post.updated_at))}</span><span className="row-actions"><Link href={`/admin/posts/${post.id}`}>Edit</Link>{post.status === "published" ? <Link href={`/blog/${post.slug}`} target="_blank">Preview</Link> : null}<DeletePostButton id={post.id} title={post.title} /></span></div>)}{visiblePosts.length === 0 ? <p className="admin-empty">No {activeStatus === "all" ? "posts" : activeStatus} articles found.</p> : null}</div></main>;
}
