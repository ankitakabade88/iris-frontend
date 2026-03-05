import api from "./authApi";

/* ================= TYPES ================= */

export interface BookingPayload {
  employee: string;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  purpose?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface AvailabilityResponse {
  available: boolean;
}

/* ================= HELPERS ================= */

const getTodayDate = () =>
  new Date().toISOString().split("T")[0];

/* ================= ERROR HANDLER ================= */

const handleApiError = (err: any) => {
  const message =
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong";

  console.error("API ERROR:", message);

  throw new Error(message);
};

/* ================= SANITIZE ================= */

const sanitizeBooking = (
  data: BookingPayload
): BookingPayload => ({
  employee: data.employee,
  room: data.room,
  date: data.date,
  startTime: data.startTime,
  endTime: data.endTime,
  title: data.title.trim(),
  purpose: data.purpose?.trim() || "Meeting",
});

/* ================= GET BOOKINGS ================= */

export const fetchBookings = async (): Promise<any[]> => {
  try {

    const res = await api.get("/bookings", {
      params: { all: true },
    });

    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;

    return [];

  } catch (err) {

    handleApiError(err);
    return [];

  }
};

/* ================= CREATE BOOKING ================= */

export const createBooking = async (
  payload: BookingPayload
) => {
  try {

    const res = await api.post(
      "/bookings",
      sanitizeBooking(payload)
    );

    return res;

  } catch (err) {

    handleApiError(err);
    return null;

  }
};

/* ================= DELETE BOOKING ================= */

export const cancelBooking = async (id: string) => {
  try {

    const res = await api.delete(`/bookings/${id}`);

    return res;

  } catch (err) {

    handleApiError(err);
    return null;

  }
};

/* ================= BOOKED SLOTS ================= */

export const fetchBookedSlots = async (
  room: string,
  date: string
): Promise<TimeSlot[]> => {
  try {

    const params = new URLSearchParams({
      room,
      date,
    });

    const res = await api.get(
      `/bookings/slots?${params.toString()}`
    );

    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;

    return [];

  } catch (err) {

    handleApiError(err);
    return [];

  }
};

/* ================= ROOM TIMELINE (TODAY) ================= */

export const fetchRoomTimeline = async (
  room: string
): Promise<TimeSlot[]> => {
  try {

    const params = new URLSearchParams({
      room,
      date: getTodayDate(),
    });

    const res = await api.get(
      `/bookings/slots?${params.toString()}`
    );

    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;

    return [];

  } catch (err) {

    handleApiError(err);
    return [];

  }
};

/* ================= REAL-TIME ROOM AVAILABILITY ================= */

export const checkRoomAvailability = async (
  room: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<boolean> => {
  try {

    const res = await api.post(
      "/bookings/check-availability",
      {
        room,
        date,
        startTime,
        endTime,
      }
    );

    return res?.data?.available ?? false;

  } catch (err) {

    handleApiError(err);
    return false;

  }
};