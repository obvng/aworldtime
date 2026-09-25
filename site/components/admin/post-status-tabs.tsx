import Link from "next/link";

import type { PostStatus } from "@/lib/posts";

type Filter = "all" | PostStatus;

export function PostStatusTabs({ active, counts }: { active: Filter; counts: Record<Filter, number> }) {
  const tabs: Array<{ value: Filter; label: string }> = [
    { value: "all", label: "All" },
    { value: "draft", label: "Drafts" },
    { value: "scheduled", label: "Scheduled" },
    { value: "published", label: "Published" },
  ];

  return (
    <nav className="admin-status-tabs" aria-label="Filter posts by status">
      {tabs.map((tab) => (
        <Link key={tab.value} href={tab.value === "all" ? "/admin" : `/admin?status=${tab.value}`} aria-current={active === tab.value ? "page" : undefined}>
          {tab.label} <span>{counts[tab.value]}</span>
        </Link>
      ))}
    </nav>
  );
}
