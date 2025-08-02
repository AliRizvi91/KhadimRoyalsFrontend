import { createSlice } from '@reduxjs/toolkit';
import {getAllRoomTypeDetails, postRoomTypeDetails, DeleteRoomTypeDetails, updateRoomTypeDetails} from '../Thunks/RoomTypeDetailsThunks'

const RoomTypeDetailsSlice = createSlice({
  name: 'RoomTypeDetails',
  initialState: {
    AllData: [],
    currentGallery: [],
    loading: false,
    error: null,
  },
  reducers: {
    filterItemsById: (state, action) => {
      const idToMatch = action.payload;
      state.currentGallery = state.AllData.filter((item) => item.RoomTypeDetails === idToMatch);
    },
    clearcurrentGallery: (state) => {
      state.currentGallery = [];
    }
  },
  extraReducers: (builder) => {
    builder
      //------- getAllRoomTypeDetails------- 
      .addCase(getAllRoomTypeDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRoomTypeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.AllData = action.payload;
        
      })
      .addCase(getAllRoomTypeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // postRoomTypeDetails
      .addCase(postRoomTypeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postRoomTypeDetails.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        state.AllData.push(data);
        
      })
      .addCase(postRoomTypeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // DeleteRoomTypeDetails
      .addCase(DeleteRoomTypeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DeleteRoomTypeDetails.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload._id;
        state.AllData = state.AllData.filter(item => item._id !== deletedId);
        state.currentGallery = state.currentGallery.filter(item => item._id !== deletedId);
      })
      .addCase(DeleteRoomTypeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // updateRoomTypeDetails
      .addCase(updateRoomTypeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoomTypeDetails.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload;
        
        // Update AllData
        state.AllData = state.AllData.map(item =>
          item._id === updatedItem._id ? updatedItem : item
        );
        
        // Update currentGallery if the updated item is there
        state.currentGallery = state.currentGallery.map(item =>
          item._id === updatedItem._id ? updatedItem : item
        );
      })
      .addCase(updateRoomTypeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export const { filterItemsById, clearcurrentGallery } = RoomTypeDetailsSlice.actions;
export default RoomTypeDetailsSlice.reducer;