import type { Metadata } from "next";
import { MeetingGrid } from "@/components/meeting-grid";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Meeting Planner | AWORLDTIME.COM", description: "Compare working hours across two time zones." };

export default function MeetingPlannerPage() {
  return <div className="site-shell"><SiteHeader /><main className="tool-page"><header className="tool-intro"><h1>Meeting planner</h1><p>Compare working hours and find a fair time to meet.</p></header><MeetingGrid /></main></div>;
}
