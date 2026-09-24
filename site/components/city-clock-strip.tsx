"use client";

import { useEffect, useState } from "react";
import { POPULAR_CITIES } from "@/lib/cities";
import { formatTime, timeZoneName } from "@/lib/time";

export function CityClockStrip() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="city-section" aria-labelledby="popular-cities-heading">
      <div className="section-heading">
        <h2 id="popular-cities-heading">Popular cities</h2>
        <a href="/world-clock">See all</a>
      </div>
      <div className="city-clock-strip">
        {POPULAR_CITIES.map((city) => (
          <article className="city-clock" key={city.timeZone}>
            <p>{city.name}</p>
            <time dateTime={now.toISOString()}>{formatTime(now, city.timeZone, false)}</time>
            <small>{timeZoneName(now, city.timeZone)}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
