import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      });
      const body = await response.json();

      if (!response.ok) {
        return rejectWithValue(null);
      }

      return body;
    } catch (_error) {
      return rejectWithValue("Unable to reach the backend");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const body = await response.json();

      if (!response.ok) {
        return rejectWithValue(body.error?.message || "Unable to sign in");
      }

      return body;
    } catch (_error) {
      return rejectWithValue("Unable to reach the backend");
    }
  }
);

export const logoutSession = createAsyncThunk("auth/logoutSession", async () => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (_error) {
    return null;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "loading",
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.user = null;
        state.error = action.payload || null;
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to sign in";
      })
      .addCase(logoutSession.fulfilled, (state) => {
        state.status = "unauthenticated";
        state.user = null;
        state.error = null;
      })
      .addCase(logoutSession.rejected, (state) => {
        state.status = "unauthenticated";
        state.user = null;
        state.error = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
