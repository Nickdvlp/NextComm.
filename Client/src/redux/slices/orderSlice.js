import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsersOrder = createAsyncThunk(
  "orders/fetchUsersOrder",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken")?.replace(/^"|"$/g, "");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

// Fetch order details

export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken")?.replace(/^"|"$/g, "");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    totalOrders: 0,
    orderDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUsersOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default orderSlice.reducer;
