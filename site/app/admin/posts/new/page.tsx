import type { Metadata } from "next";
import Link from "next/link";
import { PostEditor } from "@/components/admin/post-editor";

export const metadata: Metadata = { title: "New post | AWORLDTIME.COM", robots: { index: false, follow: false } };

export default async function NewPostPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="admin-shell"><div className="admin-top"><Link href="/admin">← Posts</Link><strong>New article</strong></div>{error ? <div className="admin-error" role="alert">{error}</div> : null}<PostEditor /></main>;
}
