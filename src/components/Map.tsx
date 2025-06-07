import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import { useLocation, useNavigate } from "react-router";
import type { Cities } from "./Cities";

function LocationMarker({ cities }: { cities: Cities }) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const navigate = useNavigate();

  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      map.setView([lat, lng], map.getZoom());
      setPosition({ lat, lng });
      navigate(`form?lat=${lat}&lng=${lng}`);
    },
  });

  return (
    <>
      {cities.map((city, index) => (
        <Marker position={[Number(city.lat), Number(city.lng)]} key={index}>
          <Popup>
            <span>{city.countryFlag}</span> <span>{city.cityName}</span>
          </Popup>
        </Marker>
      ))}
      {position && (
        <Marker position={[position.lat, position.lng]}>
          <Popup>Your selected location</Popup>
        </Marker>
      )}
    </>
  );
}

const Map = ({ cities }: { cities: Cities }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const lat = queryParams.get("lat");
  const lng = queryParams.get("lng");
  // Set initial center
  const initialCenter =
    lat && lng
      ? { lat: parseFloat(lat), lng: parseFloat(lng) }
      : { lat: 51.505, lng: -0.09 }; // fallback

  return (
    <div className="flex-1 h-full relative">
      <MapContainer
        key={`${initialCenter.lat}-${initialCenter.lng}`} // make map rerender to center map according to lat and lng
        center={initialCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker cities={cities} />
      </MapContainer>
    </div>
  );
};

export default Map;
