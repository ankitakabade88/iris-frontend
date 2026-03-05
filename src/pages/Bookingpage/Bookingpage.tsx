import { useEffect } from "react";
import { useDispatch } from "react-redux";

import BookingsGrid from "../../components/Bookings/BookingsGrid";
import "./Bookingpage.css";

/* ✅ REDUX */
import { fetchBookings } from "../../store/bookingSlice";

export default function BookingPage() {
  const dispatch = useDispatch();

  /* =====================================================
     LOAD BOOKINGS ON PAGE OPEN
  ===================================================== */
  useEffect(() => {
    dispatch(fetchBookings() as any);
  }, [dispatch]);

  return (
    <div className="booking-page">
      {/* CENTERED WRAPPER ⭐ */}
      <div className="booking-container">

        {/* ===== HEADER ===== */}
        <header className="booking-page-header">
          <div>
            <h1 className="page-title">My Bookings</h1>
            <p className="page-subtitle">
              Manage and track your meeting reservations
            </p>
          </div>
        </header>

        {/* ===== CONTENT CARD AREA ===== */}
        <main className="booking-page-content">
          <BookingsGrid />
        </main>

      </div>
    </div>
  );
}