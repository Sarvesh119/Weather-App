export default function CurrentWeather({ data }) {
  if (!data) return null;

  const { name, sys, main, weather, wind } = data;
  const condition = weather && weather.length > 0 ? weather[0] : null;

  return (
    <div className="weather-card">
      <h2>
        {name}, {sys?.country}
      </h2>

      <div className="weather-main">
        {condition && (
          <img
            src={`https://openweathermap.org/img/wn/${condition.icon}@2x.png`}
            alt={condition.description}
          />
        )}
        <div className="temp">{Math.round(main?.temp)}°C</div>
      </div>

      {condition && <p className="desc">{condition.main}</p>}

      <div className="details">
        <p>💧 Humidity: {main?.humidity}%</p>
        <p>🌬️ Wind: {wind?.speed} m/s</p>
      </div>
    </div>
  );
}
