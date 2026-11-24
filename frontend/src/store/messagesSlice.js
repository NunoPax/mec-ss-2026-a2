import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        credentials: "include",
      });
      const body = await response.json();

      if (!response.ok) {
        return rejectWithValue(body.error?.message || "Unable to load messages");
      }

      return body.messages;
    } catch (_error) {
      return rejectWithValue("Unable to reach the backend");
    }
  }
);

export const createMessage = createAsyncThunk(
  "messages/createMessage",
  async (message, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
      const body = await response.json();

      if (!response.ok) {
        return rejectWithValue(body.error?.message || "Unable to save message");
      }

      return body;
    } catch (_error) {
      return rejectWithValue("Unable to reach the backend");
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    items: [],
    status: "idle",
    submitStatus: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to load messages";
      })
      .addCase(createMessage.pending, (state) => {
        state.submitStatus = "loading";
        state.error = null;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.error = action.payload || "Unable to save message";
      });
  },
});

export default messagesSlice.reducer;
