"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CITIES, countryCodeToFlag, findCity } from "@/lib/cities";
import { COUNTRY_TIME_PAGES } from "@/lib/country-times";
import { formatDate, formatTimeWithPeriod, timeZoneName } from "@/lib/time";

export function WorldClockDirectory() {
  const [query, setQuery] = useState("");
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const cities = useMemo(() => query ? findCity(query) : CITIES, [query]);

  return (
    <div>
      <section className="directory-country-links" aria-labelledby="country-time-heading">
        <div><p>Time tools</p><h2 id="country-time-heading">Country clocks and UTC</h2></div>
        <nav aria-label="Country time pages">
          <Link href="/utc">UTC time now</Link>
          {COUNTRY_TIME_PAGES.map((country) => <Link key={country.slug} href={`/time-in/${country.slug}`}>Time in {country.name}</Link>)}
        </nav>
      </section>
      <label className="directory-search">Find a city or time zone<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Nairobi, Japan, or GMT" /></label>
      <div className="directory-grid">
        {cities.map((city) => {
          const cityTime = formatTimeWithPeriod(now, city.timeZone, false);
          return <article key={city.slug}><p className="directory-city-name"><span role="img" aria-label={`${city.country} flag`}>{countryCodeToFlag(city.countryCode)}</span><Link href={`/world-clock/${city.slug}`}>{city.name}, {city.country}</Link></p><time>{cityTime.time} <span className="directory-clock-period">{cityTime.period}</span></time><small>{formatDate(now, city.timeZone)} · {timeZoneName(now, city.timeZone)}</small></article>;
        })}
      </div>
      {!cities.length ? <p className="empty-state">No city found. Try a country or time-zone abbreviation.</p> : null}
    </div>
  );
}
