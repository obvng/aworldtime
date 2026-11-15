import { z } from "zod";

import { adminAuthResponse, requireAdmin } from "@/lib/admin-auth";
import { normalizeSlug } from "@/lib/post-validation";
import { exceedsContentLength, hasContentType, rejectCrossSiteMutation } from "@/lib/request-security";

const MAX_AUTOSAVE_BYTES = 300_000;

const autosaveSchema = z.object({
  title: z.string().trim().max(180),
  slug: z.string().transform(normalizeSlug),
  excerpt: z.string().trim().max(320),
  content: z.string().max(250_000),
  category: z.string().trim().min(1).max(80),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const crossSite = rejectCrossSiteMutation(request);
    if (crossSite) return crossSite;
    if (!hasContentType(request, "application/json")) return Response.json({ error: "Expected JSON." }, { status: 415 });
    if (exceedsContentLength(request, MAX_AUTOSAVE_BYTES)) return Response.json({ error: "The draft is too large." }, { status: 413 });
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
