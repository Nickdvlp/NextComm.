import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// fetch all products by admin
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAdminProducts",
  async () => {
    const token = localStorage.getItem("userToken")?.replace(/^"|"$/g, "");
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
);

//  create product by admin

export const createAdminProduct = createAsyncThunk(
  "adminProducts/createAdminProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken")?.replace(/^"|"$/g, "");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,
        productData,
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

// update products info by admin

export const updateAdminProduct = createAsyncThunk(
  "adminProducts/updateAdminProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken")?.replace(/^"|"$/g, "");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/update/${id}`,
        productData,
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

// delete product by admin

export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id) => {
    const token = localStorage.getItem("userToken")?.replace(/^"|"$/g, "");
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/remove/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return id;
  }
);

const adminProductSlice = createSlice({
  name: "admin_products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      });
  },
});

export default adminProductSlice.reducer;
