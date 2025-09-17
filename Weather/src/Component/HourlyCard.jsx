export default function HourlyCard({ hour }) {
  const iconUrl = `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`;
  const dt = new Date(hour.dt * 1000);
  const hh = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="hour-card">
      <div className="hour-time">{hh}</div>
      <img src={iconUrl} alt={hour.weather[0].description} />
      <div className="hour-temp">{Math.round(hour.temp)}°</div>
    </div>
  );
}
