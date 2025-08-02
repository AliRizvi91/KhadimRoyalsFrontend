// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slices/UserSlice';
import galleryReducer from './Slices/GallerySlice'; 
import RoomTypeReducer from './Slices/RoomTypeSlice'; 
import AmenitiesReducer from './Slices/AmenitySlice'; 
import RoomReducer from './Slices/RoomSlice'; 
import RoomTypeDetailsReducer from './Slices/RoomTypeDetailsSlice'; 
import BookReducer from './Slices/BookSlice'; 
import PaymentReducer from './Slices/PaymentSlice';
import MessageReducer from './Slices/MessagesSlice';

export const store = configureStore({
  reducer: {
    StoreOfUser: userReducer,
    StoreOfgallery: galleryReducer,
    StoreOfRoomType: RoomTypeReducer,
    StoreOfAmenities: AmenitiesReducer,
    StoreOfRoom: RoomReducer,
    StoreOfRoomTypeDetails: RoomTypeDetailsReducer,
    StoreOfBook: BookReducer,
    StoreOfPayment: PaymentReducer,
    StoreOfMessage: MessageReducer,
  },
});