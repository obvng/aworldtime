"use client";

import { useEffect, useState } from "react";
import { formatDate, formatTimeWithPeriod } from "@/lib/time";

export function ZoneLiveTime({
  timeZone,
  initialNow,
  includeDate = false,
}: {
  timeZone: string;
  initialNow: string;
  includeDate?: boolean;
}) {
  const [now, setNow] = useState(() => new Date(initialNow));
  const displayed = formatTimeWithPeriod(now, timeZone, true);

  useEffect(() => {
    const sync = window.setTimeout(() => setNow(new Date()), 0);
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearTimeout(sync);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="zone-live-clock">
      <time data-testid="zone-live-time" dateTime={now.toISOString()}>
        {displayed.time} <span>{displayed.period}</span>
      </time>
      {includeDate ? <p>{formatDate(now, timeZone)}</p> : null}
    </div>
  );
}
