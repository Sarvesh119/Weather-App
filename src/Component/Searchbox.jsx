import { Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function SearchBar({ onSearch, onUseLocation }) {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  // Fetch suggestions from Nominatim (OSM)
  const fetchSuggestions = async (query) => {
    if (!query?.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&limit=5&countrycodes=in`
      );
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce input
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (!q?.trim()) {
      setSuggestions([]);
      return;
    }
    timeoutRef.current = setTimeout(() => fetchSuggestions(q), 300);
    
    return () => clearTimeout(timeoutRef.current);
  }, [q]);

  // Handle search submission
const handleSubmit = async (e) => {
  e?.preventDefault();
  const query = q?.trim();
  if (!query) return;

  try {
    // Try Nominatim lookup
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=1&countrycodes=in`
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    if (data.length > 0) {
      // Extract just the city name
      const cityName = data[0].display_name.split(",")[0].trim();
      onSearch(cityName);
    } else {
      alert("City not found. Please try another name.");
    }
  } catch (err) {
    console.error("Failed to resolve city:", err);
    alert("Error fetching location. Please try again.");
  }

  setSuggestions([]);
};


  // Handle suggestion selection - need to handle coordinates differently
  const handleSelect = (loc) => {
    if (!loc) return;
    
    setQ(loc.display_name);
    setSuggestions([]);
    
    // Extract city name from display_name for the search
    // display_name format is usually: "City, State, Country"
    const cityName = loc.display_name.split(',')[0].trim();
    onSearch(cityName);
  };

  return (
    <div style={{ position: "relative" }}>
      <form className="search-row" onSubmit={handleSubmit}>
        <input
          className="search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search city, village, or town"
          aria-label="Search city or village"
          autoComplete="off"
        />
        <div className="search-actions">
          <button type="submit" className="btn primary">
            Search
          </button>
          <button type="button" className="btn" onClick={onUseLocation}>
            Use my location
          </button>
        </div>
      </form>

      {loading && <div className="suggestions"><Loader2 className="animate-spin" /></div>}

      {suggestions.length > 0 && (
        <ul
          className="suggestions"
        >
          {suggestions.map((loc, idx) => (
            <li
              key={`${loc.place_id || loc.osm_id || idx}`}
              onClick={() => handleSelect(loc)}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                borderBottom: idx < suggestions.length - 1 ? "1px solid #eee" : "none"
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {loc.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}