"use client";

import { useMemo, useState } from "react";
import { CITIES } from "@/lib/cities";
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
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const converted = useMemo(() => {
    try {
      return convertWallTime({ date, time, from, to });
    } catch {
      return null;
    }
  }, [date, time, from, to]);
  const destination = CITIES.find((city) => city.timeZone === to);

  return (
    <div className="converter-card">
      <div className="converter-fields">
        <label>From
          <select value={from} onChange={(event) => setFrom(event.target.value)}>
            {CITIES.map((city) => <option key={city.timeZone} value={city.timeZone}>{city.name}, {city.country}</option>)}
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
            {CITIES.map((city) => <option key={city.timeZone} value={city.timeZone}>{city.name}, {city.country}</option>)}
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
