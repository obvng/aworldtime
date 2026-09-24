"use client";

import { MapPin, SunMedium } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CITIES, type City } from "@/lib/cities";
import { cityForTimeZone, formatDate, formatTime, timeZoneName } from "@/lib/time";
import { CitySearch } from "@/components/city-search";

type LocalTimeHeroProps = {
  initialTimeZone?: string;
  now?: Date;
};

function validTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}

function friendlyZoneCity(timeZone: string): City | undefined {
  const catalogCity = cityForTimeZone(timeZone);
  if (catalogCity) return catalogCity;
  if (!validTimeZone(timeZone) || timeZone === "UTC") return undefined;

  const name = timeZone.split("/").at(-1)?.replaceAll("_", " ");
  if (!name) return undefined;
  return {
    name,
    country: "Your location",
    countryCode: "",
    timeZone,
    latitude: 0,
    longitude: 0,
    aliases: [],
  };
}

export function LocalTimeHero({ initialTimeZone, now }: LocalTimeHeroProps) {
  const initialZone = initialTimeZone && validTimeZone(initialTimeZone)
    ? initialTimeZone
    : "UTC";
  const [timeZone, setTimeZone] = useState(initialZone);
  const [currentTime, setCurrentTime] = useState(now ?? new Date());
  const city = useMemo(() => friendlyZoneCity(timeZone), [timeZone]);

  useEffect(() => {
    if (now) return;
    const saved = window.localStorage.getItem("aworldtime:city");
    const browserZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const detected = saved || browserZone;
    if (detected && validTimeZone(detected)) setTimeZone(detected);
  }, [now]);

  useEffect(() => {
    const timer = window.setInterval(
      () => setCurrentTime((value) => new Date(value.getTime() + 1000)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, []);

  function chooseCity(nextCity: City) {
    setTimeZone(nextCity.timeZone);
    window.localStorage.setItem("aworldtime:city", nextCity.timeZone);
  }

  return (
    <section className="time-hero" aria-labelledby="local-time-heading">
      <div className="time-orbit" aria-hidden="true">
        <span />
      </div>
      <div className="time-hero-inner">
        <p className="local-label"><MapPin size={18} aria-hidden="true" /> Your local time</p>
        <div className="city-heading-row">
          <h1 id="local-time-heading">{city ? `${city.name}${city.country === "Your location" ? "" : `, ${city.country}`}` : "Your city"}</h1>
          {city?.countryCode ? <span className="country-code">{city.countryCode}</span> : null}
        </div>
        <time className="local-clock" data-testid="local-time" dateTime={currentTime.toISOString()}>
          <span className="clock-desktop">{formatTime(currentTime, timeZone, true)}</span>
          <span className="clock-mobile">{formatTime(currentTime, timeZone, false)}</span>
        </time>
        <p className="local-date">{formatDate(currentTime, timeZone)}</p>
        <p className="zone-name">{timeZone === "UTC" ? "Coordinated Universal Time" : timeZoneName(currentTime, timeZone)}</p>
        {city ? (
          <p className="weather-placeholder"><SunMedium aria-hidden="true" /> Local conditions will appear here</p>
        ) : (
          <button type="button" className="choose-city" onClick={() => chooseCity(CITIES[0])}>Choose your city</button>
        )}
        <CitySearch onSelect={chooseCity} />
      </div>
    </section>
  );
}
