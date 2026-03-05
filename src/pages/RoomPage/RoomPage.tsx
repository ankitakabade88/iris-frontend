import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setRoomFilter, setViewMode } from "../../store/uiSlice";
import { fetchRooms } from "../../store/roomSlice";

import type { Room } from "../../components/Rooms/RoomCard";
import RoomCard from "../../components/Rooms/RoomCard";
import RoomModal from "../../components/Rooms/RoomModal";
import RoomsGrid from "../../components/Rooms/RoomsGrid";

import { TbCards } from "react-icons/tb";
import { LiaTableSolid } from "react-icons/lia";

import "./RoomPage.css";

type RoomFilter = "all" | "meeting" | "conference" | "training";

export default function RoomsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /* ================= REDUX STATE ================= */

  const currentUser = useAppSelector(
    (state) => state.auth.user
  );

  const rooms = useAppSelector(
    (state) => state.rooms.rooms
  );

  const loading = useAppSelector(
    (state) => state.rooms.loading
  );

  const filterType = useAppSelector(
    (state) => state.ui.roomFilter
  ) as RoomFilter;

  const viewMode = useAppSelector(
    (state) => state.ui.viewMode
  );

  /* ================= LOCAL UI ================= */

  const [selectedRoom, setSelectedRoom] =
    useState<Room | null>(null);

  const [search, setSearch] = useState("");

  /* ================= FETCH ROOMS (REDUX) ================= */

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  /* ================= FILTERING ================= */

  const filteredRooms = useMemo(() => {
    return rooms
      .filter((r) =>
        filterType === "all"
          ? true
          : r.type?.toLowerCase() === filterType
      )
      .filter((r) =>
        `${r.name} ${r.type}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [rooms, search, filterType]);

  /* ================= UI ================= */

  return (
    <div className="rooms-page">
      <div className="rooms-workspace">

        {/* ===== HEADER ===== */}
        <div className="page-toolbar">
          <div>
            <h1 className="page-title">Rooms</h1>
            <p className="page-subtitle">
              Manage meeting rooms and availability
            </p>
          </div>

          <div className="toolbar-right">

            <input
              className="search-input"
              placeholder="Search rooms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* FILTER (REDUX) */}
            <select
              className="filter-dropdown"
              value={filterType}
              onChange={(e) =>
                dispatch(setRoomFilter(e.target.value as RoomFilter))
              }
            >
              <option value="all">All</option>
              <option value="meeting">Meeting</option>
              <option value="conference">Conference</option>
              <option value="training">Training</option>
            </select>

            {/* VIEW TOGGLE (REDUX) */}
            <div className="view-toggle">
              <button
                className={viewMode === "cards" ? "active" : ""}
                onClick={() => dispatch(setViewMode("cards"))}
              >
                <TbCards />
              </button>

              <button
                className={viewMode === "table" ? "active" : ""}
                onClick={() => dispatch(setViewMode("table"))}
              >
                <LiaTableSolid />
              </button>
            </div>

            {currentUser?.role === "admin" && (
              <button
                className="btn-primary"
                onClick={() => navigate("/add-room")}
              >
                + Add Room
              </button>
            )}
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="rooms-section-card">
          {loading ? (
            <div className="empty-state">Loading rooms...</div>
          ) : filteredRooms.length === 0 ? (
            <div className="empty-state">No rooms found</div>
          ) : viewMode === "table" ? (
            <RoomsGrid
              rooms={filteredRooms}
              onSelectRoom={setSelectedRoom}
            />
          ) : (
            <div className="rooms-grid">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onClick={setSelectedRoom}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}