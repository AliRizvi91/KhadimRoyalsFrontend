import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'sonner';

//------ getAllBook ------
export const getAllBook = createAsyncThunk(
  'Book/getAll',
  async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/booking`);
      return response.data;
    } catch (error) {
      console.error("Get All Book Error", error);
      throw error;
    }
  }
);

//------ postBook ------
export const postBook = createAsyncThunk(
  'Book/post',
  async (bookingData) => {  
    try {
      console.log('Sending booking data:', bookingData); // Log the data being sent
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/booking`,
        bookingData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Post Book Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
      throw error;
    }
  }
);


//------ deleteBook ------
export const deleteBook = createAsyncThunk(
  'Book/delete',
  async (bookingId) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/booking/${bookingId}`);
      if (response.status === 200) {
        toast.success('Deleted Book Successfully');
      }
      return bookingId; // Return the ID instead of response.data
    } catch (error) {
      console.error("Delete Book Error", error);
      throw error;
    }
  }
);

//------ updateBook ------
export const updateBook = createAsyncThunk(
  '/updateBook',
  async ({ Id, bookingData }, { rejectWithValue }) => {  // Changed formData to bookingData
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/booking/${Id}`,
        bookingData,  // Send the booking object directly
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error Book Thunk:', error);
      return rejectWithValue(error.response?.data || 'An error occurred while updating the Book.');
    }
  }
);
//------ updateBookingsOfArray ------
export const updateBookingsOfArray = createAsyncThunk(
  '/updateBookingsOfArray',
  async ({ Data }, { rejectWithValue }) => {  // Changed formData to bookingData
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/booking`,
        Data,  // Send the booking object directly
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error Book Thunk:', error);
      return rejectWithValue(error.response?.data || 'An error occurred while updating the Book.');
    }
  }
);