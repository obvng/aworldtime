"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CITIES, cityBySlug } from "@/lib/cities";
import { citySlugForSelection } from "@/lib/converter-usage";
import { convertWallTime } from "@/lib/time";

type TimeConverterProps = {
  initialDate?: string;
  initialTime?: string;
  initialFrom?: string;
  initialTo?: string;
};

export function TimeConverter({
  initialDate = new Date().toISOString().slice(0, 10),
  initialTime = "09:00",
  initialFrom = "Africa/Lagos",
  initialTo = "Europe/London",
}: TimeConverterProps) {
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [from, setFrom] = useState(() => citySlugForSelection(initialFrom, "lagos"));
  const [to, setTo] = useState(() => citySlugForSelection(initialTo, "london"));
  const hasChangedPair = useRef(false);
  const source = cityBySlug(from);
  const destination = cityBySlug(to);
  const converted = useMemo(() => {
    try {
      if (!source || !destination) return null;
      return convertWallTime({ date, time, from: source.timeZone, to: destination.timeZone });
    } catch {
      return null;
    }
  }, [date, time, source, destination]);

  useEffect(() => {
    if (!hasChangedPair.current) {
      hasChangedPair.current = true;
      return;
    }
    if (from === to) return;
    const timer = window.setTimeout(() => {
      fetch("/api/converter-usage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ from, to }),
        keepalive: true,
      }).catch(() => undefined);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [from, to]);

  return (
    <div className="converter-card">
      <div className="converter-fields">
        <label>From
          <select value={from} onChange={(event) => setFrom(event.target.value)}>
            {CITIES.map((city) => <option key={city.slug} value={city.slug}>{city.name}, {city.country}</option>)}
          </select>
        </label>
        <label>Date
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label>Time
          <input type="time" value={time} onChange={(event) => setTime(event.target.value)} />
        </label>
        <label>To
          <select value={to} onChange={(event) => setTo(event.target.value)}>
            {CITIES.map((city) => <option key={city.slug} value={city.slug}>{city.name}, {city.country}</option>)}
          </select>
        </label>
      </div>
      <output className="converted-result" aria-live="polite">
        <span>{destination?.name ?? to}</span>
        <strong data-testid="converted-time">{converted?.time ?? "--:--"}</strong>
        <small>{converted?.date ?? "Choose a valid date and time"}</small>
      </output>
    </div>
  );
}
