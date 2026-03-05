import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { FaTable, FaThLarge, FaSearch } from "react-icons/fa";
import { toast } from "sonner";

import BookingCard from "./BookingCard";
import BookingDetailsModal from "./BookingModal";
import BookingSkeleton from "./BookingSkeleton";
import BookingTable from "../Tables/BookingTable";

import { fetchBookings, cancelBooking } from "../../api/bookingApi";

import "./BookingsGrid.css";

/* ================= TYPES ================= */

export type Booking = {
  _id: string;
  room: string;
  employee: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "Upcoming" | "Live" | "Completed";
};

/* ================= COMPONENT ================= */

export default function BookingsGrid() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [view, setView] = useState<"table" | "cards">("table");
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<"all" | "Upcoming" | "Live" | "Completed">("all");

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  /* ✅ LIGHTWEIGHT REALTIME CLOCK */
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  /* ===== FETCH BOOKINGS ===== */

  const { data = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    staleTime: 1000 * 60 * 2,
  });

  /* ===== HELPERS ===== */

  const buildLocalDate = (date: string, time: string) => {
    const [y, m, d] = date.split("T")[0].split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm, 0, 0);
  };

  const formatTime = (t?: string) => {
    if (!t) return "--";
    const [h, m] = t.split(":");
    const hour = Number(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  /* ===== NORMALIZE + STATUS ===== */

  const bookings: Booking[] = useMemo(() => {
    return (Array.isArray(data) ? data : []).map((b: any) => {

      const start = buildLocalDate(b.date, b.startTime);
      const end = buildLocalDate(b.date, b.endTime);

      let status: Booking["status"];

      if (now > end) status = "Completed";
      else if (now >= start && now <= end) status = "Live";
      else status = "Upcoming";

      return {
        _id: b._id,
        room: b.room?.name ?? "Unknown Room",
        employee: b.employee?.name ?? "Unknown User",
        date: b.date,
        startTime: formatTime(b.startTime),
        endTime: formatTime(b.endTime),
        purpose: b.purpose || "Meeting",
        status,
      };
    });
  }, [data, now]);

  /* ===== FILTER ===== */

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.room.toLowerCase().includes(search.toLowerCase()) ||
        b.employee.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        filter === "all" || b.status === filter;

      return matchSearch && matchStatus;
    });
  }, [bookings, search, filter]);

  /* ===== CANCEL ===== */

  const handleCancel = async (id: string) => {
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    } catch {}
  };

  /* ================= UI ================= */

  return (
    <div className="bookings-grid-page">

      {/* TOOLBAR */}
      <div className="grid-toolbar">

        <div className="toolbar-left">
          <div className="search-box">
            <FaSearch />
            <input
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            {["all","Upcoming","Live","Completed"].map(f => (
              <button
                key={f}
                className={filter === f ? "active" : ""}
                onClick={() => setFilter(f as any)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-right">
          <div className="view-toggle">
            <button
              className={view==="table"?"active":""}
              onClick={()=>setView("table")}
            ><FaTable/></button>

            <button
              className={view==="cards"?"active":""}
              onClick={()=>setView("cards")}
            ><FaThLarge/></button>
          </div>

          <button
            className="add-booking-btn"
            onClick={()=>navigate("/book-room")}
          >
            + Add Booking
          </button>
        </div>
      </div>

      {isLoading ? (
        <BookingSkeleton/>
      ) : view==="cards" ? (
        <div className="bookings-card-grid">
          {filtered.map(b=>(
            <BookingCard
              key={b._id}
              {...b}
              onClick={()=>setSelectedBooking(b)}
              onEdit={()=>setSelectedBooking(b)}
              onCancel={handleCancel}
            />
          ))}
        </div>
      ) : (
        <BookingTable
          bookings={filtered}
          onRowClick={(b)=>setSelectedBooking(b)}
        />
      )}

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={()=>setSelectedBooking(null)}
        />
      )}
    </div>
  );
}