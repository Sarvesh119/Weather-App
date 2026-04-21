import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issue in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function WeatherMap({ lat, lon, city }) {
  if (!lat || !lon) return null;

  return (
    <div className="map-container" style={{ height: "400px", width: "100%", marginTop: "1rem" }}>
      <MapContainer center={[lat, lon]} zoom={7} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        {/* Base map (OpenStreetMap) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Weather Radar Layer (from OpenWeatherMap) */}
        <TileLayer
          url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY`}
          attribution="&copy; <a href='https://openweathermap.org/'>OpenWeather</a>"
          opacity={0.6}
        />

        {/* Marker for the selected city */}
        <Marker position={[lat, lon]}>
          <Popup>
            {city} <br /> ({lat.toFixed(2)}, {lon.toFixed(2)})
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
