import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { WorldClockDirectory } from "@/components/world-clock-directory";

export const metadata: Metadata = { title: "World Clock | AWORLDTIME.COM", description: "Current local time in cities around the world." };

export default function WorldClockPage() {
  return <div className="site-shell"><SiteHeader /><main className="tool-page"><header className="tool-intro"><h1>World clock</h1><p>Find the current time in cities around the world.</p></header><WorldClockDirectory /></main></div>;
}
