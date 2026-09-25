import { z } from "zod";

import { adminAuthResponse, requireAdmin } from "@/lib/admin-auth";
import { normalizeSlug } from "@/lib/post-validation";

const autosaveSchema = z.object({
  title: z.string().trim().max(180),
  slug: z.string().transform(normalizeSlug),
  excerpt: z.string().trim().max(320),
  content: z.string(),
  category: z.string().trim().min(1).max(80),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, userId } = await requireAdmin();
    const parsed = autosaveSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "The draft contains invalid fields." }, { status: 400 });

    const { id } = await params;
    const { data: current } = await supabase.from("posts").select("status, author_id").eq("id", id).single();
    if (!current || current.author_id !== userId) return Response.json({ error: "Draft not found." }, { status: 404 });
    if (current.status !== "draft") return Response.json({ error: "Only drafts can be autosaved." }, { status: 409 });

    const { data, error } = await supabase
      .from("posts")
      .update(parsed.data)
      .eq("id", id)
      .eq("author_id", userId)
      .eq("status", "draft")
      .select("updated_at")
      .single();
    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ savedAt: data.updated_at });
  } catch (error) {
    return adminAuthResponse(error);
  }
}
