import type { City } from "@/lib/cities";

export function citySeoTitle(city: Pick<City, "name" | "country">) {
  const fullTitle = `Time in ${city.name}, ${city.country}: Current Local Time and UTC Offset`;
  return fullTitle.length <= 70 ? fullTitle : `Time in ${city.name}: Current Local Time and UTC Offset`;
}
