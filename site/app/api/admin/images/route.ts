import { adminAuthResponse, requireAdmin } from "@/lib/admin-auth";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(request: Request) {
  try {
    const { supabase, userId } = await requireAdmin();
    const formData = await request.formData();
    const image = formData.get("image");
    const alt = String(formData.get("alt") ?? "").trim() || "Image description";

    if (typeof image === "string" || image === null || image.size === 0) {
      return Response.json({ error: "Choose an image to upload." }, { status: 400 });
    }
    const extension = allowedTypes.get(image.type);
    if (!extension) {
      return Response.json({ error: "Use a PNG, JPEG, or WebP image." }, { status: 415 });
    }
    if (image.size > 5_000_000) {
      return Response.json({ error: "The image must be smaller than 5 MB." }, { status: 413 });
    }

    const path = `${userId}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, image, {
      contentType: image.type,
      upsert: false,
    });
    if (error) return Response.json({ error: error.message }, { status: 500 });

    const url = supabase.storage.from("blog-images").getPublicUrl(path).data.publicUrl;
    return Response.json({ url, markdown: `![${alt.replaceAll("]", "")}](${url})` });
  } catch (error) {
    return adminAuthResponse(error);
  }
}
