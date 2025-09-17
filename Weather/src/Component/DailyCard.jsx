export default function DailyCard({ day }) {
  const date = new Date(day.date);
  const options = { weekday: "short", month: "short", day: "numeric" };

  return (
    <div className="daily-card">
      <p>{date.toLocaleDateString(undefined, options)}</p>
      <img
        src={`https://openweathermap.org/img/wn/${day.condition.icon}@2x.png`}
        alt={day.condition.description}
      />
      <p>{Math.round(day.temp)}°C</p>
      <small>{day.condition.main}</small>
    </div>
  );
}
