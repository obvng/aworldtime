"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CITIES, countryCodeToFlag, findCity, type City } from "@/lib/cities";

type CitySearchProps = {
  onSelect: (city: City) => void;
};

export function CitySearch({ onSelect }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const listId = "city-search-input";
  const matches = useMemo(
    () => (query ? findCity(query).slice(0, 6) : CITIES.slice(0, 5)),
    [query],
  );

  return (
    <div className="city-search">
      <Search aria-hidden="true" size={23} strokeWidth={2.2} />
      <label className="sr-only" htmlFor={listId}>Search any city or time zone</label>
      <input
        id={listId}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search any city or time zone"
        autoComplete="off"
      />
      {query ? (
        <div className="city-search-results" role="listbox" aria-label="City matches">
          {matches.length ? matches.map((city) => (
            <button
              key={city.timeZone}
              type="button"
              role="option"
              aria-selected="false"
              onClick={() => {
                onSelect(city);
                setQuery("");
              }}
            >
              <span className="search-city-label">
                <span role="img" aria-label={`${city.country} flag`}>{countryCodeToFlag(city.countryCode)}</span>
                {city.name}
              </span>
              <small>{city.country} · {city.timeZone}</small>
            </button>
          )) : <p>No city found. Try a country or time-zone name.</p>}
        </div>
      ) : null}
    </div>
  );
}
