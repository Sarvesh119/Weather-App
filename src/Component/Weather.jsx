import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon (fix default Leaflet bug in React apps)
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// A helper component to update map center when location changes
function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 8);
    }
  }, [coords, map]);
  return null;
}

export default function CurrentWeather({ data, onLocationChange }) {
  if (!data || !data.main || !data.coord) return null;

  const { name, sys, main, weather, wind, coord } = data;
  const condition = weather && weather.length > 0 ? weather[0] : null;

  const [layer, setLayer] = useState("clouds_new");

  // Available radar layers
  const layers = {
    Clouds: "clouds_new",
    Rain: "precipitation_new",
    Wind: "wind_new",
    Temperature: "temp_new",
    Pressure: "pressure_new",
  };

  // Handle marker drag event
  const handleDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    if (onLocationChange) {
      onLocationChange(lat, lng); // callback to fetch new weather data
    }
  };

  return (
    <div className="weather-card">
      <h2>
        {name}, {sys?.country}
      </h2>

      <div className="weather-main">
        {condition && (
          <img
            src={`https://openweathermap.org/img/wn/${condition.icon}@4x.png`}
            alt={condition.description}
          />
        )}
        <div className="temp">{Math.round(main?.temp)}°C</div>
      </div>

      {condition && <p className="desc">{condition.description.toUpperCase()}</p>}

      <div className="details">
        <div>
          <p>🌡️ Feels like: {Math.round(main?.feels_like)}°C</p>
        </div>
        <div>
          <p>💧 Humidity: {main?.humidity}%</p>
        </div>
        <div>
          <p>🌬️ Wind: {wind?.speed} m/s</p>
        </div>
      </div>

      {/* Layer selector */}
      <div style={{ marginTop: "16px" }}>
        <label htmlFor="layer-select">🌍 Select Radar Layer: </label>
        <select
          id="layer-select"
          value={layer}
          onChange={(e) => setLayer(e.target.value)}
        >
          {Object.entries(layers).map(([label, value]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Map with draggable marker */}
      {coord && (
        <MapContainer
          center={[coord.lat, coord.lon]}
          zoom={8}
          style={{ height: "300px", width: "100%", marginTop: "12px" }}
        >
          <ChangeMapView coords={[coord.lat, coord.lon]} />

          {/* Base map */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Weather Radar Layer */}
          <TileLayer
            url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=YOUR_API_KEY`}
            attribution="&copy; <a href='https://openweathermap.org/'>OpenWeather</a>"
          />

          {/* Draggable Marker */}
          <Marker
            position={[coord.lat, coord.lon]}
            icon={customIcon}
            draggable={true}
            eventHandlers={{ dragend: handleDragEnd }}
          >
            <Popup>
              <strong>{name}, {sys?.country}</strong>
              <br />
              🌡️ Temp: {Math.round(main?.temp)}°C
              <br />
              💧 Humidity: {main?.humidity}%
              <br />
              🌬️ Wind: {wind?.speed} m/s
              <br />
              (Drag me to update location 🌍)
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}
