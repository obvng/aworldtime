import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageSeoForm } from "@/components/admin-page-seo-form";
import { CITIES, cityBySlug } from "@/lib/cities";
import { citySeoTitle } from "@/lib/city-seo";
import { COUNTRY_TIME_PAGES, countrySeoDescription, countrySeoTitle, countryTimeBySlug } from "@/lib/country-times";
import { requireAdminPage } from "@/lib/admin-auth";
import type { PageSeo } from "@/lib/page-seo";

export const metadata: Metadata = { title: "Page SEO | AWORLDTIME.COM", robots: { index: false, follow: false } };

export default async function PageSeoAdminPage({ searchParams }: { searchParams: Promise<{ city?: string; country?: string; path?: string }> }) {
  const query = await searchParams;
  const requestedCountry = countryTimeBySlug(query.country ?? "") ?? (query.path?.startsWith("/time-in/") ? countryTimeBySlug(query.path.slice(9)) : undefined);
  const requestedCity = cityBySlug(query.city ?? "") ?? (query.path?.startsWith("/world-clock/") ? cityBySlug(query.path.slice(13)) : undefined);
  const city = requestedCountry ? undefined : requestedCity ?? CITIES[0];
  const path = requestedCountry ? `/time-in/${requestedCountry.slug}` : `/world-clock/${city!.slug}`;
  const { supabase } = await requireAdminPage();
  const { data } = await supabase.from("page_seo").select("path,seo_title,meta_description,updated_at").eq("path", path).maybeSingle();
  const saved = data as PageSeo | null;
  const defaultTitle = requestedCountry ? countrySeoTitle(requestedCountry) : citySeoTitle(city!);
  const defaultDescription = requestedCountry
    ? countrySeoDescription(requestedCountry)
    : `See the current time in ${city!.name}, ${city!.country}, its UTC offset, daylight-saving status, sunrise, sunset and next clock change.`;

  return (
    <main className="admin-shell">
      <div className="admin-top"><Link href="/admin">← Admin</Link><strong>Page SEO</strong></div>
      <header className="admin-heading"><div><h1>Edit page search text</h1><p>Saved values replace the generated title and description on that page.</p></div><Link href={path} target="_blank">View page</Link></header>
      <form method="get" className="admin-seo-picker">
        <label>Page<select name="path" defaultValue={path}>
          <optgroup label="Country pages">{COUNTRY_TIME_PAGES.map((item) => <option key={item.slug} value={`/time-in/${item.slug}`}>{item.name}</option>)}</optgroup>
          <optgroup label="City pages">{CITIES.map((item) => <option key={item.slug} value={`/world-clock/${item.slug}`}>{item.name}, {item.country}</option>)}</optgroup>
        </select></label>
        <button type="submit">Load page</button>
      </form>
      <AdminPageSeoForm key={path} path={path} title={saved?.seo_title ?? defaultTitle} description={saved?.meta_description ?? defaultDescription} />
    </main>
  );
}
