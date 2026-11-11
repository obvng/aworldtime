import type { Metadata } from "next";
import { MeetingGrid } from "@/components/meeting-grid";
import { SiteHeader } from "@/components/site-header";
import { getEditableMainPageMetadata } from "@/lib/editable-page-metadata";
import { buildWebApplicationJsonLd, serializeJsonLd } from "@/lib/seo";

const title = "World Meeting Planner Across Time Zones";
const description = "Compare working hours across cities and time zones to find a practical meeting time for people in different countries.";

export async function generateMetadata(): Promise<Metadata> {
  return getEditableMainPageMetadata("/meeting-planner");
}

export default function MeetingPlannerPage() {
  return <div className="site-shell"><SiteHeader /><main className="tool-page"><header className="tool-intro"><h1>Meeting planner</h1><p>Compare working hours and find a fair time to meet.</p></header><MeetingGrid /></main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildWebApplicationJsonLd(title, description, "/meeting-planner")) }} /></div>;
}
