import { useState } from "react";
import {
  FaTachometerAlt,
  FaDoorOpen,
  FaUsers,
  FaUserCircle,
  FaBars,
  FaChevronDown,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

interface Props {
  onOpenSettings: () => void;
  onLogout: () => void; // ✅ REQUIRED
}

export default function Sidebar({ onOpenSettings, onLogout }: Props) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  // ✅ CORRECT LOGOUT HANDLER
  const handleLogout = () => {
    // clear storage
    localStorage.removeItem("auth");
    localStorage.removeItem("user");

    // close dropdown
    setProfileOpen(false);

    // update App auth state
    onLogout();

    // redirect
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      {/* LOGO */}
      <div className="logo">
        <span>Room Booking System</span>
        <button className="collapse-btn">
          <FaBars />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">
        <SidebarLink
          to="/dashboard"
          icon={<FaTachometerAlt />}
          label="Dashboard"
        />

        <SidebarLink
          to="/rooms"
          icon={<FaDoorOpen />}
          label="Rooms"
        />

        <SidebarLink
          to="/employees"
          icon={<FaUsers />}
          label="Employees"
        />
      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <div className="profile-dropdown-wrapper">
          <button
            className="sidebar-btn"
            onClick={() => setProfileOpen((prev) => !prev)}
          >
            <FaUserCircle />
            <span>Profile</span>
            <FaChevronDown
              className={`chevron ${profileOpen ? "open" : ""}`}
            />
          </button>

          {profileOpen && (
            <div className="profile-dropdown">
              <button
                className="dropdown-item"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/profile");
                }}
              >
                View Profile
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  setProfileOpen(false);
                  onOpenSettings();
                }}
              >
                Settings
              </button>

              <button
                className="dropdown-item danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

/* -----------------------------
   Sidebar Link Component
------------------------------ */

interface LinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function SidebarLink({ to, icon, label }: LinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-btn ${isActive ? "active" : ""}`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
