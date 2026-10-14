import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ refreshed: false }, { status: 401 });
  }

  revalidatePath("/world-clock/[city]", "page");
  revalidatePath("/sitemap.xml");
  return Response.json({ refreshed: true, invalidatedAt: new Date().toISOString() });
}
