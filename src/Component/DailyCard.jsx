export default function DailyCard({ day }) {
  const date = new Date(day.date);
  const options = { weekday: "short", month: "short", day: "numeric" };

  return (
    <div className="daily-card">
      <p className="font-medium">{date.toLocaleDateString(undefined, options)}</p>
      <img
        src={`https://openweathermap.org/img/wn/${day.condition.icon}@2x.png`}
        alt={day.condition.description}
        className="mx-auto"
      />
      <p className="font-semibold">{Math.round(day.temp)}°C</p>
      <small className="text-gray-500">{day.condition.main}</small>
    </div>
  );
}
