import { createSlice } from '@reduxjs/toolkit';
import {getAllGallery,postGallery,DeleteGallery,updateGallery} from '../Thunks/GalleryThunks'

const GallerySlice = createSlice({
  name: 'gallery',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    //------- getAllGallery------- 
      .addCase(getAllGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getAllGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // postGallery
      .addCase(postGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postGallery.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload
        state.items.push(data);
      })
      .addCase(postGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // DeleteGallery
      .addCase(DeleteGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DeleteGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((Photo)=> Photo._id !== action.payload._id)
      })
      .addCase(DeleteGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // updateGallery
      
      .addCase(updateGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map(Photo =>
          Photo._id === action.payload._id ? action.payload : Photo
        );
      })
      .addCase(updateGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export default GallerySlice.reducer;