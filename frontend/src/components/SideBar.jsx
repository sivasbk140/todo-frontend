import React from "react";
import { NavLink } from "react-router-dom";
import lightLogo from "../assets/badge.png";
import darkLogo from "../assets/night badge.png";
import { useTheme } from "../context/ThemeContext";

function SideBar() {
  const { theme } = useTheme();
  const logo = theme === "dark" ? darkLogo : lightLogo;

  return (
    <div
      className="bg-body-secondary vh-100 d-flex flex-column"
      style={{ width: "250px" }}
    >
      {/* Logo */}
      <div className="d-flex align-items-center justify-content-center ">
        <img
          className="logo"
          src={logo}
          alt="logo"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>

      {/* Dashboard */}
      <NavLink
        to="/dashboard"
        className="sidebar-link p-4 fw-semibold d-block bg-secondary-subtle"
      >
        <></>
        <i className="bi bi-speedometer2 me-2"></i> Dashboard
      </NavLink>

      {/* Manage Section */}

      <div className="mt-4">
        <div className="p-2 mt-4 py-4 fw-bold bg-secondary-subtle">Manage</div>
        <div className="mt-2 d-flex flex-column gap-2 m-2">
          <NavLink to="/food-items" className="p-2">
            <i className="bi bi-cup-hot-fill me-2"></i> Foods
          </NavLink>

          <NavLink to="/menus" className="p-2 gap-2">
            <i className="bi bi-fork-knife me-2"></i> Menus
          </NavLink>

          <NavLink to="/orders" className="p-2 d-block">
            <i className="bi bi-card-list me-2"></i> Orders
          </NavLink>

          <NavLink to="/users" className="p-2 d-block">
            <i className="bi bi-people me-2"></i> Users
          </NavLink>
        </div>
      </div>

      {/* Staff Section */}
      <div className=" mt-3 d-flex flex-column gap-2 m-2">
        <div className="p-2 mt-4 py-4 fw-bold bg-secondary-subtle">
          Delivery Service
        </div>
        <NavLink to="/chat" className="p-2">
          <i className="bi bi-person me-2"></i> Chat
        </NavLink>

        <NavLink to="/delivery" className="p-2">
          <i className="bi bi-truck me-2"></i> Delivery
        </NavLink>
      </div>

      {/* Settings */}
      <div className=" mt-4 d-flex flex-column gap-2">
        <div className="p-2 mt-4 py-4 fw-bold bg-secondary-subtle">
          Settings
        </div>
        <NavLink to="/settings" className="p-2">
          <i className="bi bi-gear me-2"></i> Settings
        </NavLink>

        <NavLink to="/profile" className="p-2">
          <i className="bi bi-person-circle me-2"></i> Profile
        </NavLink>
      </div>

      <div className="mt-auto p-3 bg-secondary text-white w-100">
        <i className="bi bi-box-arrow-right me-2"></i> Logout
      </div>
    </div>
  );
}

export default SideBar;
