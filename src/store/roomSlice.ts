import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import api from "../api/authApi";

/* =====================================================
   TYPES
===================================================== */

export interface Room {
  _id: string;
  name: string;
  capacity: number;
  type: string;
  location: string;
  isAvailable: boolean;
  [key: string]: any;
}

interface RoomState {
  rooms: Room[];
  loading: boolean;
  error: string | null;
}

/* =====================================================
   INITIAL STATE
===================================================== */

const initialState: RoomState = {
  rooms: [],
  loading: false,
  error: null,
};

/* =====================================================
   ASYNC THUNK — FETCH ROOMS
===================================================== */

export const fetchRooms = createAsyncThunk<
  Room[],
  void,
  { rejectValue: string }
>("rooms/fetchRooms", async (_, { rejectWithValue }) => {
  try {
    const res: any = await api.get("/rooms");

    const roomsArray =
      res?.data ||
      res?.rooms ||
      (Array.isArray(res) ? res : []);

    return roomsArray.map((r: any) => ({
      ...r,
      isAvailable: Boolean(r.isAvailable),
    }));
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Failed to fetch rooms"
    );
  }
});
/* =====================================================
   CREATE ROOM
===================================================== */

export const createRoom = createAsyncThunk<
  Room,
  Omit<Room, "_id" | "isAvailable">,
  { rejectValue: string }
>("rooms/createRoom", async (roomData, { rejectWithValue }) => {
  try {
    const res = await api.post("/rooms", roomData);
    const room = res.data?.data ?? res.data;

    return {
      ...room,
      isAvailable: Boolean(room.isAvailable),
    };
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Failed to create room"
    );
  }
});
/* =====================================================
   SLICE
===================================================== */

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
            // instant UI update
        state.rooms.unshift(action.payload);
        })

      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to load rooms";
      });

  },
});

/* =====================================================
   EXPORT
===================================================== */

export default roomSlice.reducer;