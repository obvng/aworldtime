import type { City } from "@/lib/cities";

export function citySeoTitle(city: Pick<City, "name" | "country">) {
  const fullTitle = `Time in ${city.name}, ${city.country}: Local Time & UTC Offset`;
  if (fullTitle.length <= 65) return fullTitle;
  const shortTitle = `Time in ${city.name}: Local Time & UTC Offset`;
  return shortTitle.length <= 65 ? shortTitle : `${city.name} Time Now & UTC Offset`;
}
