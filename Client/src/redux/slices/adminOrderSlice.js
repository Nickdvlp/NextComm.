import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// fetch all orders by admin
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async () => {
    const token = localStorage.getItem("userToken")?.replace(/^"|"$/g, "");
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
);

//  update order by admin

export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken")?.replace(/^"|"$/g, "");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        { status },
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

// delete order by admin

export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteProduct",
  async (id) => {
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return id;
  }
);

const adminOrderSlice = createSlice({
  name: "admin_orders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;

        // calculate total sales
        const totalSales = action.payload.reduce((acc, order) => {
          return acc + order.totalPrice;
        }, 0);
        state.totalSales = totalSales;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updateOrder = action.payload;
        const orderIndex = state.orders.findIndex(
          (order) => order._id === updateOrder._id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updateOrder;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      });
  },
});

export default adminOrderSlice.reducer;
