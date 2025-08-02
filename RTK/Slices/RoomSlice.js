import { createSlice } from '@reduxjs/toolkit';
import { getAllRoom, postRoom, DeleteRoom, updateRoom } from '../Thunks/RoomThunks';

const RoomSlice = createSlice({
  name: 'Room',
  initialState: {
    getAllTheRoom: [],
    CarouselState: {},
    Dates: [],
    startDate: null,  
    endDate: null,    
    loading: false,
    error: null,
  },
  reducers: {
    GetCarouselItem: (state, action) => {
      state.CarouselState = action.payload;
    },
GetDates: (state, action) => {
  state.Dates = action.payload;
  // Convert to Date objects if they aren't already
  const datesArray = action.payload.map(date => 
    date instanceof Date ? date : new Date(date)
  );
  
  // Set startDate and endDate
  state.startDate = datesArray.length > 0 
    ? datesArray[0].toLocaleDateString() 
    : null;
  state.endDate = datesArray.length > 0 
    ? datesArray[datesArray.length - 1].toLocaleDateString() 
    : null;
},
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllRoom.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.getAllTheRoom = action.payload;
      })
      .addCase(getAllRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(postRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postRoom.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        state.getAllTheRoom.push(data);
      })
      .addCase(postRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(DeleteRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DeleteRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.getAllTheRoom = state.getAllTheRoom.filter((Photo) => Photo._id !== action.payload._id);
      })
      .addCase(DeleteRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.getAllTheRoom = state.getAllTheRoom.map(Photo =>
          Photo._id === action.payload._id ? action.payload : Photo
        );
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { GetCarouselItem, GetDates } = RoomSlice.actions;
export default RoomSlice.reducer;