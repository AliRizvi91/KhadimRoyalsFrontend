import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'sonner';
// Components
import convertToSubcurrency from "@/Components/Checkout/ConvertToSubcurrency";



// Async Thunks
export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async (amount, { rejectWithValue }) => {
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/payment/create-payment-intent`, {
        amount: convertToSubcurrency(amount)
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const PostPayment = createAsyncThunk(
  'payment/postPayment',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/payment`,
        data,  // Send data directly without wrapping in another object
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      // Improved error handling
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message
      );
    }
  }
);