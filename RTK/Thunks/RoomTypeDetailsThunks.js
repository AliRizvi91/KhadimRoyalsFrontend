import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'sonner';

//------ getAllRoomTypeDetails ------
export const getAllRoomTypeDetails = createAsyncThunk(
    'RoomTypeDetails/getAll',
    async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/roomtypedetails`);
        return response.data;
      } catch (error) {
        console.error("Get All RoomTypeDetails Error", error);
        throw error;
      }
    }
  );
//------ postRoomTypeDetails ------
export const postRoomTypeDetails = createAsyncThunk(
    'RoomTypeDetails/post',
    async ({ formData }) => {
      
      try {
  
        // Ensure the request is sent with the correct content-type for form data
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/roomtypedetails`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // This is important for file uploads
          },
        });
        return response.data;
      } catch (error) {
        console.error("Post RoomTypeDetails Error", error);
        throw error;
      }
    }
  );


//------ postRoomTypeDetails ------
export const DeleteRoomTypeDetails = createAsyncThunk(
    'RoomTypeDetails/delete',
    async ({_id}) => {
      try {
        
        // Ensure the request is sent with the correct content-type for form data
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/roomtypedetails/${_id}`);
        if(response.status===200){
          toast.success('Deleted RoomTypeDetails Successfully');
        }
        return response.data;
      } catch (error) {
        console.error("Post RoomTypeDetails Error", error);
        throw error;
      }
    }
  );


  //------ Thunk to update a RoomTypeDetails ------
  export const updateRoomTypeDetails = createAsyncThunk(
    '/updateRoomTypeDetails',
    async ({ Id, formData }, { rejectWithValue }) => {
        try {
            

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/roomtypedetails/${Id}`,formData
            );

            return response.data; // Return the updated RoomTypeDetails data
        } catch (error) {
            console.error('Error RoomTypeDetails Thunk:', error);
            return rejectWithValue(error.response?.data || 'An error occurred while updating the RoomTypeDetails.');
        }
    }
);





  