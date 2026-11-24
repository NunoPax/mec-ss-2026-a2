import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const fetchBookOptions = createAsyncThunk(
  "books/fetchBookOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/options`, {
        credentials: "include",
      });
      const body = await response.json();

      if (!response.ok) {
        return rejectWithValue(body.error?.message || "Unable to load book options");
      }

      return body;
    } catch (_error) {
      return rejectWithValue("Unable to reach the backend");
    }
  }
);

export const searchBooks = createAsyncThunk(
  "books/searchBooks",
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      for (const [name, value] of Object.entries(filters)) {
        if (value.trim()) {
          params.set(name, value.trim());
        }
      }

      const query = params.toString();
      const response = await fetch(`${API_BASE_URL}/books/search${query ? `?${query}` : ""}`, {
        credentials: "include",
      });
      const body = await response.json();

      if (!response.ok) {
        return rejectWithValue(body.error?.message || "Unable to search books");
      }

      return body;
    } catch (_error) {
      return rejectWithValue("Unable to reach the backend");
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: {
    items: [],
    total: 0,
    options: {
      titles: [],
      authors: [],
      categories: [],
      keywords: [],
    },
    optionsStatus: "idle",
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookOptions.pending, (state) => {
        state.optionsStatus = "loading";
      })
      .addCase(fetchBookOptions.fulfilled, (state, action) => {
        state.optionsStatus = "succeeded";
        state.options = action.payload;
      })
      .addCase(fetchBookOptions.rejected, (state, action) => {
        state.optionsStatus = "failed";
        state.error = action.payload || "Unable to load book options";
      })
      .addCase(searchBooks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.books;
        state.total = action.payload.total;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to search books";
      });
  },
});

export default booksSlice.reducer;
