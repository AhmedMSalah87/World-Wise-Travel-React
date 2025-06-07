import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { NavLink, useOutletContext } from "react-router";
import type { CitiesContextType } from "./Cities";

type SearchPlaces = {
  place_id: string | number;
  display_name: string;
  lat: number;
  lon: number;
  type: string;
}[];

const SearchCities = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchPlaces>([]);
  const APIKEY = import.meta.env.VITE_MAP_API_KEY;

  const { cities } = useOutletContext<CitiesContextType>();

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const searchCity = async () => {
        try {
          const response = await fetch(
            `https://geocode.maps.co/search?q=${query}&api_key=${APIKEY}`
          );
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      searchCity();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const isVisited = (lat: number, lng: number) => {
    const threshold = 0.02; // adjust if needed
    return cities.find(
      (city) =>
        Math.abs(Number(city.lat) - Number(lat)) < threshold &&
        Math.abs(Number(city.lng) - Number(lng)) < threshold
    );
  };

  return (
    <div className="w-full">
      <Input
        className="w-[70%] m-auto mb-4"
        type="search"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city or place..."
      />
      <ul className="h-[50vh] overflow-y-scroll flex flex-col gap-2">
        {results?.map((place) => {
          const visitedCity = isVisited(place.lat, place.lon);
          return (
            <li key={place.place_id} className="hover:bg-[#c0c0c0] group p-2">
              <NavLink
                to={
                  visitedCity
                    ? `/app/cities/${visitedCity._id}?lat=${visitedCity.lat}&lng=${visitedCity.lng}`
                    : `/app/form?lat=${place.lat}&lng=${place.lon}`
                }
              >
                <h4 className="group-hover:text-black">{place.display_name}</h4>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground group-hover:text-[#333]">
                    {place.type}
                  </p>
                  {visitedCity ? (
                    <p className="group-hover:text-[#333]">
                      Visited on{" "}
                      {new Date(visitedCity.date).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="group-hover:text-[#333]">Not visited yet</p>
                  )}
                </div>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchCities;
