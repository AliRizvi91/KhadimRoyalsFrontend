import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'sonner';

//------ getAllAmenity ------
export const getAllAmenity = createAsyncThunk(
    'Amenity/getAll',
    async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/amenity`);
        
        return response.data;
      } catch (error) {
        console.error("Get All Amenity Error", error);
        throw error;
      }
    }
  );
//------ postAmenity ------
export const postAmenity = createAsyncThunk(
    'Amenity/post',
    async ({ formData }) => {
      
      try {
  
        // Ensure the request is sent with the correct content-type for form data
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/amenity`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // This is important for file uploads
          },
        });
        return response.data;
      } catch (error) {
        console.error("Post Amenity Error", error);
        throw error;
      }
    }
  );
//------ postAmenitylanguage ------
export const postAmenitylanguage = createAsyncThunk(
  'Amenity/language',
  async (amenityNames, { rejectWithValue }) => {
    try {
      // Convert array of names to the format backend expects
      const requestData = amenityNames.map(name => ({
        key: name,
        value: name
      }));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/language/update-languages`,
        { Home: requestData }, // Wrap in Home object as expected by backend
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);


//------ postAmenity ------
export const DeleteAmenity = createAsyncThunk(
    'Amenity/delete',
    async ({_id}) => {
      try {
        
        // Ensure the request is sent with the correct content-type for form data
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/amenity/${_id}`);
        if(response.status===200){
          toast.success('Deleted Amenity Successfully');
        }
        return response.data;
      } catch (error) {
        console.error("Post Amenity Error", error);
        throw error;
      }
    }
  );


  //------ Thunk to update a Amenity ------
  export const updateAmenity = createAsyncThunk(
    '/updateAmenity',
    async ({ Id, formData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/amenity/${Id}`,formData
            );

            return response.data; // Return the updated Amenity data
        } catch (error) {
            console.error('Error Amenity Thunk:', error);
            return rejectWithValue(error.response?.data || 'An error occurred while updating the Amenity.');
        }
    }
);





  