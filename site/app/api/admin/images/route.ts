import { adminAuthResponse, requireAdmin } from "@/lib/admin-auth";
import { ImageUploadError, sanitizeImageUpload } from "@/lib/image-security";
import { exceedsContentLength, hasContentType, rejectCrossSiteMutation } from "@/lib/request-security";

const MAX_MULTIPART_BYTES = 5_500_000;

export async function POST(request: Request) {
  try {
    const crossSite = rejectCrossSiteMutation(request);
    if (crossSite) return crossSite;
    if (!hasContentType(request, "multipart/form-data")) {
      return Response.json({ error: "Expected a multipart image upload." }, { status: 415 });
    }
    if (exceedsContentLength(request, MAX_MULTIPART_BYTES)) {
      return Response.json({ error: "The upload is too large." }, { status: 413 });
    }
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
