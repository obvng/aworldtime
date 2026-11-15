import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const [zoneTablePath, tzdataPath] = process.argv.slice(2);
if (!zoneTablePath || !tzdataPath) {
  throw new Error("Usage: node scripts/generate-iana-country-zones.mjs <zone1970.tab> <tzdata.zi>");
}

const zoneTable = await readFile(resolve(zoneTablePath), "utf8");
const tzdata = await readFile(resolve(tzdataPath), "utf8");
const version = /^# version (\S+)/m.exec(tzdata)?.[1];
if (!version) throw new Error("Could not read the tzdb version from tzdata.zi");

const rows = zoneTable
  .split("\n")
  .filter((line) => line && !line.startsWith("#"))
  .map((line) => {
    const [countryCodes, , timeZone, comment = ""] = line.split("\t");
    return { countryCodes: countryCodes.split(","), timeZone, comment };
  });

const counts = new Map();
for (const row of rows) {
  for (const countryCode of row.countryCodes) counts.set(countryCode, (counts.get(countryCode) ?? 0) + 1);
}

const countries = {};
const locationName = (timeZone) => timeZone.split("/").at(-1).replaceAll("_", " ");
for (const row of rows) {
  for (const countryCode of row.countryCodes) {
    const regions = row.countryCodes.length === 1 && row.comment
      ? row.comment
      : counts.get(countryCode) === 1
        ? "All areas represented by this IANA country code"
        : `Principal location: ${locationName(row.timeZone)}`;
    (countries[countryCode] ??= []).push({ timeZone: row.timeZone, regions });
  }
}

const output = {
  source: "https://data.iana.org/time-zones/tzdb/zone1970.tab",
  version,
  generatedAt: "2026-11-15T00:00:00.000Z",
  countries,
};

await writeFile(
  new URL("../lib/iana-country-zones.generated.json", import.meta.url),
  `${JSON.stringify(output, null, 2)}\n`,
  "utf8",
);
