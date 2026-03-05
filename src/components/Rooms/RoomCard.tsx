import {
  FaUsers,
  FaBuilding,
  FaChalkboardTeacher,
} from "react-icons/fa";
import type { ReactNode, KeyboardEvent } from "react";
import "./RoomCard.css";

/* ================= TYPES ================= */

export type RoomType = "training" | "conference" | "meeting";

export type Room = {
  _id?: string;
  name: string;
  location?: string;
  capacity: number;
  type: string;
  isAvailable?: boolean;
  createdAt?: string;
};

type Props = {
  room: Room;
  onClick: (room: Room) => void;
  className?: string;
};

/* ================= ICON MAP ================= */

const icons: Record<RoomType, ReactNode> = {
  training: <FaChalkboardTeacher />,
  conference: <FaBuilding />,
  meeting: <FaUsers />,
};

/* ================= COMPONENT ================= */

export default function RoomCard({ room, onClick }: Props) {
  const type: RoomType =
    (room.type?.toLowerCase() as RoomType) || "meeting";

  const isAvailable = Boolean(room.isAvailable);

  /* Keyboard accessibility */
  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      onClick(room);
    }
  };

  return (
    <div
      className={`room-card ${
        isAvailable ? "available-card" : "busy-card"
      }`}
      onClick={() => onClick(room)}
      onKeyDown={handleKeyPress}
      role="button"
      tabIndex={0}
    >
      {/* STATUS BADGE */}
      <div className="room-card-header">
        <span
          className={`status-badge ${
            isAvailable ? "available" : "busy"
          }`}
        >
          <span className="status-dot" />
          {isAvailable ? "Available" : "Occupied"}
        </span>
      </div>

      {/* ICON */}
      <div className={`room-icon ${type}`}>
        {icons[type]}
      </div>

      {/* ROOM NAME */}
      <h3 className="room-title">{room.name}</h3>

      {/* ROOM TYPE */}
      <p className="room-type">
        {type.toUpperCase()} ROOM
      </p>

      {/* CAPACITY BADGE */}
      <div className="room-capacity-badge">
        Capacity • {room.capacity} people
      </div>
    </div>
  );
}