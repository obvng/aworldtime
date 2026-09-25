import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { WorldClockDirectory } from "@/components/world-clock-directory";
import { buildPageMetadata, buildWebApplicationJsonLd, serializeJsonLd } from "@/lib/seo";

const title = "World Clock: Current Time Around the World";
const description = "Check the current local time and time-zone offset for major cities around the world in one clear global clock.";

export const metadata: Metadata = buildPageMetadata({ title, description, path: "/world-clock" });

export default function WorldClockPage() {
  return <div className="site-shell"><SiteHeader /><main className="tool-page"><header className="tool-intro"><h1>World clock</h1><p>Find the current time in cities around the world.</p></header><WorldClockDirectory /></main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildWebApplicationJsonLd(title, description, "/world-clock")) }} /></div>;
}
