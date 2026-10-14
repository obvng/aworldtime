import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { TimeConverter } from "@/components/time-converter";
import { buildPageMetadata, buildWebApplicationJsonLd, serializeJsonLd } from "@/lib/seo";
import { resolveConverterSelections } from "@/lib/converter-usage";

const title = "Time Zone Converter: Compare Times Worldwide";
const description = "Convert a date and time between cities worldwide and see the corresponding local time across international time zones.";

export const metadata: Metadata = buildPageMetadata({ title, description, path: "/converter" });

export default async function ConverterPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const selections = resolveConverterSelections(await searchParams);
  return <div className="site-shell"><SiteHeader /><main className="tool-page"><header className="tool-intro"><h1>Time-zone converter</h1><p>See the corresponding date and time in another city.</p></header><TimeConverter initialFrom={selections.from} initialTo={selections.to} /></main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildWebApplicationJsonLd(title, description, "/converter")) }} /></div>;
}
