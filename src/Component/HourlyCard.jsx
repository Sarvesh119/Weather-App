export default function HourlyCard({ hour }) {
  const iconUrl = `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`;
  const dt = new Date(hour.dt * 1000);
  const hh = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="hour-card bg-gray-100 dark:bg-gray-800 rounded-xl p-3 text-center shadow-md min-w-[80px]">
      <div className="hour-time font-medium">{hh}</div>
      <img src={iconUrl} alt={hour.weather[0].description} className="mx-auto" />
      <div className="hour-temp font-semibold">{Math.round(hour.temp)}°C</div>
    </div>
  );
}
