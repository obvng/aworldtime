"use client";

import { useEffect, useState } from "react";
import { countryCodeToFlag, POPULAR_CITIES } from "@/lib/cities";
import { formatTime, timeZoneName } from "@/lib/time";

export function CityClockStrip({ initialNow }: { initialNow: string }) {
  const [now, setNow] = useState(() => new Date(initialNow));
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <section className="city-section" aria-labelledby="popular-cities-heading">
      <div className="section-heading">
        <h2 id="popular-cities-heading">Popular cities</h2>
        <a href="/world-clock">See all</a>
      </div>
      <div
        className="city-clock-strip"
        style={compact ? {
          width: "100%",
          paddingRight: 0,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
          overflow: "visible",
          scrollSnapType: "none",
        } : undefined}
      >
        {POPULAR_CITIES.map((city) => (
          <article
            className="city-clock"
            key={city.timeZone}
            style={compact ? {
              minWidth: 0,
              minHeight: 112,
              padding: "13px 10px",
              borderRadius: 18,
              flex: "initial",
            } : undefined}
          >
            <p className="city-name-with-flag">
              <span className="city-card-flag" role="img" aria-label={`${city.country} flag`}>
                {countryCodeToFlag(city.countryCode)}
              </span>
              {city.name}
            </p>
            <time dateTime={now.toISOString()}>{formatTime(now, city.timeZone, false)}</time>
            <small>{timeZoneName(now, city.timeZone)}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
