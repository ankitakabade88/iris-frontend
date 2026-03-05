import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import api from "../../api/authApi";
import "./BookingModal.css";

/* ================= TYPES ================= */

type Booking = {
  _id: string;
  room: string | { name?: string };
  employee: string | { name?: string };
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "Upcoming" | "Live" | "Completed";
};

type BookingDetailsModalProps = {
  booking?: Booking;
  bookingId?: string;
  onClose: () => void;
};

/* ===================================================== */

export default function BookingDetailsModal({
  booking: bookingProp,
  bookingId,
  onClose,
}: BookingDetailsModalProps) {

  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [booking, setBooking] = useState<Booking | null>(
    bookingProp ?? null
  );
  const [loading, setLoading] = useState(!bookingProp);

  /* FETCH ONLY IF ID PROVIDED */

  useEffect(() => {
    if (!bookingId || bookingProp) return;

    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        setBooking(res?.data ?? res);
      } catch (err) {
        console.error("Booking fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, bookingProp]);

  /* ESC + SCROLL LOCK */

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", esc);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    setTimeout(() => closeBtnRef.current?.focus(), 80);

    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (!booking && loading) return null;

  const roomName =
    typeof booking?.room === "string"
      ? booking.room
      : booking?.room?.name || "Meeting Room";

  const employeeName =
    typeof booking?.employee === "string"
      ? booking.employee
      : booking?.employee?.name || "User";

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        onMouseDown={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal-card"
          onMouseDown={(e) => e.stopPropagation()}
          initial={{ scale: 0.96, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 20 }}
        >
          <div className="modal-header">
            <h2>{roomName}</h2>

            <span
              className={`modal-status ${
                booking?.status?.toLowerCase() ?? "upcoming"
              }`}
            >
              {booking?.status ?? "Upcoming"}
            </span>
          </div>

          <div className="modal-content">
            <div className="modal-row">
              <span>Date</span>
              <strong>{booking?.date}</strong>
            </div>

            <div className="modal-row">
              <span>Time</span>
              <strong>
                {booking?.startTime} — {booking?.endTime}
              </strong>
            </div>

            <div className="modal-row">
              <span>Employee</span>
              <strong>{employeeName}</strong>
            </div>

            {booking?.purpose && (
              <div className="modal-purpose">
                {booking.purpose}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <motion.button
              ref={closeBtnRef}
              className="modal-close-btn"
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}