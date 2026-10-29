"use client";

import { useEffect, useState } from "react";
import { formatDate, formatTimeWithPeriod } from "@/lib/time";

export function CityLiveClock({ timeZone, initialNow }: { timeZone: string; initialNow?: string }) {
  const [now, setNow] = useState<Date | null>(() => initialNow ? new Date(initialNow) : null);
  const displayed = now ? formatTimeWithPeriod(now, timeZone, true) : null;

  useEffect(() => {
    const sync = window.setTimeout(() => setNow(new Date()), 0);
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearTimeout(sync);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="city-page-clock">
      {now && displayed ? <>
        <time data-testid="city-live-time" dateTime={now.toISOString()}>
          {displayed.time} <span>{displayed.period}</span>
        </time>
        <p>{formatDate(now, timeZone)}</p>
      </> : <p className="city-clock-loading" data-testid="city-live-time">Local time loads in your browser</p>}
    </div>
  );
}
