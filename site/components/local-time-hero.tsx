"use client";

import { MapPin, SunMedium } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CITIES, countryCodeToFlag, skylineForCity, type City } from "@/lib/cities";
import { cityForTimeZone, formatDate, formatTime, timeZoneName } from "@/lib/time";
import { CitySearch } from "@/components/city-search";
import type { WeatherSummary } from "@/lib/weather";

type LocalTimeHeroProps = {
  initialTimeZone?: string;
  now?: Date | string;
  detectTimeZone?: boolean;
};

function isWeatherSummary(value: unknown): value is WeatherSummary {
  const weather = value as Partial<WeatherSummary> | null;
  return Boolean(
    weather &&
    typeof weather.temperatureC === "number" &&
    typeof weather.condition === "string",
  );
}

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
    skylineImage: "/cities/fallback.webp",
  };
}

export function LocalTimeHero({ initialTimeZone, now, detectTimeZone = false }: LocalTimeHeroProps) {
  const initialZone = initialTimeZone && validTimeZone(initialTimeZone)
    ? initialTimeZone
    : "UTC";
  const [timeZone, setTimeZone] = useState(initialZone);
  const [currentTime, setCurrentTime] = useState(() => now ? new Date(now) : new Date(0));
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const city = useMemo(() => friendlyZoneCity(timeZone), [timeZone]);

  useEffect(() => {
    if (!detectTimeZone) return;
    const saved = window.localStorage.getItem("aworldtime:city");
    const browserZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const detected = saved || browserZone;
    if (!detected || !validTimeZone(detected)) return;
    const timer = window.setTimeout(() => {
      setCurrentTime(new Date());
      setTimeZone(detected);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [detectTimeZone]);

  useEffect(() => {
    const timer = window.setInterval(
      () => setCurrentTime((value) => detectTimeZone ? new Date() : new Date(value.getTime() + 1000)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [detectTimeZone]);

  useEffect(() => {
    if (!city || (city.latitude === 0 && city.longitude === 0)) {
      return;
    }
    const controller = new AbortController();
    fetch(`/api/weather?latitude=${city.latitude}&longitude=${city.longitude}`, {
      signal: controller.signal,
    })
      .then((response) => response.status === 204 ? null : response.json())
      .then((value: unknown) => setWeather(isWeatherSummary(value) ? value : null))
      .catch(() => setWeather(null));
    return () => controller.abort();
  }, [city]);

  function chooseCity(nextCity: City) {
    setWeather(null);
    setTimeZone(nextCity.timeZone);
    window.localStorage.setItem("aworldtime:city", nextCity.timeZone);
  }

  return (
    <section className="time-hero" aria-labelledby="local-time-heading">
      <div
        className="city-skyline"
        data-testid="city-skyline"
        aria-hidden="true"
        style={{ backgroundImage: `url("${skylineForCity(city)}")` }}
      />
      <div className="time-hero-inner">
        <p className="local-label"><MapPin size={18} aria-hidden="true" /> Your local time</p>
        <div className="city-heading-row">
          <h1 id="local-time-heading">{city ? `${city.name}${city.country === "Your location" ? "" : `, ${city.country}`}` : "Your city"}</h1>
          {city?.countryCode ? (
            <span className="country-flag hero-country-flag" role="img" aria-label={`${city.country} flag`}>
              {countryCodeToFlag(city.countryCode)}
            </span>
          ) : null}
        </div>
        <time className="local-clock" data-testid="local-time" dateTime={currentTime.toISOString()}>
          <span className="clock-desktop">{formatTime(currentTime, timeZone, true)}</span>
          <span className="clock-mobile">{formatTime(currentTime, timeZone, false)}</span>
        </time>
        <p className="local-date">{formatDate(currentTime, timeZone)}</p>
        <p className="zone-name">{timeZone === "UTC" ? "Coordinated Universal Time" : timeZoneName(currentTime, timeZone)}</p>
        {weather ? (
          <p className="weather-placeholder"><SunMedium aria-hidden="true" /> {weather.temperatureC}°C · {weather.condition}</p>
        ) : (
          !city ? <button type="button" className="choose-city" onClick={() => chooseCity(CITIES[0])}>Choose your city</button> : null
        )}
        <CitySearch onSelect={chooseCity} />
      </div>
    </section>
  );
}
