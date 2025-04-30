import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// fetch all users by admin
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
  const token = localStorage.getItem("userToken")?.replace(/^"|"$/g, "");
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
});

// add the create user by admin

export const AddUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken")?.replace(/^"|"$/g, "");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/add-user`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// update user info by admin

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, name, email, role }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken")?.replace(/^"|"$/g, "");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/user/${id}`,
        { name, email, role },
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

// delete user info by admin

export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
  const token = localStorage.getItem("userToken")?.replace(/^"|"$/g, "");
  await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/user/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return id;
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex(
          (user) => user._id === updatedUser._id
        );

        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(AddUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(AddUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default adminSlice.reducer;
