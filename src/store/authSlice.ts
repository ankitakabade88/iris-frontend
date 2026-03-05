import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* =====================================================
TYPES
===================================================== */

export interface User {
_id: string;
name: string;
role: "admin" | "employee";
mustChangePassword?: boolean;
}

interface AuthState {
user: User | null;
token: string | null;
isLoggedIn: boolean;
loading: boolean;
error: string | null;
}

/* =====================================================
SAFE LOCAL STORAGE RESTORE
===================================================== */

const getStoredUser = (): User | null => {
try {
const data = localStorage.getItem("user");
return data ? JSON.parse(data) : null;
} catch {
return null;
}
};

const storedToken = localStorage.getItem("token");

/* =====================================================
INITIAL STATE
===================================================== */

const initialState: AuthState = {
user: getStoredUser(),
token: storedToken,
isLoggedIn: !!storedToken,
loading: false,
error: null,
};

/* =====================================================
SLICE
===================================================== */

const authSlice = createSlice({
name: "auth",
initialState,
reducers: {
/* ---------- LOGIN START ---------- */
loginStart: (state) => {
  state.loading = true;
  state.error = null;
},

/* ---------- LOGIN SUCCESS ---------- */
loginSuccess: (
  state,
  action: PayloadAction<{
    user: User;
    token: string;
  }>
) => {

  state.loading = false;
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isLoggedIn = true;

  /* persist session */
  localStorage.setItem("token", action.payload.token);
  localStorage.setItem(
    "user",
    JSON.stringify(action.payload.user)
  );
},

/* ---------- LOGIN FAILED ---------- */
loginFailure: (state, action: PayloadAction<string>) => {
  state.loading = false;
  state.error = action.payload;
},

/* ---------- LOGOUT ---------- */
logout: (state) => {
  state.user = null;
  state.token = null;
  state.isLoggedIn = false;
  state.error = null;

  localStorage.removeItem("token");
  localStorage.removeItem("user");
},
},
});

/* =====================================================
EXPORTS
===================================================== */

export const {
loginStart,
loginSuccess,
loginFailure,
logout,
} = authSlice.actions;

export default authSlice.reducer;
