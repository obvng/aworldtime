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

export function zoneOffsetMs(date: Date, timeZone: string) {
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

function offsetLabel(offsetMs: number) {
  const totalMinutes = Math.round(offsetMs / 60_000);
  const sign = totalMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(totalMinutes);
  return `UTC${sign}${twoDigits(Math.floor(absolute / 60))}:${twoDigits(absolute % 60)}`;
}

function startOfUtcYear(year: number) {
  return new Date(Date.UTC(year, 0, 1));
}

export function describeTimeZone(date: Date, timeZone: string) {
  const offset = zoneOffsetMs(date, timeZone);
  const localYear = dateParts(date, timeZone).year;
  const sampledOffsets = Array.from({ length: 12 }, (_, month) =>
    zoneOffsetMs(new Date(Date.UTC(localYear, month, 15, 12)), timeZone),
  );
  const standardOffset = Math.min(...sampledOffsets);
  const searchLimit = new Date(startOfUtcYear(localYear + 2).getTime());
  let cursor = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  let previousCursor = date.getTime();
  let previousOffset = offset;
  let nextTransition: Date | null = null;
  let nextOffset = offset;

  while (cursor < searchLimit) {
    const candidateOffset = zoneOffsetMs(cursor, timeZone);
    if (candidateOffset !== previousOffset) {
      let low = previousCursor;
      let high = cursor.getTime();
      while (high - low > 1000) {
        const middle = Math.floor((low + high) / 2 / 1000) * 1000;
        if (zoneOffsetMs(new Date(middle), timeZone) === previousOffset) low = middle;
        else high = middle;
      }
      nextTransition = new Date(Math.ceil(high / 1000) * 1000);
      nextOffset = candidateOffset;
      break;
    }
    previousOffset = candidateOffset;
    previousCursor = cursor.getTime();
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
  }

  return {
    offsetMinutes: Math.round(offset / 60_000),
    offsetLabel: offsetLabel(offset),
    isDaylightSavingTime: offset > standardOffset,
    nextTransition,
    nextOffsetLabel: nextTransition ? offsetLabel(nextOffset) : null,
  };
}

const radians = (degrees: number) => degrees * Math.PI / 180;
const degrees = (radiansValue: number) => radiansValue * 180 / Math.PI;
const normalizeDegrees = (value: number) => ((value % 360) + 360) % 360;

function solarEventUtcHours(dayOfYear: number, latitude: number, longitude: number, sunrise: boolean) {
  const longitudeHour = longitude / 15;
  const approximateTime = dayOfYear + ((sunrise ? 6 : 18) - longitudeHour) / 24;
  const meanAnomaly = (0.9856 * approximateTime) - 3.289;
  let trueLongitude = meanAnomaly + 1.916 * Math.sin(radians(meanAnomaly)) + 0.02 * Math.sin(radians(2 * meanAnomaly)) + 282.634;
  trueLongitude = normalizeDegrees(trueLongitude);
  let rightAscension = degrees(Math.atan(0.91764 * Math.tan(radians(trueLongitude))));
  rightAscension = normalizeDegrees(rightAscension);
  rightAscension += Math.floor(trueLongitude / 90) * 90 - Math.floor(rightAscension / 90) * 90;
  rightAscension /= 15;
  const sinDeclination = 0.39782 * Math.sin(radians(trueLongitude));
  const cosDeclination = Math.cos(Math.asin(sinDeclination));
  const cosHourAngle = (Math.cos(radians(90.833)) - sinDeclination * Math.sin(radians(latitude))) /
    (cosDeclination * Math.cos(radians(latitude)));
  if (cosHourAngle > 1 || cosHourAngle < -1) return null;
  const hourAngle = (sunrise ? 360 - degrees(Math.acos(cosHourAngle)) : degrees(Math.acos(cosHourAngle))) / 15;
  const localMeanTime = hourAngle + rightAscension - 0.06571 * approximateTime - 6.622;
  return ((localMeanTime - longitudeHour) % 24 + 24) % 24;
}

export function getSolarTimes(date: Date, city: Pick<City, "latitude" | "longitude" | "timeZone">) {
  const local = dateParts(date, city.timeZone);
  const localDateUtc = Date.UTC(local.year, local.month - 1, local.day);
  const dayOfYear = Math.floor((localDateUtc - Date.UTC(local.year, 0, 0)) / 86_400_000);
  const sunriseHours = solarEventUtcHours(dayOfYear, city.latitude, city.longitude, true);
  const sunsetHours = solarEventUtcHours(dayOfYear, city.latitude, city.longitude, false);

  if (sunriseHours === null || sunsetHours === null) {
    return { sunrise: null, sunset: null, dayLengthMinutes: null };
  }

  const eventInstant = (utcHours: number) => new Date(localDateUtc + Math.round(utcHours * 60) * 60_000);
  const sunrise = eventInstant(sunriseHours);
  let sunset = eventInstant(sunsetHours);
  if (sunset <= sunrise) sunset = new Date(sunset.getTime() + 86_400_000);
  return {
    sunrise: formatTime(sunrise, city.timeZone, false),
    sunset: formatTime(sunset, city.timeZone, false),
    dayLengthMinutes: Math.round((sunset.getTime() - sunrise.getTime()) / 60_000),
  };
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
