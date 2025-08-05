"use client"
import { createSlice } from "@reduxjs/toolkit";
import { login, TokenVerification, signup, getme, userUpdate, getAllUsers } from "../Thunks/UserThunks";
import { toast } from "sonner";

// Helper function to safely access localStorage
const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token") || null;
  }
  return null;
};

// Define initial state
const initialState = {
  user: null,
  AllUsers: [],
  ModalOfAuth: false,
  token: getInitialToken(),
  loading: false,
  error: null,
};

// Create user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
      }
    },
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    setAuthModal: (state, action) => {
      state.ModalOfAuth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(TokenVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(TokenVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem("token", action.payload.token);
        }
        toast.success('Email verified successfully!');
      })
      .addCase(TokenVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload?.message || 'Email verification failed');
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getme.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        // Clear token if unauthorized
        if (action.payload?.status === 401 || action.payload?.status === 402) {
          state.token = null;
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
          }
        }
      })
      .addCase(userUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(userUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.AllUsers = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, setCredentials, setAuthModal } = userSlice.actions;
export default userSlice.reducer;