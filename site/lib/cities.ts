export type City = {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  timeZone: string;
  latitude: number;
  longitude: number;
  aliases: string[];
  skylineImage: string;
  contentUpdatedAt: string;
};

const CONTENT_UPDATED_AT = "2026-10-14T00:00:00.000Z";
const CUSTOM_SKYLINES = new Set([
  "lagos", "london", "new-york", "dubai", "tokyo", "accra", "johannesburg",
  "nairobi", "cairo", "paris", "berlin", "toronto", "los-angeles", "sao-paulo",
  "delhi", "singapore", "beijing", "sydney", "auckland",
]);

type CityRow = readonly [
  slug: string, name: string, country: string, countryCode: string,
  timeZone: string, latitude: number, longitude: number, aliases?: readonly string[],
];

const CITY_ROWS: CityRow[] = [
  ["lagos", "Lagos", "Nigeria", "NG", "Africa/Lagos", 6.5244, 3.3792, ["nigeria", "wat"]],
  ["london", "London", "United Kingdom", "GB", "Europe/London", 51.5072, -0.1276, ["uk", "england", "gmt", "bst"]],
  ["new-york", "New York", "United States", "US", "America/New_York", 40.7128, -74.006, ["nyc", "eastern time", "est", "edt"]],
  ["dubai", "Dubai", "United Arab Emirates", "AE", "Asia/Dubai", 25.2048, 55.2708, ["uae", "gst"]],
  ["tokyo", "Tokyo", "Japan", "JP", "Asia/Tokyo", 35.6762, 139.6503, ["japan", "jst"]],
  ["accra", "Accra", "Ghana", "GH", "Africa/Accra", 5.6037, -0.187, ["ghana", "gmt"]],
  ["johannesburg", "Johannesburg", "South Africa", "ZA", "Africa/Johannesburg", -26.2041, 28.0473, ["south africa", "sast"]],
  ["nairobi", "Nairobi", "Kenya", "KE", "Africa/Nairobi", -1.2921, 36.8219, ["kenya", "eat"]],
  ["cairo", "Cairo", "Egypt", "EG", "Africa/Cairo", 30.0444, 31.2357, ["egypt", "eet"]],
  ["paris", "Paris", "France", "FR", "Europe/Paris", 48.8566, 2.3522, ["france", "cet", "cest"]],
  ["berlin", "Berlin", "Germany", "DE", "Europe/Berlin", 52.52, 13.405, ["germany", "cet", "cest"]],
  ["toronto", "Toronto", "Canada", "CA", "America/Toronto", 43.6532, -79.3832, ["canada", "eastern time"]],
  ["los-angeles", "Los Angeles", "United States", "US", "America/Los_Angeles", 34.0522, -118.2437, ["la", "pacific time", "pst", "pdt"]],
  ["sao-paulo", "São Paulo", "Brazil", "BR", "America/Sao_Paulo", -23.5505, -46.6333, ["sao paulo", "brazil", "brasil"]],
  ["delhi", "Delhi", "India", "IN", "Asia/Kolkata", 28.6139, 77.209, ["new delhi", "india", "ist"]],
  ["singapore", "Singapore", "Singapore", "SG", "Asia/Singapore", 1.3521, 103.8198, ["sgt"]],
  ["beijing", "Beijing", "China", "CN", "Asia/Shanghai", 39.9042, 116.4074, ["china", "cst"]],
  ["sydney", "Sydney", "Australia", "AU", "Australia/Sydney", -33.8688, 151.2093, ["australia", "aest", "aedt"]],
  ["auckland", "Auckland", "New Zealand", "NZ", "Pacific/Auckland", -36.8509, 174.7645, ["new zealand", "nzst", "nzdt"]],
  ["chicago", "Chicago", "United States", "US", "America/Chicago", 41.8781, -87.6298, ["central time", "cst", "cdt"]],
  ["houston", "Houston", "United States", "US", "America/Chicago", 29.7604, -95.3698, ["texas", "central time"]],
  ["miami", "Miami", "United States", "US", "America/New_York", 25.7617, -80.1918, ["florida", "eastern time"]],
  ["washington-dc", "Washington, D.C.", "United States", "US", "America/New_York", 38.9072, -77.0369, ["washington dc", "dc", "eastern time"]],
  ["atlanta", "Atlanta", "United States", "US", "America/New_York", 33.749, -84.388, ["georgia", "eastern time"]],
  ["boston", "Boston", "United States", "US", "America/New_York", 42.3601, -71.0589, ["massachusetts", "eastern time"]],
  ["san-francisco", "San Francisco", "United States", "US", "America/Los_Angeles", 37.7749, -122.4194, ["sf", "bay area", "pacific time"]],
  ["seattle", "Seattle", "United States", "US", "America/Los_Angeles", 47.6062, -122.3321, ["washington state", "pacific time"]],
  ["vancouver", "Vancouver", "Canada", "CA", "America/Vancouver", 49.2827, -123.1207, ["british columbia", "pacific time"]],
  ["montreal", "Montreal", "Canada", "CA", "America/Toronto", 45.5019, -73.5674, ["quebec", "eastern time"]],
  ["mexico-city", "Mexico City", "Mexico", "MX", "America/Mexico_City", 19.4326, -99.1332, ["mexico", "cdmx"]],
  ["bogota", "Bogotá", "Colombia", "CO", "America/Bogota", 4.711, -74.0721, ["bogota", "colombia"]],
  ["buenos-aires", "Buenos Aires", "Argentina", "AR", "America/Argentina/Buenos_Aires", -34.6037, -58.3816, ["argentina"]],
  ["lima", "Lima", "Peru", "PE", "America/Lima", -12.0464, -77.0428, ["peru"]],
  ["santiago", "Santiago", "Chile", "CL", "America/Santiago", -33.4489, -70.6693, ["chile"]],
  ["rio-de-janeiro", "Rio de Janeiro", "Brazil", "BR", "America/Sao_Paulo", -22.9068, -43.1729, ["rio", "brazil"]],
  ["brasilia", "Brasília", "Brazil", "BR", "America/Sao_Paulo", -15.7939, -47.8828, ["brasilia", "brazil"]],
  ["dublin", "Dublin", "Ireland", "IE", "Europe/Dublin", 53.3498, -6.2603, ["ireland", "gmt", "ist"]],
  ["madrid", "Madrid", "Spain", "ES", "Europe/Madrid", 40.4168, -3.7038, ["spain", "cet", "cest"]],
  ["rome", "Rome", "Italy", "IT", "Europe/Rome", 41.9028, 12.4964, ["italy", "cet", "cest"]],
  ["amsterdam", "Amsterdam", "Netherlands", "NL", "Europe/Amsterdam", 52.3676, 4.9041, ["netherlands", "holland", "cet"]],
  ["brussels", "Brussels", "Belgium", "BE", "Europe/Brussels", 50.8503, 4.3517, ["belgium", "cet"]],
  ["zurich", "Zurich", "Switzerland", "CH", "Europe/Zurich", 47.3769, 8.5417, ["switzerland", "cet"]],
  ["vienna", "Vienna", "Austria", "AT", "Europe/Vienna", 48.2082, 16.3738, ["austria", "cet"]],
  ["stockholm", "Stockholm", "Sweden", "SE", "Europe/Stockholm", 59.3293, 18.0686, ["sweden", "cet"]],
  ["oslo", "Oslo", "Norway", "NO", "Europe/Oslo", 59.9139, 10.7522, ["norway", "cet"]],
  ["copenhagen", "Copenhagen", "Denmark", "DK", "Europe/Copenhagen", 55.6761, 12.5683, ["denmark", "cet"]],
  ["helsinki", "Helsinki", "Finland", "FI", "Europe/Helsinki", 60.1699, 24.9384, ["finland", "eet"]],
  ["warsaw", "Warsaw", "Poland", "PL", "Europe/Warsaw", 52.2297, 21.0122, ["poland", "cet"]],
  ["prague", "Prague", "Czechia", "CZ", "Europe/Prague", 50.0755, 14.4378, ["czech republic", "czechia", "cet"]],
  ["athens", "Athens", "Greece", "GR", "Europe/Athens", 37.9838, 23.7275, ["greece", "eet"]],
  ["istanbul", "Istanbul", "Türkiye", "TR", "Europe/Istanbul", 41.0082, 28.9784, ["turkey", "trt"]],
  ["moscow", "Moscow", "Russia", "RU", "Europe/Moscow", 55.7558, 37.6173, ["russia", "msk"]],
  ["kyiv", "Kyiv", "Ukraine", "UA", "Europe/Kyiv", 50.4501, 30.5234, ["kiev", "ukraine", "eet"]],
  ["lisbon", "Lisbon", "Portugal", "PT", "Europe/Lisbon", 38.7223, -9.1393, ["portugal", "wet"]],
  ["abuja", "Abuja", "Nigeria", "NG", "Africa/Lagos", 9.0765, 7.3986, ["nigeria", "wat"]],
  ["port-harcourt", "Port Harcourt", "Nigeria", "NG", "Africa/Lagos", 4.8156, 7.0498, ["nigeria", "rivers", "wat"]],
  ["ibadan", "Ibadan", "Nigeria", "NG", "Africa/Lagos", 7.3775, 3.947, ["nigeria", "oyo", "wat"]],
  ["kano", "Kano", "Nigeria", "NG", "Africa/Lagos", 12.0022, 8.592, ["nigeria", "wat"]],
  ["cape-town", "Cape Town", "South Africa", "ZA", "Africa/Johannesburg", -33.9249, 18.4241, ["south africa", "sast"]],
  ["addis-ababa", "Addis Ababa", "Ethiopia", "ET", "Africa/Addis_Ababa", 8.9806, 38.7578, ["ethiopia", "eat"]],
  ["dar-es-salaam", "Dar es Salaam", "Tanzania", "TZ", "Africa/Dar_es_Salaam", -6.7924, 39.2083, ["tanzania", "eat"]],
  ["kampala", "Kampala", "Uganda", "UG", "Africa/Kampala", 0.3476, 32.5825, ["uganda", "eat"]],
  ["kigali", "Kigali", "Rwanda", "RW", "Africa/Kigali", -1.9441, 30.0619, ["rwanda", "cat"]],
  ["casablanca", "Casablanca", "Morocco", "MA", "Africa/Casablanca", 33.5731, -7.5898, ["morocco"]],
  ["algiers", "Algiers", "Algeria", "DZ", "Africa/Algiers", 36.7538, 3.0588, ["algeria", "cet"]],
  ["mumbai", "Mumbai", "India", "IN", "Asia/Kolkata", 19.076, 72.8777, ["bombay", "india", "ist"]],
  ["kolkata", "Kolkata", "India", "IN", "Asia/Kolkata", 22.5726, 88.3639, ["calcutta", "india", "ist"]],
  ["bengaluru", "Bengaluru", "India", "IN", "Asia/Kolkata", 12.9716, 77.5946, ["bangalore", "india", "ist"]],
  ["chennai", "Chennai", "India", "IN", "Asia/Kolkata", 13.0827, 80.2707, ["madras", "india", "ist"]],
  ["hyderabad", "Hyderabad", "India", "IN", "Asia/Kolkata", 17.385, 78.4867, ["india", "ist"]],
  ["karachi", "Karachi", "Pakistan", "PK", "Asia/Karachi", 24.8607, 67.0011, ["pakistan", "pkt"]],
  ["islamabad", "Islamabad", "Pakistan", "PK", "Asia/Karachi", 33.6844, 73.0479, ["pakistan", "pkt"]],
  ["dhaka", "Dhaka", "Bangladesh", "BD", "Asia/Dhaka", 23.8103, 90.4125, ["bangladesh", "bst"]],
  ["colombo", "Colombo", "Sri Lanka", "LK", "Asia/Colombo", 6.9271, 79.8612, ["sri lanka", "ist"]],
  ["kathmandu", "Kathmandu", "Nepal", "NP", "Asia/Kathmandu", 27.7172, 85.324, ["nepal", "npt"]],
  ["shanghai", "Shanghai", "China", "CN", "Asia/Shanghai", 31.2304, 121.4737, ["china", "cst"]],
  ["hong-kong", "Hong Kong", "Hong Kong", "HK", "Asia/Hong_Kong", 22.3193, 114.1694, ["hkt"]],
  ["taipei", "Taipei", "Taiwan", "TW", "Asia/Taipei", 25.033, 121.5654, ["taiwan", "cst"]],
  ["seoul", "Seoul", "South Korea", "KR", "Asia/Seoul", 37.5665, 126.978, ["korea", "kst"]],
  ["bangkok", "Bangkok", "Thailand", "TH", "Asia/Bangkok", 13.7563, 100.5018, ["thailand", "ict"]],
  ["jakarta", "Jakarta", "Indonesia", "ID", "Asia/Jakarta", -6.2088, 106.8456, ["indonesia", "wib"]],
  ["manila", "Manila", "Philippines", "PH", "Asia/Manila", 14.5995, 120.9842, ["philippines", "pht"]],
  ["kuala-lumpur", "Kuala Lumpur", "Malaysia", "MY", "Asia/Kuala_Lumpur", 3.139, 101.6869, ["malaysia", "myt"]],
  ["hanoi", "Hanoi", "Vietnam", "VN", "Asia/Ho_Chi_Minh", 21.0278, 105.8342, ["vietnam", "ict"]],
  ["ho-chi-minh-city", "Ho Chi Minh City", "Vietnam", "VN", "Asia/Ho_Chi_Minh", 10.8231, 106.6297, ["saigon", "vietnam", "ict"]],
  ["riyadh", "Riyadh", "Saudi Arabia", "SA", "Asia/Riyadh", 24.7136, 46.6753, ["saudi arabia", "ast"]],
  ["jeddah", "Jeddah", "Saudi Arabia", "SA", "Asia/Riyadh", 21.4858, 39.1925, ["saudi arabia", "ast"]],
  ["doha", "Doha", "Qatar", "QA", "Asia/Qatar", 25.2854, 51.531, ["qatar", "ast"]],
  ["abu-dhabi", "Abu Dhabi", "United Arab Emirates", "AE", "Asia/Dubai", 24.4539, 54.3773, ["uae", "gst"]],
  ["kuwait-city", "Kuwait City", "Kuwait", "KW", "Asia/Kuwait", 29.3759, 47.9774, ["kuwait", "ast"]],
  ["muscat", "Muscat", "Oman", "OM", "Asia/Muscat", 23.588, 58.3829, ["oman", "gst"]],
  ["tel-aviv", "Tel Aviv", "Israel", "IL", "Asia/Jerusalem", 32.0853, 34.7818, ["israel", "ist", "idt"]],
  ["jerusalem", "Jerusalem", "Israel", "IL", "Asia/Jerusalem", 31.7683, 35.2137, ["israel", "ist", "idt"]],
  ["melbourne", "Melbourne", "Australia", "AU", "Australia/Melbourne", -37.8136, 144.9631, ["australia", "aest", "aedt"]],
  ["brisbane", "Brisbane", "Australia", "AU", "Australia/Brisbane", -27.4698, 153.0251, ["queensland", "australia", "aest"]],
  ["perth", "Perth", "Australia", "AU", "Australia/Perth", -31.9523, 115.8613, ["western australia", "awst"]],
  ["honolulu", "Honolulu", "United States", "US", "Pacific/Honolulu", 21.3099, -157.8581, ["hawaii", "hst"]],
  ["san-juan", "San Juan", "Puerto Rico", "PR", "America/Puerto_Rico", 18.4655, -66.1057, ["puerto rico", "ast"]],
  ["philadelphia", "Philadelphia", "United States", "US", "America/New_York", 39.9526, -75.1652, ["pennsylvania", "philly", "eastern time"]],
  ["dallas", "Dallas", "United States", "US", "America/Chicago", 32.7767, -96.797, ["texas", "central time"]],
];

export const CITIES: City[] = CITY_ROWS.map(([
  slug, name, country, countryCode, timeZone, latitude, longitude, aliases = [],
]) => ({
  slug, name, country, countryCode, timeZone, latitude, longitude,
  aliases: [...aliases],
  skylineImage: CUSTOM_SKYLINES.has(slug) ? `/cities/${slug}.webp` : "/cities/fallback.webp",
  contentUpdatedAt: CONTENT_UPDATED_AT,
}));

export const POPULAR_CITIES = ["london", "new-york", "dubai", "tokyo", "toronto", "beijing"]
  .map((slug) => CITIES.find((city) => city.slug === slug))
  .filter((city): city is City => Boolean(city));

export function cityBySlug(slug: string) {
  return CITIES.find((city) => city.slug === slug);
}

export function skylineForCity(city?: City) {
  return city?.skylineImage ?? "/cities/fallback.webp";
}

export function countryCodeToFlag(countryCode: string) {
  const normalized = countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return "";
  return String.fromCodePoint(...[...normalized].map((letter) => 127397 + letter.charCodeAt(0)));
}

export function findCity(query: string): City[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [];
  return CITIES.filter((city) =>
    [city.name, city.country, city.timeZone, ...city.aliases].join(" ").toLocaleLowerCase().includes(normalized),
  );
}
