import { useNavigate, useParams } from "react-router";

import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";

type City = {
  _id: string;
  cityName: string;
  countryFlag: string;
  notes?: string;
  date: string;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

const baseURL = import.meta.env.VITE_BASE_URL;

const CityInfo = () => {
  const { id } = useParams(); // id type is string
  const navigate = useNavigate();

  const getCity = async (): Promise<City> => {
    const response = await fetch(`${baseURL}/api/cities/city/${id}`);
    const data: City = await response.json();
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["CurrentCityInfo", id],
    queryFn: getCity,
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No city data found.</div>; // important for condition when data is undefined

  const { cityName, countryFlag, notes, date } = data;

  return (
    <div className="py-5 px-8 rounded-md bg-[#42484d] w-full flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h6 className="uppercase text-[#aaa] text-sm font-extrabold">
          city name
        </h6>
        <h3 className="flex items-center text-[1.9rem] gap-2.5">
          <span className="text-[3.2rem] leading-none">{countryFlag}</span>
          {cityName}
        </h3>
      </div>
      {notes && (
        <div>
          <h6 className="uppercase text-[#aaa] text-sm font-extrabold">
            your notes
          </h6>
          <p className="text-base">{notes}</p>
        </div>
      )}
      <div>
        <h6 className="uppercase text-[#aaa] text-sm font-extrabold">
          {" "}
          you went to {cityName} on
        </h6>
        <p className="text-base">
          {formatDate(date ? new Date(date) : new Date())}
        </p>
      </div>
      <div>
        <h6 className="uppercase text-[#aaa] text-sm font-extrabold">
          learn more
        </h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
          className="text-base text-amber-500"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>
      <div>
        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default CityInfo;
