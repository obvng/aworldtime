"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { postSchema } from "@/lib/post-validation";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

async function requireAdmin() {
  if (!hasSupabaseConfig()) redirect("/admin/login?error=Connect+Supabase+before+signing+in.");
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
  if (profile?.role !== "admin") redirect("/admin/login?error=This+account+does+not+have+administrator+access.");
  return { supabase, userId };
}

export async function signIn(formData: FormData) {
  if (!hasSupabaseConfig()) redirect("/admin/login?error=Connect+Supabase+before+signing+in.");
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin/login?error=Email+or+password+is+incorrect.");
  redirect("/admin");
}

export async function signOut() {
  if (hasSupabaseConfig()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

export async function savePost(id: string | null, formData: FormData) {
  const { supabase, userId } = await requireAdmin();
  const parsed = postSchema.safeParse({
    title: formData.get("title"), slug: formData.get("slug"), excerpt: formData.get("excerpt"), content: formData.get("content"), category: formData.get("category"), status: formData.get("status"), published_at: formData.get("published_at"), seo_title: formData.get("seo_title"), meta_description: formData.get("meta_description"), canonical_url: formData.get("canonical_url"), og_title: formData.get("og_title"), og_description: formData.get("og_description"), noindex: formData.get("noindex") === "on",
  });
  if (!parsed.success) redirect(`/admin/posts/${id ?? "new"}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Check the post fields.")}`);

  const values = parsed.data;
  let featuredImageUrl: string | null | undefined;
  const image = formData.get("featured_image");
  if (image instanceof File && image.size > 0) {
    if (image.size > 5_000_000) redirect(`/admin/posts/${id ?? "new"}?error=The+image+must+be+smaller+than+5MB.`);
    const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, image, { contentType: image.type, upsert: false });
    if (error) redirect(`/admin/posts/${id ?? "new"}?error=${encodeURIComponent(error.message)}`);
    featuredImageUrl = supabase.storage.from("blog-images").getPublicUrl(path).data.publicUrl;
  }

  const payload = {
    ...values,
    published_at: values.status === "published" && !values.published_at ? new Date().toISOString() : values.published_at ? new Date(values.published_at).toISOString() : null,
    seo_title: values.seo_title || null,
    meta_description: values.meta_description || null,
    canonical_url: values.canonical_url || null,
    og_title: values.og_title || null,
    og_description: values.og_description || null,
    author_id: userId,
    ...(featuredImageUrl ? { featured_image_url: featuredImageUrl } : {}),
  };
  const query = id ? supabase.from("posts").update(payload).eq("id", id) : supabase.from("posts").insert(payload);
  const { error } = await query;
  if (error) redirect(`/admin/posts/${id ?? "new"}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/"); revalidatePath("/blog"); revalidatePath(`/blog/${values.slug}`);
  redirect("/admin");
}

export async function deletePost(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/blog");
  redirect("/admin");
}
