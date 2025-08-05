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
export const postAmenityLanguage = createAsyncThunk(
  'amenity/language',
  async (amenityNames, { rejectWithValue }) => {
    try {
      // Validate input
      if (!Array.isArray(amenityNames)) {
        throw new Error('Input must be an array of amenity names');
      }

      // Prepare request data
      const requestData = amenityNames.map(name => ({
        key: name.trim(),
        value: name.trim()
      })).filter(item => item.key); // Filter out empty names

      if (requestData.length === 0) {
        throw new Error('No valid amenity names provided');
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/api/ARZ/language/update-languages`,
        { Home: requestData },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth if needed
          },
          timeout: 30000 // 30 seconds timeout
        }
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        // Backend returned an error response
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data?.error || 'Failed to update translations',
          details: error.response.data?.details
        });
      } else if (error.request) {
        // Request was made but no response received
        return rejectWithValue({
          status: 503,
          message: 'Service unavailable - no response from server'
        });
      } else {
        // Something happened in setting up the request
        return rejectWithValue({
          status: 400,
          message: error.message || 'Failed to process request'
        });
      }
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





  