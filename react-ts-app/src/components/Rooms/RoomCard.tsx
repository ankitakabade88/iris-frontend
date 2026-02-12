import {
  FaUsers,
  FaBuilding,
  FaChalkboardTeacher,
} from "react-icons/fa";
import type { ReactNode } from "react";
import "./RoomCard.css";

export type RoomType = "training" | "conference" | "meeting";

export type Room = {
  id: number;
  name: string;
  type: RoomType;
  capacity: number;
  status: "available" | "booked";
};

type Props = {
  room: Room;
  onClick: (room: Room) => void;
};

const icons: Record<RoomType, ReactNode> = {
  training: <FaChalkboardTeacher />,
  conference: <FaBuilding />,
  meeting: <FaUsers />,
};

export default function RoomCard({ room, onClick }: Props) {
  return (
    <div className="room-card" onClick={() => onClick(room)}>
      <span className={`room-status ${room.status}`}>
        {room.status}
      </span>

      <div className={`icon ${room.type}`}>
        {icons[room.type]}
      </div>

      <h3>{room.name}</h3>
      <p>{room.type.toUpperCase()} ROOM</p>
    </div>
  );
}
