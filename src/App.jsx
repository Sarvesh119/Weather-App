import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Component/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <Router>
      <div className="app-shell">
        <Navbar toggleTheme={toggleTheme} theme={theme} />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
