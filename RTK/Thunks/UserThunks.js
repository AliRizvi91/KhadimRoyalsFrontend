import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'sonner';

// getAllUsers
export const getAllUsers = createAsyncThunk("Users/All", async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/user`);
  return response.data;
});

//------ Login ------

// Update your login thunk to handle verification
export const login = createAsyncThunk(
  "login/User",
  async (data, { rejectWithValue }) => {

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/user/login`,
        data
      );

      if (response.status === 200) {
        toast('Verification email sent. Please check your inbox.');
        const success = new Audio('/assets/Sounds/notification.mp3');
        success.play();
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Token Verification
export const TokenVerification = createAsyncThunk(
  "TokenVerification/User",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/user/verify-token`,
        { token }  // Send as an object in the request body
      );


      return response.data;  // Return the response data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// ResendToken
export const ResendToken = createAsyncThunk(
  "user/resendToken",
  async ({ email, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/user/resend-token`,
        { email, token }  // Send directly as the request body
      );
      
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// mailForResetPassword
export const mailForResetPassword = createAsyncThunk(
  "user/mailResetPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/user/mail-for-reset-password`,
        { email }  // Send directly as the request body
      );

      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// ResetPassword
export const ResetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/user/reset-password`,
        { token, password }
      );

      // Check if response status is 200
      if (response.status === 200) {
        // Redirect to home page
        if (typeof window !== 'undefined') {
          window.location.href = `/response-resetpassword?token=${token}`;
        }
      }

      return response.data;
    } catch (error) {
      // Show error message from server or default message
      toast.error(error.response?.data?.message || 'Password reset failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const signup = createAsyncThunk("signup/User", async (formData) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/user/signup`,
      formData
    );
    toast.success('SignUp successfully');

    return response.data;
  } catch (error) {
    console.error('Error while signing up:', error);
    throw error;
  }
});


export const getme = createAsyncThunk("getme/User", async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/user/profile`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  return response.data;
});



export const userUpdate = createAsyncThunk("Update/User", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/user/${id}`, formData)

    if (response.status === 200) {
      const success = new Audio('/assets/Sounds/notification.mp3');
      success.play();
      toast('Updated successfully');
    } else {
      const error = new Audio('/assets/Sounds/notification.mp3');
      error.play();
      toast('Failed to Update');
    }
    return response.data; // Assuming response.data is the expected data on success
  } catch (error) {
    console.error('Error Thunk:', error);
    return rejectWithValue(error.response?.data || 'An error occurred while updating the user.');
  }
});

