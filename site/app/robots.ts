import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const publicRule = { allow: "/", disallow: ["/admin/", "/preview/"] };
  return {
    rules: [
      { userAgent: "*", ...publicRule },
      { userAgent: "OAI-SearchBot", ...publicRule },
      { userAgent: "GPTBot", ...publicRule },
      { userAgent: "Claude-SearchBot", ...publicRule },
      { userAgent: "ClaudeBot", ...publicRule },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
