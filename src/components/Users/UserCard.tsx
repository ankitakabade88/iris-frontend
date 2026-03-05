import { FaUserTie } from "react-icons/fa";
import type { KeyboardEvent } from "react";
import { motion } from "framer-motion";
import "./UserCard.css";

export type UserRole = "admin" | "employee";

type Props = {
  name: string;
  role: UserRole;
  isAdmin: boolean;
  isActive: boolean;
  onClick: () => void;
};

export default function UserCard({
  name,
  role,
  isAdmin,
  isActive,
  onClick,
}: Props) {

  const clickable = isAdmin;

  /* ===== KEYBOARD ACCESS ===== */

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!clickable) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      layout
      whileHover={clickable ? { y: -4 } : undefined}
      whileTap={clickable ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`user-card ${clickable ? "clickable" : ""}`}
      onClick={clickable ? onClick : undefined}
      onKeyDown={handleKeyPress}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : -1}
      aria-disabled={!clickable}
    >

      {/* STATUS */}
      <div className="user-status-row">
        <span
          className={`status-badge ${
            isActive ? "active" : "pending"
          }`}
        >
          {isActive ? "Active" : "Pending"}
        </span>
      </div>

      {/* PROFILE */}
      <div className="user-profile">
        <div className="user-avatar">
          <FaUserTie />
        </div>

        <h3 className="user-name" title={name}>
          {name}
        </h3>

        <span className="user-role">
          {role === "admin"
            ? "Administrator"
            : "Employee"}
        </span>
      </div>

      {/* PERMISSION INFO */}
      {!clickable && (
        <div className="view-only-hint">
          View access only
        </div>
      )}
    </motion.div>
  );
}