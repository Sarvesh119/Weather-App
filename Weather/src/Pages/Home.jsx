import { useEffect, useState } from "react";
import SearchBar from "../Component/Searchbox";
import CurrentWeather from "../Component/Weather";
import DailyCard from "../Component/DailyCard";
import { Loader, Loader2 } from "lucide-react";

const API_KEY = "ea03a30dbb9a1b6b0d7f6461640f862b"; // 🔑 Replace with your OpenWeatherMap API key

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch current weather + forecast by city
  const fetchByCity = async (city) => {
    try {
      setLoading(true);
      setError("");

      // current
      const res1 = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}`
      );
      if (!res1.ok) throw new Error("City not found");
      const data1 = await res1.json();
      setWeather(data1);

      // forecast
      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}`
      );
      if (!res2.ok) throw new Error("Forecast not found");
      const data2 = await res2.json();

      // group forecast into daily buckets
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

      setForecast(daily.slice(0, 7)); // show 7 days
    } catch (err) {
      setError(err.message || "Error");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch by coordinates
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

      const grouped = {};
      data2.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
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
    } catch (err) {
      setError(err.message || "Error");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (q) => {
    fetchByCity(q);
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

  useEffect(() => {
    fetchByCity("New Delhi");
    // eslint-disable-next-line
  }, []);

  return (
    <div className="home">
      <SearchBar onSearch={handleSearch} onUseLocation={handleUseLocation} />

      {loading && (
  <div className="flex items-center justify-center">
    <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
  </div>
)}
      {error && <div className="error">{error}</div>}

      <CurrentWeather data={weather} />

      {forecast.length > 0 && (
        <section className="daily-section">
          <h3>7-Day Forecast</h3>
          <div className="daily-list">
            {forecast.map((d) => (
              <DailyCard key={d.date} day={d} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
