import {
  FaUsers,
  FaBuilding,
  FaChalkboardTeacher,
} from "react-icons/fa";
import type { Room, RoomType } from "./RoomCard";
import type { ReactNode } from "react";
import "./RoomModal.css";

type Props = {
  room: Room;
  onClose: () => void;
};

const icons: Record<RoomType, ReactNode> = {
  training: <FaChalkboardTeacher />,
  conference: <FaBuilding />,
  meeting: <FaUsers />,
};

export default function RoomModal({ room, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`modal-icon ${room.type}`}>
          {icons[room.type]}
        </div>

        <h2>{room.name}</h2>

        <p>
          <strong>Type:</strong> {room.type.toUpperCase()}
        </p>
        <p>
          <strong>Capacity:</strong> {room.capacity}
        </p>
        <p>
          <strong>Status:</strong> {room.status}
        </p>

        <div className="modal-actions">
          <button className="secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="primary"
            disabled={room.status === "booked"}
          >
            Book Room
          </button>
        </div>
      </div>
    </div>
  );
}
