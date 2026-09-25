export type PostStatus = "draft" | "scheduled" | "published";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  noindex: boolean;
  author_id: string;
};

const SAMPLE_POSTS: Post[] = [
  {
    id: "sample-meeting-guide",
    title: "How to plan a meeting across time zones",
    slug: "plan-a-meeting-across-time-zones",
    excerpt: "A simple way to find a fair hour for everyone.",
    content: "Start with the working hours in each city, then look for the overlap. A 9:00 meeting in Lagos is 8:00 in London during British Summer Time and 4:00 in New York during Eastern Daylight Time.\n\nUse the meeting planner to compare the whole day before choosing a time. Confirm the date as well as the hour because some conversions cross midnight.",
    category: "Meeting guide",
    featured_image_url: null,
    featured_image_alt: null,
    status: "published",
    published_at: "2026-09-20T09:00:00Z",
    created_at: "2026-09-20T09:00:00Z",
    updated_at: "2026-09-20T09:00:00Z",
    seo_title: "How to Plan a Meeting Across Time Zones",
    meta_description: "Compare working hours and choose a fair meeting time across several time zones.",
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    noindex: false,
    author_id: "sample",
  },
  {
    id: "sample-dst-guide",
    title: "Daylight saving time in 2026: what to know",
    slug: "daylight-saving-time-2026",
    excerpt: "Why the time difference between two cities can change during the year.",
    content: "Not every country changes its clocks, and those that do may change on different dates. That means the time difference between two cities can shift even when neither city moves.\n\nCheck the date in the converter instead of relying on a time difference you remembered from another month.",
    category: "Time zones",
    featured_image_url: null,
    featured_image_alt: null,
    status: "published",
    published_at: "2026-09-18T09:00:00Z",
    created_at: "2026-09-18T09:00:00Z",
    updated_at: "2026-09-18T09:00:00Z",
    seo_title: "Daylight Saving Time in 2026",
    meta_description: "Learn why time differences change during the year and how to check a future date.",
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    noindex: false,
    author_id: "sample",
  },
];

export function fixturePost(overrides: Partial<Post> = {}): Post {
  return { ...SAMPLE_POSTS[0], ...overrides };
}

export function isPublicPost(post: Post, now = new Date()) {
  return post.status === "published" && Boolean(post.published_at) && new Date(post.published_at as string) <= now;
}

export function selectLatestGuides(posts: Post[], now = new Date()) {
  return posts
    .filter((post) => isPublicPost(post, now))
    .sort((left, right) =>
      new Date(right.published_at as string).getTime() - new Date(left.published_at as string).getTime(),
    )
    .slice(0, 2);
}

export async function listPublishedPosts(): Promise<Post[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return SAMPLE_POSTS.filter((post) => isPublicPost(post));
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase.from("posts").select("*").eq("status", "published").lte("published_at", new Date().toISOString()).order("published_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Post[];
  } catch {
    return SAMPLE_POSTS.filter((post) => isPublicPost(post));
  }
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  const posts = await listPublishedPosts();
  return posts.find((post) => post.slug === slug && isPublicPost(post)) ?? null;
}
