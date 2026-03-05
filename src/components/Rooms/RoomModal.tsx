import {
  FaUsers,
  FaBuilding,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import { fetchBookedSlots } from "../../api/bookingApi";
import type { Room, RoomType } from "./RoomCard";
import "./RoomModal.css";

type Props = {
  room: Room | null;
  onClose: () => void;
};

type Slot = {
  startTime: string;
  endTime: string;
};

/* ================= ICON MAP ================= */

const icons: Record<RoomType, React.ReactNode> = {
  training: <FaChalkboardTeacher />,
  conference: <FaBuilding />,
  meeting: <FaUsers />,
};

const normalizeType = (type?: string): RoomType => {
  const t = type?.toLowerCase();
  if (t === "training" || t === "conference" || t === "meeting")
    return t;
  return "meeting";
};

/* ================= TIME HELPERS ================= */

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const DAY_START = 8 * 60;
const DAY_END = 19 * 60;
const DAY_TOTAL = DAY_END - DAY_START;

export default function RoomModal({ room, onClose }: Props) {
  const navigate = useNavigate();
  const navigatingRef = useRef(false);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [currentPos, setCurrentPos] = useState<number | null>(null);

  /* ===== LOCK BODY SCROLL ===== */
  useEffect(() => {
  if (!room) return;

  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "auto";
  };
}, [room]);

  /* ===== ESC CLOSE ===== */
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  /* ===== LOAD BOOKINGS ===== */
  useEffect(() => {
    if (!room?._id) return;

    const today = new Date().toISOString().split("T")[0];

    fetchBookedSlots(room._id, today)
      .then((res) => setSlots(res || []))
      .catch(() => setSlots([]));
  }, [room]);

  /* ===== LIVE TIME ===== */
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();

      if (minutes < DAY_START || minutes > DAY_END) {
        setCurrentPos(null);
        return;
      }

      setCurrentPos(
        ((minutes - DAY_START) / DAY_TOTAL) * 100
      );
    };

    update();
    const i = setInterval(update, 60000);
    return () => clearInterval(i);
  }, []);

  /* ===== AVAILABILITY ===== */
  const isAvailableNow = useMemo(() => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();

    return !slots.some(
      (s) =>
        minutes >= toMinutes(s.startTime) &&
        minutes < toMinutes(s.endTime)
    );
  }, [slots]);

  if (!room) return null;

  const roomType = normalizeType(room.type);

  /* ===== BOOK ROOM ===== */
  const handleBookRoom = () => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;

    onClose();

    requestAnimationFrame(() => {
      navigate("/book-room", {
        state: {
          roomId: room._id,
          roomName: room.name,
        },
      });
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="room-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`room-status-badge ${
            isAvailableNow ? "available" : "busy"
          }`}
        >
          <span className="dot" />
          {isAvailableNow ? "Available Now" : "Currently Busy"}
        </div>

        <div className={`modal-icon ${roomType}`}>
          {icons[roomType]}
        </div>

        <h2 className="modal-title">{room.name}</h2>

        <div className="modal-info">
          <div className="info-card">
            <span>Type</span>
            <p>{roomType.toUpperCase()}</p>
          </div>

          <div className="info-card">
            <span>Capacity</span>
            <p>{room.capacity} People</p>
          </div>
        </div>

        {/* ===== TIMELINE ===== */}
        <div className="timeline-wrapper">
          <h4>Today's Schedule</h4>

          <div className="timeline">
            <div className="timeline-track" />

            {slots.map((slot, i) => {
              const start =
                ((toMinutes(slot.startTime) - DAY_START) /
                  DAY_TOTAL) *
                100;

              const width =
                ((toMinutes(slot.endTime) -
                  toMinutes(slot.startTime)) /
                  DAY_TOTAL) *
                100;

              return (
                <div
                  key={i}
                  className="timeline-block"
                  style={{
                    left: `${start}%`,
                    width: `${width}%`,
                  }}
                />
              );
            })}

            {currentPos !== null && (
              <div
                className="timeline-now"
                style={{ left: `${currentPos}%` }}
              >
                <span />
              </div>
            )}
          </div>

          <div className="timeline-labels">
            <span>08:00</span>
            <span>13:00</span>
            <span>19:00</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="secondary" onClick={onClose}>
            Close
          </button>

          <button className="primary" onClick={handleBookRoom}>
            Book Room
          </button>
        </div>
      </div>
    </div>
  );
}