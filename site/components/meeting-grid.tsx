"use client";

import { useState } from "react";
import { CITIES } from "@/lib/cities";
import { convertWallTime } from "@/lib/time";

export function MeetingGrid() {
  const today = new Date().toISOString().slice(0, 10);
  const [first, setFirst] = useState("Africa/Lagos");
  const [second, setSecond] = useState("Europe/London");
  const firstName = CITIES.find((city) => city.timeZone === first)?.name ?? first;
  const secondName = CITIES.find((city) => city.timeZone === second)?.name ?? second;

  return (
    <div className="meeting-tool">
      <div className="meeting-selectors">
        <label>First city<select value={first} onChange={(event) => setFirst(event.target.value)}>{CITIES.map((city) => <option key={city.timeZone} value={city.timeZone}>{city.name}</option>)}</select></label>
        <label>Second city<select value={second} onChange={(event) => setSecond(event.target.value)}>{CITIES.map((city) => <option key={city.timeZone} value={city.timeZone}>{city.name}</option>)}</select></label>
      </div>
      <div className="hour-grid" aria-label={`Working-hour comparison for ${firstName} and ${secondName}`}>
        {Array.from({ length: 24 }, (_, hour) => {
          const sourceTime = `${String(hour).padStart(2, "0")}:00`;
          const converted = convertWallTime({ date: today, time: sourceTime, from: first, to: second });
          const secondHour = Number(converted.time.slice(0, 2));
          const overlap = hour >= 9 && hour < 17 && secondHour >= 9 && secondHour < 17;
          return <div key={hour} className={overlap ? "hour-row overlap" : "hour-row"}><span>{sourceTime} <small>{firstName}</small></span><span>{converted.time} <small>{secondName}</small></span></div>;
        })}
      </div>
      <p className="tool-note">Blue rows fall within 9:00–17:00 in both cities. Check everyone’s calendar before booking.</p>
    </div>
  );
}
