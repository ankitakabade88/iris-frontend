import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  FaCalendarAlt,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";

import { toast } from "react-toastify";
import {
  createBooking,
  fetchBookedSlots,
} from "../../api/bookingApi";
import { fetchRooms } from "../../api/roomApi";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useMutation,
  useQueryClient,   // ⭐ ADDED
} from "@tanstack/react-query";

import "./BookRoom.css";

/* ================= VALIDATION ================= */

const bookingSchema = z.object({
  employee: z.string(),
  room: z.string().min(1),
  title: z.string().min(3),
  purpose: z.string().min(3, "Purpose required"),
  date: z.string().min(1),
  startTime: z.string().min(1, "Select start time"),
  endTime: z.string().min(1, "Select end time"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

type TimeSlot = {
  startTime: string;
  endTime: string;
};

type Room = {
  _id: string;
  name: string;
  capacity: number;
};

export default function BookRoom() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // ⭐ ADDED
  const modalRef = useRef<HTMLFormElement | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedDate, setSelectedDate] =
    useState<Date | null>(new Date());
  const [bookedSlots, setBookedSlots] =
    useState<TimeSlot[]>([]);

  /* ================= FORM ================= */

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      employee: user?.id || "",
      room: "",
      title: "",
      purpose: "",
      date: "",
      startTime: "",
      endTime: "",
    },
  });

  const room = watch("room");
  const date = watch("date");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  /* ================= ESC CLOSE ================= */

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate(-1);
    };

    window.addEventListener("keydown", handleEsc);
    return () =>
      window.removeEventListener("keydown", handleEsc);
  }, [navigate]);

  /* ================= OUTSIDE CLICK ================= */

  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!modalRef.current) return;

    if (!modalRef.current.contains(e.target as Node)) {
      navigate(-1);
    }
  };

  /* ================= LOAD ROOMS ================= */

  useEffect(() => {
    fetchRooms()
      .then(setRooms)
      .catch(() => toast.error("Rooms failed"));
  }, []);

  /* ================= DATE ================= */

  useEffect(() => {
    if (!selectedDate) return;
    setValue(
      "date",
      selectedDate.toISOString().split("T")[0]
    );
  }, [selectedDate, setValue]);

  /* ================= FETCH BOOKED ================= */

  useEffect(() => {
    if (!room || !date) return;

    fetchBookedSlots(room, date)
      .then(setBookedSlots)
      .catch(() => setBookedSlots([]));
  }, [room, date]);

  /* ================= TIME OPTIONS ================= */

  const timeOptions = useMemo(() => {
    const arr: string[] = [];
    for (let h = 9; h <= 18; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 18 && m > 0) break;
        arr.push(
          `${String(h).padStart(2, "0")}:${String(m).padStart(
            2,
            "0"
          )}`
        );
      }
    }
    return arr;
  }, []);

  const isBlocked = (t: string) =>
    bookedSlots.some(
      (s) => t >= s.startTime && t < s.endTime
    );

  /* ================= MUTATION ✅ FIXED ================= */

  const mutation = useMutation({
    mutationFn: createBooking,

    onSuccess: async () => {
      toast.success("Booking Confirmed");

      // ⭐ REFRESH BOOKINGS PAGE AUTOMATICALLY
      await queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });

      navigate("/bookings");
    },

    onError: () => toast.error("Booking failed"),
  });

  const onSubmit = (data: BookingFormData) => {
    if (data.endTime <= data.startTime) {
      toast.error("End time must be after start time");
      return;
    }

    mutation.mutate(data);
  };

  /* ================= UI ================= */

  return (
    <div
      className="booking-overlay"
      onMouseDown={handleOverlayClick}
    >
      <form
        ref={modalRef}
        className="glass-modal"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* LEFT PANEL */}
        <div className="form-left-panel">
          <div className="inner-card">
            <div className="form-header">
              <h2>Book Conference Room</h2>
              <p>
                Complete the details below to secure your
                session.
              </p>
            </div>

            <div className="form-content-scroll">
              <div className="form-grid">
                <input
                  placeholder="Meeting Title"
                  {...register("title")}
                />

                <select {...register("room")}>
                  <option value="">Select Room</option>
                  {rooms.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name} (Cap {r.capacity})
                    </option>
                  ))}
                </select>

                <input
                  className="full"
                  placeholder="Purpose"
                  {...register("purpose")}
                />
              </div>

              <div className="display-box">
                <FaCalendarAlt />
                {selectedDate?.toDateString()}
              </div>

              <h4 className="time-label">Start Time</h4>
              <div className="slot-grid">
                {timeOptions.map((t) => (
                  <button
                    type="button"
                    key={t}
                    disabled={isBlocked(t)}
                    onClick={() =>
                      setValue("startTime", t)
                    }
                    className={`time-slot-btn ${
                      startTime === t
                        ? "range-active"
                        : ""
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <h4 className="time-label">End Time</h4>
              <div className="slot-grid">
                {timeOptions.map((t) => (
                  <button
                    type="button"
                    key={t}
                    disabled={isBlocked(t)}
                    onClick={() =>
                      setValue("endTime", t)
                    }
                    className={`time-slot-btn ${
                      endTime === t
                        ? "range-active"
                        : ""
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-confirm"
                disabled={
                  !isValid || mutation.isPending
                }
              >
                <FaCheckCircle />
                {mutation.isPending
                  ? "Booking..."
                  : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="form-right-panel">
          <div className="inner-card calendar-card">
            <h3>Date & Time</h3>

            <DatePicker
              selected={selectedDate}
              onChange={(d: SetStateAction<Date | null>) =>
                setSelectedDate(d)
              }
              inline
              minDate={new Date()}
              filterDate={(date) => {
                const day = date.getDay();
                return day !== 0 && day !== 6;
              }}
            />

            <div className="disclaimer-box">
              <FaInfoCircle />
              <p>Weekend bookings are disabled.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}