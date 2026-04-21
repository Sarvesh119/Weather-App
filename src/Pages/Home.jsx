import { useEffect, useState } from "react";
import SearchBar from "../Component/Searchbox";
import CurrentWeather from "../Component/Weather";
import DailyCard from "../Component/DailyCard";
import HourlyCard from "../Component/HourlyCard";
import { Loader2 } from "lucide-react";

const API_KEY = "ea03a30dbb9a1b6b0d7f6461640f862b";

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]); // daily
  const [hourly, setHourly] = useState([]); // raw hourly slots
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Group forecast into daily buckets
  const processForecast = (data2) => {
    // save raw hourly slots
    setHourly(data2.list);

    // group for daily avg
    const grouped = {};
    data2.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0]; // YYYY-MM-DD
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });

    const daily = Object.keys(grouped).map((date) => {
      const items = grouped[date];
      const temps = items.map((i) => i.main.temp);
      const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
      const cond = items[Math.floor(items.length / 2)].weather[0];
      return {
        date,
        temp: avg,
        condition: cond,
      };
    });

    setForecast(daily.slice(0, 7));
  };

  // Fetch by city
  const fetchByCity = async (city) => {
    try {
      setLoading(true);
      setError("");

      const res1 = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}`
      );
      if (!res1.ok) throw new Error("City not found");
      const data1 = await res1.json();
      setWeather(data1);

      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}`
      );
      if (!res2.ok) throw new Error("Forecast not found");
      const data2 = await res2.json();

      processForecast(data2);
    } catch (err) {
      setError(err.message || "Error");
      setWeather(null);
      setForecast([]);
      setHourly([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch by coords
  const fetchByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      setError("");

      const res1 = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      if (!res1.ok) throw new Error("Location weather failed");
      const data1 = await res1.json();
      setWeather(data1);

      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      if (!res2.ok) throw new Error("Forecast failed");
      const data2 = await res2.json();

      processForecast(data2);
    } catch (err) {
      setError(err.message || "Error");
      setWeather(null);
      setForecast([]);
      setHourly([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (q) => {
    if (q) fetchByCity(q);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setError("Location denied or unavailable");
        setLoading(false);
      }
    );
  };

  // initial load
  useEffect(() => {
    fetchByCity("New Delhi");
    // eslint-disable-next-line
  }, []);

  return (
    <div className="home">
      <SearchBar onSearch={handleSearch} onUseLocation={handleUseLocation} />

      {loading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      )}

      {error && <div className="error text-red-600">{error}</div>}

      {/* Current Weather */}
      <CurrentWeather data={weather} />

      {/* Hourly Forecast */}
      {hourly.length > 0 && (
        <section className="hourly-section">
          <h3>Next Hours</h3>
          <div className="hourly-list flex gap-3 overflow-x-auto p-2">
            {hourly.slice(0, 8).map((h) => (
              <HourlyCard key={h.dt} hour={{ ...h.main, weather: h.weather, dt: h.dt }} />
            ))}
          </div>
        </section>
      )}

      {/* Daily Forecast */}
      {forecast.length > 0 && (
        <section className="daily-section mt-4">
          <h3>7-Day Forecast</h3>
          <div className="daily-list flex gap-3 flex-wrap p-2">
            {forecast.map((d) => (
              <DailyCard key={d.date} day={d} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
