import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { useOutletContext } from "react-router";

export type Cities = {
  _id: string;
  cityName: string;
  date: Date;
  notes: string;
  country: string;
  userId: string;
  lat: string;
  lng: string;
  countryFlag: string;
}[];

export type CitiesContextType = {
  cities: {
    _id: string;
    cityName: string;
    date: Date;
    notes: string;
    country: string;
    userId: string;
    lat: string;
    lng: string;
    countryFlag: string;
  }[];
};

type DeleteCityResponse = {
  id: string; // deleted city id
  message: string; // optional server message
};

const baseURL = import.meta.env.VITE_BASE_URL;

const Cities = () => {
  const { cities } = useOutletContext<CitiesContextType>();

  const deleteCity = async (id: string): Promise<DeleteCityResponse> => {
    const response = await fetch(`${baseURL}/api/cities/city/${id}`, {
      // id passed from mutate function to api url so server get it through accessing request params so no need for sending any body
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete city");
    }
    const data: DeleteCityResponse = await response.json();
    return data; // contain city id and message from server
  };

  const queryClient = useQueryClient();
  const { mutate, isError } = useMutation<
    DeleteCityResponse,
    Error,
    string,
    { previousCities?: Cities }
  >({
    mutationFn: deleteCity,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["cities"] });
      // Get the previous data so we can rollback if needed
      const previousCities = queryClient.getQueryData<Cities>(["cities"]);
      // Optimistically remove the city from the cache
      queryClient.setQueryData<Cities>(["cities"], (oldCities) => {
        return oldCities?.filter((city) => city._id !== id) ?? [];
      });
      // Return the rollback context
      return { previousCities };
    },
    onError: (_error, _id, context) => {
      if (context?.previousCities) {
        queryClient.setQueryData<Cities>(["cities"], context.previousCities);
      }
    },
    onSettled: () => {
      // Always refetch on success or error to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });

  if (cities.length === 0) {
    return <p>👋 Add your first city by clicking on a city on the map</p>;
  }

  if (isError) return <div>Error: adding city failed </div>;

  return (
    <ul className="flex flex-col gap-4 w-full overflow-y-scroll">
      {cities.map((city) => (
        <li
          key={city._id}
          className="bg-[#42484d] rounded-sm py-2.5 px-5 cursor-pointer border-l-4 border-l-primary"
        >
          <NavLink
            to={`${city._id}?lat=${city.lat}&lng=${city.lng}`}
            className="flex items-center gap-4"
          >
            <span>{city.countryFlag}</span>
            <h3 className="mr-auto">{city.cityName}</h3>
            <p>({new Date(city.date).toLocaleDateString()})</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                mutate(city._id);
              }}
              className="h-5 w-5 flex items-center justify-center rounded-full bg-secondary text-base font-semibold cursor-pointer hover:bg-amber-600 hover:text-secondary"
            >
              ×
            </button>
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default Cities;
