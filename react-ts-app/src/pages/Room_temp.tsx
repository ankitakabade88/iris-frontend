import { useState } from "react";
import RoomCard from "../components/Rooms/RoomCard";
import RoomModal from "../components/Rooms/RoomModal";
import type { Room } from "../components/Rooms/RoomCard";
import "../components/Rooms/RoomsGrid.css";

const rooms: Room[] = [
  {
    id: 1,
    name: "Room-1",
    type: "training",
    capacity: 30,
    status: "available",
  },
  {
    id: 2,
    name: "Conference Room - A",
    type: "conference",
    capacity: 20,
    status: "booked",
  },
  {
    id: 3,
    name: "Meeting Room - A",
    type: "meeting",
    capacity: 10,
    status: "available",
  },
  {
    id: 4,
    name: "Review Room",
    type: "conference",
    capacity: 15,
    status: "available",
  },
  {
    id: 5,
    name: "Discussion Room",
    type: "meeting",
    capacity: 8,
    status: "booked",
  },
  {
    id: 6,
    name: "Training Room - B",
    type: "training",
    capacity: 25,
    status: "available",
  },
];

export default function Rooms() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  return (
    <>
      <div className="rooms-page">
        <h1>Rooms</h1>

        <div className="rooms-grid">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={setSelectedRoom}
            />
          ))}
        </div>
      </div>

      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </>
  );
}
