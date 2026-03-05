import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../api/authApi";

/* =====================================================
   TYPES
===================================================== */

export interface Booking {
  _id: string;
  roomId: string;
  date: string;
  startTime: string;
  [key: string]: any;
}

interface BookingDraft {
  selectedRoomId: string | null;
  date: string | null;
  startTime: string | null;
}

interface BookingState {
  draft: BookingDraft;

  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

/* =====================================================
   INITIAL STATE
===================================================== */

const initialState: BookingState = {
  draft: {
    selectedRoomId: null,
    date: null,
    startTime: null,
  },

  bookings: [],
  loading: false,
  error: null,
};

/* =====================================================
   ASYNC THUNK — FETCH BOOKINGS
===================================================== */

export const fetchBookings = createAsyncThunk<
  Booking[],
  void,
  { rejectValue: string }
>("bookings/fetchBookings", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/bookings");
    return res.data?.data ?? res.data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Failed to fetch bookings"
    );
  }
});

/* =====================================================
   SLICE
===================================================== */

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    /* ---------- UPDATE DRAFT ---------- */
    setBookingDraft: (
      state,
      action: PayloadAction<Partial<BookingDraft>>
    ) => {
      state.draft = { ...state.draft, ...action.payload };
    },

    /* ---------- CLEAR ONLY FORM ---------- */
    clearBookingDraft: (state) => {
      state.draft = {
        selectedRoomId: null,
        date: null,
        startTime: null,
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })

      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

/* =====================================================
   EXPORTS
===================================================== */

export const { setBookingDraft, clearBookingDraft } =
  bookingSlice.actions;

export default bookingSlice.reducer;