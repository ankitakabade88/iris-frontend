import { useState, useRef, useEffect, type CSSProperties } from "react";
import "./BookingCard.css";
import {
  FaDoorOpen,
  FaCalendarAlt,
  FaClock,
  FaEllipsisV,
} from "react-icons/fa";

/* ================= PROPS ================= */

type BookingCardProps = {
  _id: string;
  room: string;
  employee: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "Upcoming" | "Live" | "Completed";
  onClick: () => void;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  style?: CSSProperties;
};

/* ================= HELPERS ================= */

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/* ================= COMPONENT ================= */

export default function BookingCard({
  _id,
  room,
  employee,
  date,
  startTime,
  endTime,
  purpose,
  status,
  onClick,
  onEdit,
  onCancel,
  style,
}: BookingCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className="booking-card"
      onClick={onClick}
      style={style}
      role="button"
      tabIndex={0}
    >
      {/* STATUS BADGE */}
      <span className={`status-pill ${status.toLowerCase()}`}>
        {status}
      </span>

      {/* ACTION MENU */}
      <div
        className="card-actions"
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="menu-btn"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <FaEllipsisV />
        </button>

        {menuOpen && (
          <div className="actions-menu">
            <button onClick={() => onEdit(_id)}>Edit</button>
            <button
              className="danger"
              onClick={() => onCancel(_id)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* ICON */}
      <div className="booking-avatar">
        <FaDoorOpen />
      </div>

      {/* TITLE */}
      <h3 className="booking-room">{room}</h3>

      <p className="booking-employee">{employee}</p>

      {/* DETAILS */}
      <div className="booking-meta">
        <div>
          <FaCalendarAlt /> {formatDate(date)}
        </div>

        <div>
          <FaClock /> {startTime} – {endTime}
        </div>
      </div>

      <div className="booking-purpose">
        {purpose || "Meeting"}
      </div>
    </div>
  );
}