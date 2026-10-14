import { CITIES, cityBySlug } from "@/lib/cities";

export function resolveConverterSelections(input: { from?: string; to?: string }) {
  return {
    from: cityBySlug(input.from ?? "")?.slug ?? "lagos",
    to: cityBySlug(input.to ?? "")?.slug ?? "london",
  };
}

export function normalizeConverterPair(from: string, to: string) {
  if (!cityBySlug(from) || !cityBySlug(to) || from === to) throw new Error("Choose two different catalogue cities.");
  const [cityA, cityB] = [from, to].sort();
  return { cityA, cityB };
}

export function citySlugForSelection(value: string, fallback: string) {
  return cityBySlug(value)?.slug ?? CITIES.find((city) => city.timeZone === value)?.slug ?? fallback;
}
