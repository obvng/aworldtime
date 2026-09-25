import { CITIES, type City } from "@/lib/cities";

const twoDigits = (value: number) => String(value).padStart(2, "0");

function dateParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    hour: value("hour"),
    minute: value("minute"),
    second: value("second"),
  };
}

function zoneOffsetMs(date: Date, timeZone: string) {
  const parts = dateParts(date, timeZone);
  const representedAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return representedAsUtc - Math.trunc(date.getTime() / 1000) * 1000;
}

function wallTimeToInstant(date: string, time: string, timeZone: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match || !timeMatch) throw new Error("Date and time must use YYYY-MM-DD and HH:mm.");

  const guess = Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(timeMatch[1]),
    Number(timeMatch[2]),
  );
  let instant = guess - zoneOffsetMs(new Date(guess), timeZone);
  instant = guess - zoneOffsetMs(new Date(instant), timeZone);
  return new Date(instant);
}

export function cityForTimeZone(timeZone: string): City | undefined {
  return CITIES.find((city) => city.timeZone === timeZone);
}

export function formatTime(date: Date, timeZone: string, includeSeconds = true) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    ...(includeSeconds ? { second: "2-digit" } : {}),
    hourCycle: "h23",
  }).format(date);
}

export function formatTimeWithPeriod(
  date: Date,
  timeZone: string,
  includeSeconds = true,
) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    ...(includeSeconds ? { second: "2-digit" } : {}),
    hourCycle: "h12",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    time: [value("hour"), value("minute"), ...(includeSeconds ? [value("second")] : [])].join(":"),
    period: value("dayPeriod").toUpperCase(),
  };
}

export function formatDate(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${value("weekday")}, ${value("day")} ${value("month")} ${value("year")}`;
}

export function timeZoneName(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    timeZoneName: "long",
  }).formatToParts(date);
  return parts.find((part) => part.type === "timeZoneName")?.value ?? timeZone;
}

export function convertWallTime(input: {
  date: string;
  time: string;
  from: string;
  to: string;
}) {
  const instant = wallTimeToInstant(input.date, input.time, input.from);
  const parts = dateParts(instant, input.to);
  return {
    date: `${parts.year}-${twoDigits(parts.month)}-${twoDigits(parts.day)}`,
    time: `${twoDigits(parts.hour)}:${twoDigits(parts.minute)}`,
  };
}
