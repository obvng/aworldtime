import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageSeoForm } from "@/components/admin-page-seo-form";
import { CITIES, cityBySlug } from "@/lib/cities";
import { requireAdminPage } from "@/lib/admin-auth";
import type { PageSeo } from "@/lib/page-seo";

export const metadata: Metadata = { title: "City page SEO | AWORLDTIME.COM", robots: { index: false, follow: false } };

export default async function CitySeoAdminPage({ searchParams }: { searchParams: Promise<{ city?: string }> }) {
  const query = await searchParams;
  const city = cityBySlug(query.city ?? "lagos") ?? CITIES[0];
  const path = `/world-clock/${city.slug}`;
  const { supabase } = await requireAdminPage();
  const { data } = await supabase.from("page_seo").select("path,seo_title,meta_description,updated_at").eq("path", path).maybeSingle();
  const saved = data as PageSeo | null;
  const defaultTitle = `Current Time in ${city.name}, ${city.country}`;
  const defaultDescription = `See the current time in ${city.name}, ${city.country}, its UTC offset, daylight-saving status, sunrise, sunset and next clock change.`;

  return (
    <main className="admin-shell">
      <div className="admin-top"><Link href="/admin">← Admin</Link><strong>City page SEO</strong></div>
      <header className="admin-heading"><div><h1>Edit city search text</h1><p>Saved values replace the generated title and description on that city page.</p></div><Link href={path} target="_blank">View page</Link></header>
      <form method="get" className="admin-seo-picker">
        <label>City<select name="city" defaultValue={city.slug}>{CITIES.map((item) => <option key={item.slug} value={item.slug}>{item.name}, {item.country}</option>)}</select></label>
        <button type="submit">Load city</button>
      </form>
      <AdminPageSeoForm key={path} path={path} title={saved?.seo_title ?? defaultTitle} description={saved?.meta_description ?? defaultDescription} />
    </main>
  );
}
