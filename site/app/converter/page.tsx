import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { TimeConverter } from "@/components/time-converter";

export const metadata: Metadata = { title: "Time Zone Converter | AWORLDTIME.COM", description: "Convert a date and time between world cities." };

export default function ConverterPage() {
  return <div className="site-shell"><SiteHeader /><main className="tool-page"><header className="tool-intro"><h1>Time-zone converter</h1><p>See the corresponding date and time in another city.</p></header><TimeConverter /></main></div>;
}
