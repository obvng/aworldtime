export type WeatherSummary = {
  temperatureC: number;
  condition: string;
};

const labels: Record<number, string> = {
  0: "Clear",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Cloudy",
  45: "Foggy",
  48: "Foggy",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy showers",
  95: "Thunderstorms",
};

export function mapWeatherCode(code: number) {
  return labels[code] ?? "Current conditions";
}

export function parseWeatherResponse(input: unknown): WeatherSummary | null {
  const current = (input as { current?: { temperature_2m?: unknown; weather_code?: unknown } })?.current;
  if (
    typeof current?.temperature_2m !== "number" ||
    typeof current?.weather_code !== "number"
  ) return null;

  return {
    temperatureC: Math.round(current.temperature_2m),
    condition: mapWeatherCode(current.weather_code),
  };
}

export async function getWeatherSummary(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<WeatherSummary | null> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "temperature_2m,weather_code");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url, { signal });
  if (!response.ok) return null;
  return parseWeatherResponse(await response.json());
}
