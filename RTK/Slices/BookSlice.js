import { createSlice } from '@reduxjs/toolkit';
import { getAllBook, postBook, deleteBook, updateBook } from '../Thunks/Bookthunks';

const initialState = {
  allBookings: [],
  currentCarouselBookings: [],
  currentUserBookings: [],
  currentUserBookingsTotalAmount: 0,
  ClassicBookedDates: [],
  MiniBookedDates: [], // New state for bookings without roomId
  loading: false,
  error: null,
};

const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (currentDate <= end) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCarouselBookings: (state, action) => {
      const roomId = action.payload;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      state.currentCarouselBookings = state.allBookings.filter(
        booking => booking.roomId?._id === roomId && new Date(booking.endDate) >= today
      );
      
      state.ClassicBookedDates = state.currentCarouselBookings.flatMap(booking => 
        getDatesInRange(booking.startDate, booking.endDate)
      );
    },
    
    setUserBookings: (state, action) => {            
      const userId = action.payload;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      state.currentUserBookings = state.allBookings.filter(
        booking => booking.userId?._id === userId && booking.status === 'pending'
      );
      
      state.currentUserBookingsTotalAmount = state.currentUserBookings.reduce(
        (total, booking) => total + (booking.totalAmount || 0), 
        0
      );
    },
    
    // New reducer to set MiniBookedDates for bookings without roomId
    setMiniBookedDates: (state) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Filter bookings without roomId and that are still active (endDate >= today)
      const miniBookings = state.allBookings.filter(
        booking => !booking.roomId && new Date(booking.endDate) >= today
      );
      
      // Get all dates from these bookings
      state.MiniBookedDates = miniBookings.flatMap(booking => 
        getDatesInRange(booking.startDate, booking.endDate)
      );
    },
    
    clearBookingState: (state) => {
      state.currentCarouselBookings = [];
      state.ClassicBookedDates = [];
      state.currentUserBookings = [];
      state.currentUserBookingsTotalAmount = 0;
      state.MiniBookedDates = []; // Clear MiniBookedDates as well
    }
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };
    
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.error.message;
    };
    
    builder
      .addCase(getAllBook.pending, handlePending)
      .addCase(getAllBook.fulfilled, (state, action) => {
        state.loading = false;
        state.allBookings = action.payload;
      })
      .addCase(getAllBook.rejected, handleRejected)
      
      .addCase(postBook.pending, handlePending)
      .addCase(postBook.fulfilled, (state, action) => {
        state.loading = false;
        state.allBookings.unshift(action.payload);
        
        if (state.currentUserBookings.length > 0 && 
            action.payload.userId?._id === state.currentUserBookings[0].userId?._id &&
            action.payload.status === 'pending') {
          state.currentUserBookings.unshift(action.payload);
          state.currentUserBookingsTotalAmount += action.payload.totalAmount || 0;
        }
        
        // Update MiniBookedDates if the new booking doesn't have a roomId
        if (!action.payload.roomId) {
          const newDates = getDatesInRange(action.payload.startDate, action.payload.endDate);
          state.MiniBookedDates = [...state.MiniBookedDates, ...newDates];
        }
      })
      .addCase(postBook.rejected, handleRejected)
      
      .addCase(deleteBook.pending, handlePending)
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        const deletedBooking = state.allBookings.find(booking => booking._id === deletedId);
        
        state.allBookings = state.allBookings.filter(booking => booking._id !== deletedId);
        state.currentCarouselBookings = state.currentCarouselBookings.filter(
          booking => booking._id !== deletedId
        );
        
        if (state.currentUserBookings.some(booking => booking._id === deletedId)) {
          state.currentUserBookings = state.currentUserBookings.filter(
            booking => booking._id !== deletedId
          );
          if (deletedBooking) {
            state.currentUserBookingsTotalAmount -= deletedBooking.totalAmount || 0;
          }
        }
        
        // Update MiniBookedDates if the deleted booking didn't have a roomId
        if (deletedBooking && !deletedBooking.roomId) {
          const deletedDates = getDatesInRange(deletedBooking.startDate, deletedBooking.endDate);
          state.MiniBookedDates = state.MiniBookedDates.filter(
            date => !deletedDates.includes(date)
          );
        }
        
        state.ClassicBookedDates = state.currentCarouselBookings.flatMap(booking => 
          getDatesInRange(booking.startDate, booking.endDate)
        );
      })
      .addCase(deleteBook.rejected, handleRejected)
      
      .addCase(updateBook.pending, handlePending)
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBooking = action.payload;
        const oldBooking = state.allBookings.find(booking => booking._id === updatedBooking._id);
        const amountDifference = (updatedBooking.totalAmount || 0) - (oldBooking?.totalAmount || 0);
        
        const updateArray = (arr) => arr.map(item => 
          item._id === updatedBooking._id ? updatedBooking : item
        );
        
        state.allBookings = updateArray(state.allBookings);
        state.currentCarouselBookings = updateArray(state.currentCarouselBookings);
        
        if (state.currentUserBookings.some(booking => booking._id === updatedBooking._id)) {
          if (updatedBooking.status === 'pending') {
            state.currentUserBookings = updateArray(state.currentUserBookings);
            state.currentUserBookingsTotalAmount += amountDifference;
          } else {
            state.currentUserBookings = state.currentUserBookings.filter(
              booking => booking._id !== updatedBooking._id
            );
            state.currentUserBookingsTotalAmount -= oldBooking?.totalAmount || 0;
          }
        } else if (updatedBooking.status === 'pending' && 
                  state.currentUserBookings[0]?.userId?._id === updatedBooking.userId?._id) {
          state.currentUserBookings.unshift(updatedBooking);
          state.currentUserBookingsTotalAmount += updatedBooking.totalAmount || 0;
        }
        
        // Handle MiniBookedDates updates
        if (!updatedBooking.roomId) {
          // If the booking didn't have roomId before and still doesn't
          if (!oldBooking?.roomId) {
            // Remove old dates and add new ones
            const oldDates = getDatesInRange(oldBooking.startDate, oldBooking.endDate);
            const newDates = getDatesInRange(updatedBooking.startDate, updatedBooking.endDate);
            
            state.MiniBookedDates = state.MiniBookedDates
              .filter(date => !oldDates.includes(date))
              .concat(newDates);
          } else {
            // If the booking now doesn't have roomId (was added)
            const newDates = getDatesInRange(updatedBooking.startDate, updatedBooking.endDate);
            state.MiniBookedDates = [...state.MiniBookedDates, ...newDates];
          }
        } else if (oldBooking && !oldBooking.roomId) {
          // If the booking had no roomId before but now does (was removed)
          const oldDates = getDatesInRange(oldBooking.startDate, oldBooking.endDate);
          state.MiniBookedDates = state.MiniBookedDates.filter(
            date => !oldDates.includes(date)
          );
        }
        
        state.ClassicBookedDates = state.currentCarouselBookings.flatMap(booking => 
          getDatesInRange(booking.startDate, booking.endDate)
        );
      })
      .addCase(updateBook.rejected, handleRejected);
  },
});

export const { 
  setCarouselBookings, 
  setUserBookings, 
  setMiniBookedDates, // Export the new action
  clearBookingState 
} = bookingSlice.actions;
export default bookingSlice.reducer;