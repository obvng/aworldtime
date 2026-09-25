import Link from "next/link";
import { CalendarDays, Clock3 } from "lucide-react";
import { CityClockStrip } from "@/components/city-clock-strip";
import { LocalTimeHero } from "@/components/local-time-hero";
import { PostCard } from "@/components/blog/post-card";
import { SiteHeader } from "@/components/site-header";
import { listPublishedPosts, selectLatestGuides } from "@/lib/posts";

export default async function Home() {
  const initialNow = new Date().toISOString();
  const guides = selectLatestGuides(await listPublishedPosts());
  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <LocalTimeHero now={initialNow} detectTimeZone />
        <CityClockStrip initialNow={initialNow} />

        <section className="quick-actions" aria-label="Time tools">
          <Link href="/converter" className="quick-action quick-action-blue">
            <span><Clock3 aria-hidden="true" /></span>
            <div><strong>Convert time</strong><small>See the same moment anywhere.</small></div>
          </Link>
          <Link href="/meeting-planner" className="quick-action quick-action-amber">
            <span><CalendarDays aria-hidden="true" /></span>
            <div><strong>Plan a meeting</strong><small>Find a fair hour across time zones.</small></div>
          </Link>
        </section>

        <section className="guide-section" aria-labelledby="latest-guides-heading">
          <div className="section-heading">
            <h2 id="latest-guides-heading">Latest guides</h2>
            <Link href="/blog">View all articles</Link>
          </div>
          <div className="guide-grid">
            {guides.map((guide) => (
              <PostCard
                key={guide.id}
                title={guide.title}
                excerpt={guide.excerpt}
                category={guide.category}
                href={`/blog/${guide.slug}`}
                imageUrl={guide.featured_image_url}
              />
            ))}
          </div>
        </section>
      </main>
      <footer>
        <span>AWORLDTIME.COM</span>
        <p>Clear local time, wherever you are.</p>
      </footer>
    </div>
  );
}
