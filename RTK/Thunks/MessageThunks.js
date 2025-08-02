import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'sonner';

//------ getAllMessage ------
export const getmessage = createAsyncThunk(
  'Messages/get',
  async ({recieverId}) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/message/${recieverId}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`
          },
        });
      return response.data;
    } catch (error) {
      console.error("Get Messages Error", error);
      throw error;
    }
  }
);
//------ DeleteAllMessages ------
export const DeleteAllMessages = createAsyncThunk(
  'AllMessages/delete',
  async ({receiverId}) => { // Fixed parameter name to match backend
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/message/${receiverId}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`
          },
        });
      return response.data;
    } catch (error) {
      console.error("Delete Messages Error", error);
      throw error;
    }
  }
);
export const DeleteMessage = createAsyncThunk(
  'Msg/delete',
  async ({ receiverId, messageId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/message/${receiverId}/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Delete Message Error", error);
      // Use rejectWithValue to properly handle the error in your slice
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
//------ postMessage ------
export const postMessage = createAsyncThunk(
  'Message/post',
  async ({ formData, receiverId }) => {

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/message/sendMessage/${receiverId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${localStorage.getItem("token")}`
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Post Message Error", error);
      throw error;
    }
  }
);

// In your Thunks/MessageThunks.js file:

//------ deleteMessage ------
export const deleteMessage = createAsyncThunk(
  'Message/delete',
  async (messageId) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/message/${messageId}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Delete Message Error", error);
      throw error;
    }
  }
);

//------ updateMessage ------
export const updateMessage = createAsyncThunk(
  'Message/update',
  async ({ messageId, formData }) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/message/${messageId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${localStorage.getItem("token")}`
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Update Message Error", error);
      throw error;
    }
  }
);






