import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PostEditor } from "@/components/admin/post-editor";
import type { Post } from "@/lib/posts";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Edit post | AWORLDTIME.COM", robots: { index: false, follow: false } };

export default async function EditPostPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  if (!hasSupabaseConfig()) redirect("/admin");
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("id", id).single();
  if (!data) notFound();
  return <main className="admin-shell"><div className="admin-top"><Link href="/admin">← Posts</Link><strong>Edit article</strong></div>{error ? <div className="admin-error" role="alert">{error}</div> : null}<PostEditor post={data as Post} /></main>;
}
