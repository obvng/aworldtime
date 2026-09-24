"use client";

import { useEffect, useMemo, useState } from "react";
import { CITIES, findCity } from "@/lib/cities";
import { formatDate, formatTime, timeZoneName } from "@/lib/time";

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
      <label className="directory-search">Find a city or time zone<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Nairobi, Japan, or GMT" /></label>
      <div className="directory-grid">
        {cities.map((city) => <article key={city.timeZone}><p>{city.name}, {city.country}</p><time>{formatTime(now, city.timeZone, false)}</time><small>{formatDate(now, city.timeZone)} · {timeZoneName(now, city.timeZone)}</small></article>)}
      </div>
      {!cities.length ? <p className="empty-state">No city found. Try a country or time-zone abbreviation.</p> : null}
    </div>
  );
}
