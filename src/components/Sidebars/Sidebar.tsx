import {
  FaTachometerAlt,
  FaDoorOpen,
  FaUsers,
  FaCalendarAlt,
  FaBars,
} from "react-icons/fa";
import { BsBuildingsFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import "./Sidebar.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    setCollapsed(saved === "true");
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebarCollapsed", String(next));
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* TOP */}
      <div className="sidebar-top">
        <button className="collapse-btn" onClick={toggleCollapse}>
          <FaBars />
        </button>

        {!collapsed && (
          <div className="logo-container">
            <div className="logo-mark">
              <BsBuildingsFill />
            </div>
            <span className="logo-text">Room Booking System</span>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">
        <SidebarLink
          to="/dashboard"
          icon={<FaTachometerAlt />}
          label="Dashboard"
          collapsed={collapsed}
        />

        <SidebarLink
          to="/rooms"
          icon={<FaDoorOpen />}
          label="Rooms"
          collapsed={collapsed}
        />

        {user?.role === "admin" && (
          <SidebarLink
            to="/users"
            icon={<FaUsers />}
            label="Users"
            collapsed={collapsed}
          />
        )}

        <SidebarLink
          to="/bookings"
          icon={<FaCalendarAlt />}
          label="Bookings"
          collapsed={collapsed}
        />
      </nav>
    </aside>
  );
}

/* LINK COMPONENT */

function SidebarLink({
  to,
  icon,
  label,
  collapsed,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-btn ${isActive ? "active" : ""}`
      }
    >
      <span className="sidebar-icon">{icon}</span>
      {!collapsed && <span className="sidebar-label">{label}</span>}
    </NavLink>
  );
}