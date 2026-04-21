import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ toggleTheme, theme }) {
  return (
    <header className="nav">
      <div className="nav-left">
        <div className="brand">Weather<span className="dot"></span></div>
        <nav className="links">
          <NavLink to="/" end className={({isActive})=>isActive?"active":""}>Home</NavLink>
          <NavLink to="/about" className={({isActive})=>isActive?"active":""}>About</NavLink>
        </nav>
      </div>
      <div className="nav-right">
        <ThemeToggle toggleTheme={toggleTheme} theme={theme} />
      </div>
    </header>
  );
}
