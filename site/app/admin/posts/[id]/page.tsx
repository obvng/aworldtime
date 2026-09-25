import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/post-editor";
import { requireAdminPage } from "@/lib/admin-auth";
import type { Post } from "@/lib/posts";

export const metadata: Metadata = { title: "Edit post | AWORLDTIME.COM", robots: { index: false, follow: false } };

export default async function EditPostPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const { supabase } = await requireAdminPage();
  const { data } = await supabase.from("posts").select("*").eq("id", id).single();
  if (!data) notFound();
  return <main className="admin-shell"><div className="admin-top"><Link href="/admin">← Posts</Link><strong>Edit article</strong></div>{error ? <div className="admin-error" role="alert">{error}</div> : null}<PostEditor post={data as Post} /></main>;
}
