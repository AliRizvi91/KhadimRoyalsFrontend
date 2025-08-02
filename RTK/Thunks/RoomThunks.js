import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'sonner';

//------ getAllRoom ------
export const getAllRoom = createAsyncThunk(
    'Room/getAll',
    async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/Room`);
        return response.data;
      } catch (error) {
        console.error("Get All Room Error", error);
        throw error;
      }
    }
  );
//------ postRoom ------
export const postRoom = createAsyncThunk(
    'Room/post',
    async ({ formData }) => {
      
      try {
  
        // Ensure the request is sent with the correct content-type for form data
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/Room`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // This is important for file uploads
          },
        });
        return response.data;
      } catch (error) {
        console.error("Post Room Error", error);
        throw error;
      }
    }
  );


//------ postRoom ------
export const DeleteRoom = createAsyncThunk(
    'Room/delete',
    async ({_id}) => {
      try {
        
        // Ensure the request is sent with the correct content-type for form data
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/Room/${_id}`);
        if(response.status===200){
          toast.success('Deleted Room Successfully');
        }
        return response.data;
      } catch (error) {
        console.error("Post Room Error", error);
        throw error;
      }
    }
  );


  //------ Thunk to update a Room ------
  export const updateRoom = createAsyncThunk(
    '/updateRoom',
    async ({ Id, formData }, { rejectWithValue }) => {
        try {
            

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/Room/${Id}`,formData
            );

            return response.data; // Return the updated Room data
        } catch (error) {
            console.error('Error Room Thunk:', error);
            return rejectWithValue(error.response?.data || 'An error occurred while updating the Room.');
        }
    }
);





  