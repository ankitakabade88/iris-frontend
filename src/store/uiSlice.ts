import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* =====================================================
   TYPES
===================================================== */

export type ViewMode = "cards" | "table";

export type RoomFilter =
  | "all"
  | "meeting"
  | "conference"
  | "training";

export type StatusFilter =
  | "all"
  | "active"
  | "inactive";

interface UIState {
  /* ROOMS UI */
  roomFilter: RoomFilter;
  viewMode: ViewMode;

  /* USERS UI */
  userViewMode: ViewMode;
  userStatusFilter: StatusFilter;

  /* GLOBAL */
  sidebarOpen: boolean;
}

/* =====================================================
   INITIAL STATE
===================================================== */

const initialState: UIState = {
  roomFilter: "all",
  viewMode: "table",

  userViewMode: "cards",
  userStatusFilter: "all",

  sidebarOpen: true,
};

/* =====================================================
   SLICE
===================================================== */

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    /* ROOMS */
    setRoomFilter: (
      state,
      action: PayloadAction<RoomFilter>
    ) => {
      state.roomFilter = action.payload;
    },

    setViewMode: (
      state,
      action: PayloadAction<ViewMode>
    ) => {
      state.viewMode = action.payload;
    },

    /* USERS */
    setUserViewMode: (
      state,
      action: PayloadAction<ViewMode>
    ) => {
      state.userViewMode = action.payload;
    },

    setUserStatusFilter: (
      state,
      action: PayloadAction<StatusFilter>
    ) => {
      state.userStatusFilter = action.payload;
    },

    /* GLOBAL */
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const {
  setRoomFilter,
  setViewMode,
  setUserViewMode,
  setUserStatusFilter,
  toggleSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;