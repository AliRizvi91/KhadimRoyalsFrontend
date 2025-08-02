import { createSlice } from '@reduxjs/toolkit';
import {getAllRoomType,postRoomType,DeleteRoomType,updateRoomType} from '../Thunks/RoomTypeThunks'

const RoomTypeSlice = createSlice({
  name: 'RoomType',
  initialState: {
    items: [],
    getAllType:[],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    //------- getAllRoomType------- 
      .addCase(getAllRoomType.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRoomType.fulfilled, (state, action) => {
        state.loading = false;
        state.getAllType = action.payload;
      })
      .addCase(getAllRoomType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // postRoomType
      .addCase(postRoomType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postRoomType.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload
        state.items.push(data);
      })
      .addCase(postRoomType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // DeleteRoomType
      .addCase(DeleteRoomType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DeleteRoomType.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((Photo)=> Photo._id !== action.payload._id)
      })
      .addCase(DeleteRoomType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // updateRoomType
      
      .addCase(updateRoomType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoomType.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map(Photo =>
          Photo._id === action.payload._id ? action.payload : Photo
        );
      })
      .addCase(updateRoomType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export default RoomTypeSlice.reducer;