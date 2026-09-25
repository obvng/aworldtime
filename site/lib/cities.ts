export type City = {
  name: string;
  country: string;
  countryCode: string;
  timeZone: string;
  latitude: number;
  longitude: number;
  aliases: string[];
};

export const CITIES: City[] = [
  { name: "Lagos", country: "Nigeria", countryCode: "NG", timeZone: "Africa/Lagos", latitude: 6.5244, longitude: 3.3792, aliases: ["nigeria", "wat"] },
  { name: "London", country: "United Kingdom", countryCode: "GB", timeZone: "Europe/London", latitude: 51.5072, longitude: -0.1276, aliases: ["uk", "england", "gmt", "bst"] },
  { name: "New York", country: "United States", countryCode: "US", timeZone: "America/New_York", latitude: 40.7128, longitude: -74.006, aliases: ["nyc", "eastern time", "est", "edt"] },
  { name: "Dubai", country: "United Arab Emirates", countryCode: "AE", timeZone: "Asia/Dubai", latitude: 25.2048, longitude: 55.2708, aliases: ["uae", "gst"] },
  { name: "Tokyo", country: "Japan", countryCode: "JP", timeZone: "Asia/Tokyo", latitude: 35.6762, longitude: 139.6503, aliases: ["japan", "jst"] },
  { name: "Accra", country: "Ghana", countryCode: "GH", timeZone: "Africa/Accra", latitude: 5.6037, longitude: -0.187, aliases: ["ghana", "gmt"] },
  { name: "Johannesburg", country: "South Africa", countryCode: "ZA", timeZone: "Africa/Johannesburg", latitude: -26.2041, longitude: 28.0473, aliases: ["south africa", "sast"] },
  { name: "Nairobi", country: "Kenya", countryCode: "KE", timeZone: "Africa/Nairobi", latitude: -1.2921, longitude: 36.8219, aliases: ["kenya", "eat"] },
  { name: "Cairo", country: "Egypt", countryCode: "EG", timeZone: "Africa/Cairo", latitude: 30.0444, longitude: 31.2357, aliases: ["egypt", "eet"] },
  { name: "Paris", country: "France", countryCode: "FR", timeZone: "Europe/Paris", latitude: 48.8566, longitude: 2.3522, aliases: ["france", "cet", "cest"] },
  { name: "Berlin", country: "Germany", countryCode: "DE", timeZone: "Europe/Berlin", latitude: 52.52, longitude: 13.405, aliases: ["germany", "cet", "cest"] },
  { name: "Toronto", country: "Canada", countryCode: "CA", timeZone: "America/Toronto", latitude: 43.6532, longitude: -79.3832, aliases: ["canada", "eastern time"] },
  { name: "Los Angeles", country: "United States", countryCode: "US", timeZone: "America/Los_Angeles", latitude: 34.0522, longitude: -118.2437, aliases: ["la", "pacific time", "pst", "pdt"] },
  { name: "São Paulo", country: "Brazil", countryCode: "BR", timeZone: "America/Sao_Paulo", latitude: -23.5505, longitude: -46.6333, aliases: ["sao paulo", "brazil", "brasil"] },
  { name: "Delhi", country: "India", countryCode: "IN", timeZone: "Asia/Kolkata", latitude: 28.6139, longitude: 77.209, aliases: ["new delhi", "india", "ist", "kolkata"] },
  { name: "Singapore", country: "Singapore", countryCode: "SG", timeZone: "Asia/Singapore", latitude: 1.3521, longitude: 103.8198, aliases: ["sgt"] },
  { name: "Beijing", country: "China", countryCode: "CN", timeZone: "Asia/Shanghai", latitude: 39.9042, longitude: 116.4074, aliases: ["china", "shanghai", "cst"] },
  { name: "Sydney", country: "Australia", countryCode: "AU", timeZone: "Australia/Sydney", latitude: -33.8688, longitude: 151.2093, aliases: ["australia", "aest", "aedt"] },
  { name: "Auckland", country: "New Zealand", countryCode: "NZ", timeZone: "Pacific/Auckland", latitude: -36.8509, longitude: 174.7645, aliases: ["new zealand", "nzst", "nzdt"] },
];

export const POPULAR_CITIES = ["Europe/London", "America/New_York", "Asia/Dubai", "Asia/Tokyo"]
  .map((timeZone) => CITIES.find((city) => city.timeZone === timeZone))
  .filter((city): city is City => Boolean(city));

export function countryCodeToFlag(countryCode: string) {
  const normalized = countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return "";

  return String.fromCodePoint(
    ...[...normalized].map((letter) => 127397 + letter.charCodeAt(0)),
  );
}

export function findCity(query: string): City[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [];

  return CITIES.filter((city) =>
    [city.name, city.country, city.timeZone, ...city.aliases]
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalized),
  );
}
