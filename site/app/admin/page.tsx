import type { Metadata } from "next";
import Link from "next/link";
import { deletePost, signOut } from "@/app/admin/actions";
import { requireAdminPage } from "@/lib/admin-auth";
import type { Post } from "@/lib/posts";

export const metadata: Metadata = { title: "Blog admin | AWORLDTIME.COM", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const { supabase } = await requireAdminPage();
  const { data } = await supabase.from("posts").select("*").order("updated_at", { ascending: false });
  const posts = (data ?? []) as Post[];
  return <main className="admin-shell"><div className="admin-top"><strong>AWORLDTIME.COM</strong><div><Link href="/">View site</Link><form action={signOut}><button type="submit">Sign out</button></form></div></div><header className="admin-heading"><div><h1>Blog posts</h1><p>Write, schedule, publish, and update your search settings.</p></div><Link href="/admin/posts/new" className="admin-primary">New post</Link></header><div className="admin-table"><div className="admin-table-head"><span>Title</span><span>Status</span><span>Updated</span><span /></div>{posts.map((post) => <div className="admin-table-row" key={post.id}><span><strong>{post.title}</strong><small>/blog/{post.slug}</small></span><span className={`status status-${post.status}`}>{post.status}</span><span>{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(post.updated_at))}</span><span className="row-actions"><Link href={`/admin/posts/${post.id}`}>Edit</Link><form action={deletePost.bind(null, post.id)}><button type="submit">Delete</button></form></span></div>)}{posts.length === 0 ? <p className="admin-empty">No posts yet. Create your first article.</p> : null}</div></main>;
}
