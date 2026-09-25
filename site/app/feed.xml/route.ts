import { listPublishedPosts } from "@/lib/posts";
import { postUrl, SITE_ORIGIN, xmlEscape } from "@/lib/seo";

export async function GET() {
  const posts = await listPublishedPosts();
  const items = posts.map((post) => `<item><title>${xmlEscape(post.title)}</title><link>${xmlEscape(postUrl(post))}</link><guid>${xmlEscape(postUrl(post))}</guid><description>${xmlEscape(post.excerpt)}</description><pubDate>${new Date(post.published_at as string).toUTCString()}</pubDate></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>AWORLDTIME.COM</title><link>${SITE_ORIGIN}</link><description>Time-zone and global meeting guides.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=900" } });
}
