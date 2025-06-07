import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "./ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "./Loading";
import type { Cities } from "./Cities";

export function convertToEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

interface NewCity {
  cityName: string;
  date: Date | null;
  notes: string;
  country: string;
  userId: string | null;
  lat: string | null;
  lng: string | null;
  countryFlag: string;
}

type GeocodeCity = {
  city?: string;
  locality?: string;
  countryName?: string;
  countryCode?: string;
};

type CityResponse = {
  message: string;
  addedCity: NewCity;
};

const baseURL = import.meta.env.VITE_BASE_URL;

const Form = () => {
  const { userId } = useAuth();
  const [searchParams] = useSearchParams();
  const [notes, setNotes] = useState("");

  const navigate = useNavigate();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  // get city data to use in form
  const fetchCityInfo = async (): Promise<GeocodeCity> => {
    const response = await fetch(
      `https://api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch city info");
    }
    const data: GeocodeCity = await response.json();
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["cityInfo", lat, lng], // Unique query key
    queryFn: fetchCityInfo,
    enabled: !!lat && !!lng, // Only run if lat & lng are available
  });
  // function to add city to database afer submit
  const addCity = async (newCity: NewCity): Promise<CityResponse> => {
    const response = await fetch(`${baseURL}/api/cities/city`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCity),
    });
    if (!response.ok) {
      throw new Error("Failed to add city");
    }
    const data: CityResponse = await response.json();
    return data;
  };

  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: addCity,
    onMutate: async (newCity) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["cities"] });
      // Snapshot previous value
      const previousCities = queryClient.getQueryData(["cities"]);
      // Optimistically update to the new value
      queryClient.setQueryData(["cities"], (old: any) => {
        return old ? [...old, newCity] : [newCity];
      });
      // Return a context with the previous data to rollback if needed
      return { previousCities };
    },
    onError: (_error, _variables, context: any) => {
      queryClient.setQueryData<Cities>(["cities"], context?.previousCities);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      navigate("/app/cities");
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  // Use fetched data directly
  const cityName = data?.city || data?.locality || "";
  const country = data?.countryName || "";
  const countryFlag = data?.countryCode ? convertToEmoji(data.countryCode) : "";
  const date = new Date();

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      cityName,
      date,
      notes,
      country,
      userId: userId ?? null,
      lat,
      lng,
      countryFlag,
    });
  };

  if (isPending) return <Loading />;
  if (isError) return <div>Error: adding city failed </div>;

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-[#42484d] rounded-md py-5 px-8 flex flex-col gap-5 w-full"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="city">City name</label>
        <input id="city" value={cityName} readOnly />
        <span>{countryFlag}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker id="date" selected={date} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="note">Notes about your trip to {cityName}</label>
        <textarea
          id="note"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        ></textarea>
      </div>
      <div className="flex justify-between">
        <Button type="submit">ADD</Button>
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          back
        </Button>
      </div>
    </form>
  );
};

export default Form;
