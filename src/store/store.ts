import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import bookingReducer from "./bookingSlice";
import roomReducer from "./roomSlice";
import uiReducer from "./uiSlice";
import usersReducer from "./userSlice";

/*
=====================================================
   ROOT REDUX STORE
=====================================================
*/

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingReducer,
    rooms: roomReducer,
    users: usersReducer,
    ui: uiReducer,
  },

  // Redux DevTools (auto disabled in production)
  devTools: import.meta.env.MODE !== "production",
});

/*
=====================================================
   TYPES (GLOBAL TYPESAFE REDUX)
=====================================================
*/

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;