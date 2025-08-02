// paymentSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { createPaymentIntent } from '../Thunks/PaymentThunks';

const initialState = {
  clientSecret: null,
  paymentIntentID: null,
  paymentId: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.clientSecret = null;
      state.paymentIntentID = null;
      state.paymentId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Payment Intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const SecretData = action.payload.clientSecret
        const paymentIntentID = action.payload.paymentIntent
        state.clientSecret = SecretData;
        state.paymentIntentID = paymentIntentID;
        state.paymentId = action.payload.paymentId;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;