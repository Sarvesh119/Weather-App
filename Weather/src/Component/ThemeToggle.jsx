import React from "react";

export default function ThemeToggle({ toggleTheme, theme }) {
  return (
    <label className="theme-switch">
      <input
        type="checkbox"
        onChange={toggleTheme}
        checked={theme === "light"}
      />
      <span className="slider">
        <span className="thumb">{theme === "light" ? "🌙" : "☀️"}</span>
      </span>
    </label>
  );
}
