import { useState, useEffect, useRef } from "react";
import {  FaChevronDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import { BsBuildingsFill } from "react-icons/bs";
import "./Header.css";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Header({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.name ?? "User";

  /* Live Clock */
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = now.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const greeting = getGreeting();

  /* Close Dropdown */
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="rbs-logo">
          <BsBuildingsFill className="logo-icon" />
          <span className="logo-text">Room Booking System</span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-datetime">
          <div className="header-time">{formattedTime}</div>
          <div className="header-date">{formattedDate}</div>
        </div>

        <div className="header-greeting">
          {greeting}, <span>{userName}</span>
        </div>

        <div className="profile-wrapper" ref={dropdownRef}>
          <button
            className="profile-btn"
            onClick={() => setOpen((prev) => !prev)}
          >
            <div className="avatar-circle">
              {userName.charAt(0).toUpperCase()}
            </div>
            <FaChevronDown className={open ? "rotate" : ""} />
          </button>

          <div className={`profile-dropdown ${open ? "show" : ""}`}>
            <button onClick={() => navigate("/change-password")}>
              Change Password
            </button>

            <button className="danger" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}