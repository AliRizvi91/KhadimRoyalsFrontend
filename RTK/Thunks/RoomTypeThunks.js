import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'sonner';

//------ getAllRoomType ------
export const getAllRoomType = createAsyncThunk(
    'RoomType/getAll',
    async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/roomtype`);
        return response.data;
      } catch (error) {
        console.error("Get All RoomType Error", error);
        throw error;
      }
    }
  );
//------ postRoomType ------
export const postRoomType = createAsyncThunk(
    'RoomType/post',
    async ({ formData }) => {
      
      try {
  
        // Ensure the request is sent with the correct content-type for form data
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/roomtype`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // This is important for file uploads
          },
        });
        return response.data;
      } catch (error) {
        console.error("Post RoomType Error", error);
        throw error;
      }
    }
  );


//------ postRoomType ------
export const DeleteRoomType = createAsyncThunk(
    'RoomType/delete',
    async ({_id}) => {
      try {
        
        // Ensure the request is sent with the correct content-type for form data
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/roomtype/${_id}`);
        if(response.status===200){
          toast.success('Deleted RoomType Successfully');
        }
        return response.data;
      } catch (error) {
        console.error("Post RoomType Error", error);
        throw error;
      }
    }
  );


  //------ Thunk to update a RoomType ------
  export const updateRoomType = createAsyncThunk(
    '/updateRoomType',
    async ({ Id, formData }, { rejectWithValue }) => {
        try {
            

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/roomtype/${Id}`,formData
            );

            return response.data; // Return the updated RoomType data
        } catch (error) {
            console.error('Error RoomType Thunk:', error);
            return rejectWithValue(error.response?.data || 'An error occurred while updating the RoomType.');
        }
    }
);





  