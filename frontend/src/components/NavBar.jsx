import React from "react";
import { useTheme } from "../context/ThemeContext";

function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="p-3 bg-body d-flex align-items-center w-100 shadow-sm">
      {/* Filter */}
      <button className="btn btn-outline-secondary border rounded-circle me-3">
        <i className="bi bi-filter-left fs-5"></i>
      </button>

      {/* Search */}
      <div className="input-group me-auto" style={{ maxWidth: "300px" }}>
        <span className="input-group-text bg-body border-end-0">
          <i className="bi bi-search"></i>
        </span>

        <input
          type="text"
          className="form-control border-start-0"
          placeholder="Search..."
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="d-flex gap-3">
        <button
          className="btn btn-outline-secondary rounded-circle"
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
        >
          <i className={`bi ${isDark ? "bi-sun-fill" : "bi-moon"}`}></i>
        </button>

        <button className="btn btn-outline-secondary position-relative rounded-circle">
          <i className="bi bi-bell"></i>

          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            3
          </span>
        </button>

        <button className="btn btn-outline-secondary rounded-circle">
          <i className="bi bi-person-circle"></i>
        </button>
      </div>
    </div>
  );
}

export default NavBar;
