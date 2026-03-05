import {
createSlice,
createAsyncThunk,
} from "@reduxjs/toolkit";
import api from "../api/authApi";

/* =====================================================
TYPES
===================================================== */

export type UserRole = "admin" | "employee";

export interface User {
_id: string;
name: string;
email?: string;
role: UserRole;
isActive: boolean;
}

interface UserState {
users: User[];
loading: boolean;
creating: boolean;
error: string | null;
}

/* =====================================================
INITIAL STATE
===================================================== */

const initialState: UserState = {
users: [],
loading: false,
creating: false,
error: null,
};

/* =====================================================
FETCH USERS
===================================================== */

export const fetchUsers = createAsyncThunk(
"users/fetchUsers",
async (_, { rejectWithValue }) => {
try {
const res = await api.get("/users");
const payload = res.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
} catch (err: any) {
  return rejectWithValue(
    err?.response?.data?.message || "Failed to fetch users"
  );
}

}
);

/* =====================================================
CREATE USER (NOW WITH TEMP PASSWORD)
===================================================== */

export const createUser = createAsyncThunk(
  "users/createUser",
  async (
    data: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/users", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "employee",
      });

      return res.data?.data ?? res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "User creation failed"
      );
    }
  }
);

/* =====================================================
DELETE USER
===================================================== */

export const deleteUser = createAsyncThunk(
"users/deleteUser",
async (userId: string, { rejectWithValue }) => {
try {
await api.delete(`/users/${userId}`);
return userId;
} catch (err: any) {
return rejectWithValue(
err?.response?.data?.message || "Delete failed"
);
}
}
);
localStorage.clear()

/* =====================================================
SLICE
===================================================== */

const userSlice = createSlice({
name: "users",
initialState,
reducers: {},

extraReducers: (builder) => {
builder

  /* FETCH USERS */
  .addCase(fetchUsers.pending, (state) => {
    state.loading = true;
  })
  .addCase(fetchUsers.fulfilled, (state, action) => {
    state.loading = false;
    state.users = action.payload;
  })
  .addCase(fetchUsers.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  })

  /* CREATE USER */
  .addCase(createUser.pending, (state) => {
    state.creating = true;
  })
  .addCase(createUser.fulfilled, (state, action) => {
    state.creating = false;

    if (action.payload) {
      state.users.unshift(action.payload);
    }
  })
  .addCase(createUser.rejected, (state, action) => {
    state.creating = false;
    state.error = action.payload as string;
  })

  /* DELETE USER */
  .addCase(deleteUser.pending, (state, action) => {
    state.users = state.users.filter(
      (u) => u._id !== action.meta.arg
    );
  })
  .addCase(deleteUser.rejected, (state, action) => {
    state.error = action.payload as string;
  });

},
});

export default userSlice.reducer;
