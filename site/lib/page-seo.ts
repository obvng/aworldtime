import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { z } from "zod";

export type PageSeo = {
  path: string;
  seo_title: string | null;
  meta_description: string | null;
  updated_at: string;
};

export const pageSeoSchema = z.object({
  path: z.string().regex(/^\/world-clock\/[a-z0-9]+(?:-[a-z0-9]+)*$/),
  seo_title: z.string().trim().min(10).max(70),
  meta_description: z.string().trim().min(50).max(170),
});

type SeoClient = {
  from: (table: string) => {
    upsert: (payload: Record<string, unknown>, options: { onConflict: string }) => {
      select: (columns: string) => {
        single: () => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  };
};

export async function persistPageSeo(client: SeoClient, input: z.input<typeof pageSeoSchema>) {
  const values = pageSeoSchema.parse(input);
  const { data, error } = await client
    .from("page_seo")
    .upsert(values, { onConflict: "path" })
    .select("path,seo_title,meta_description,updated_at")
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("The database did not return the saved SEO settings.");

  const saved = data as PageSeo;
  if (saved.path !== values.path || saved.seo_title !== values.seo_title || saved.meta_description !== values.meta_description) {
    throw new Error("The database returned different SEO settings after saving. Your changes were not applied.");
  }
  return saved;
}

export async function getPageSeo(path: string): Promise<PageSeo | null> {
  if (!hasSupabaseConfig()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("page_seo").select("path,seo_title,meta_description,updated_at").eq("path", path).maybeSingle();
    if (error) throw error;
    return data as PageSeo | null;
  } catch {
    return null;
  }
}

export async function listPageSeo(): Promise<PageSeo[]> {
  if (!hasSupabaseConfig()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("page_seo").select("path,seo_title,meta_description,updated_at");
    if (error) throw error;
    return (data ?? []) as PageSeo[];
  } catch {
    return [];
  }
}
