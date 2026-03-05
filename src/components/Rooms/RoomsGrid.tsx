import React from "react";
import type { Room } from "./RoomCard";
import RoomsTable from "../Tables/RoomsTable";

/* =====================================================
   TYPES
===================================================== */

interface Props {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
}

/* =====================================================
   COMPONENT
===================================================== */

function RoomsGrid({ rooms, onSelectRoom }: Props) {
  return (
    <div className="rooms-table-wrapper">
      <RoomsTable
        rooms={rooms}
        onSelectRoom={onSelectRoom}
      />
    </div>
  );
}

export default React.memo(RoomsGrid);