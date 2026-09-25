"use client";

import { useEffect, useState } from "react";
import { countryCodeToFlag, POPULAR_CITIES } from "@/lib/cities";
import { formatTimeWithPeriod, timeZoneName } from "@/lib/time";

export function CityClockStrip({ initialNow }: { initialNow: string }) {
  const [now, setNow] = useState(() => new Date(initialNow));

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
        {POPULAR_CITIES.map((city) => {
          const cityTime = formatTimeWithPeriod(now, city.timeZone, false);
          return <article className="city-clock" key={city.timeZone}>
            <p className="city-name-with-flag">
              <span className="city-card-flag" role="img" aria-label={`${city.country} flag`}>
                {countryCodeToFlag(city.countryCode)}
              </span>
              {city.name}
            </p>
            <time dateTime={now.toISOString()}>{cityTime.time} <span className="city-clock-period">{cityTime.period}</span></time>
            <small>{timeZoneName(now, city.timeZone)}</small>
          </article>
        })}
      </div>
    </section>
  );
}
