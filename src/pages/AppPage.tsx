import SideBar from "../components/SideBar";
import Map from "../components/Map";
import AppUser from "../components/AppUser";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";

const baseURL = import.meta.env.VITE_BASE_URL;

const AppPage = () => {
  const { userId } = useAuth();

  const fetchCities = async () => {
    const response = await fetch(
      `${baseURL}/api/users/cities?userId=${userId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch cities");
    }
    const data = await response.json();
    return data;
  };

  const {
    data: cities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cities"],
    queryFn: fetchCities,
    enabled: !!userId, // ensures the query only runs when userId is available
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading cities: {error.message}</div>;

  return (
    <div className="h-screen p-6 flex relative overscroll-y-none">
      <SideBar cities={cities} />
      <Map cities={cities} />
      <AppUser />
    </div>
  );
};

export default AppPage;
