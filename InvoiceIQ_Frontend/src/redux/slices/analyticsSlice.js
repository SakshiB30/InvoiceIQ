import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import analyticsService from "../../services/analyticsService";

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAnalytics",
  async ({ fromDate = null, toDate = null } = {}, thunkAPI) => {
    try {
      return await analyticsService.getAnalytics(fromDate, toDate);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch analytics"
      );
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  fromDate: null,
  toDate: null,
};

const analyticsSlice = createSlice({
  name: "analytics",

  initialState,

  reducers: {
    setAnalyticsDateRange: (state, action) => {
      state.fromDate = action.payload.fromDate;
      state.toDate = action.payload.toDate;
    },

    clearAnalytics: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
      state.fromDate = null;
      state.toDate = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })

      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch analytics";
      });
  },
});

export const {
  setAnalyticsDateRange,
  clearAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;

