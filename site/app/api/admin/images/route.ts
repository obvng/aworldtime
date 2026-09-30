import { adminAuthResponse, requireAdmin } from "@/lib/admin-auth";
import { ImageUploadError, sanitizeImageUpload } from "@/lib/image-security";

export async function POST(request: Request) {
  try {
    const { supabase, userId } = await requireAdmin();
    const formData = await request.formData();
    const image = formData.get("image");
    const alt = String(formData.get("alt") ?? "").trim() || "Image description";

    if (typeof image === "string" || image === null || image.size === 0) {
      return Response.json({ error: "Choose an image to upload." }, { status: 400 });
    }
    const safeImage = await sanitizeImageUpload(image);

    const path = `${userId}/${crypto.randomUUID()}.${safeImage.extension}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, safeImage.body, {
      contentType: safeImage.mimeType,
      upsert: false,
    });
    if (error) return Response.json({ error: error.message }, { status: 500 });

    const url = supabase.storage.from("blog-images").getPublicUrl(path).data.publicUrl;
    return Response.json({ url, markdown: `![${alt.replaceAll("]", "")}](${url})` });
  } catch (error) {
    if (error instanceof ImageUploadError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return adminAuthResponse(error);
  }
}
