import { createSlice } from '@reduxjs/toolkit';
import { getAllAmenity, postAmenity, DeleteAmenity, updateAmenity } from '../Thunks/AmenitiesThunks';

const AmenitySlice = createSlice({
  name: 'amenity',
  initialState: {
    AllAmenities: [],               // Flat array of all amenities
    CategorizedAmenities: {},       // All amenities grouped by category
    CategorizedAmenitiesWithoutLastItem: {}, // All amenities grouped by category excluding last item in each
    TwoAmenitiesPerCategory: {},    // Exactly two amenities from each category
    Modal: false,
    loading: false,
    error: null,
  },
  reducers: {
    ToggleModal: (state, action) => {
      state.Modal = !state.Modal;  // This will toggle the Modal state between true and false
    },
  },
  
  extraReducers: (builder) => {
    builder
      //------- getAllAmenity ------- 
      .addCase(getAllAmenity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAmenity.fulfilled, (state, action) => {
        state.loading = false;
        state.AllAmenities = action.payload;
        
        // Group all amenities by category
        state.CategorizedAmenities = action.payload.reduce((acc, amenity) => {
          const category = amenity.category || 'uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(amenity);
          return acc;
        }, {});
        
        // Create object with amenities per category excluding last item
        state.CategorizedAmenitiesWithoutLastItem = Object.entries(state.CategorizedAmenities).reduce((acc, [category, amenities]) => {
          if (amenities.length > 1) {
            acc[category] = amenities.slice(0, -1); // All items except last one
          } else {
            acc[category] = []; // Empty array if only one item
          }
          return acc;
        }, {});
        
        // Create object with exactly two amenities per category
        state.TwoAmenitiesPerCategory = Object.entries(state.CategorizedAmenities).reduce((acc, [category, amenities]) => {
          acc[category] = amenities.slice(0, 2); // Take first two amenities
          return acc;
        }, {});
      })
      
      //------- postAmenity -------
      .addCase(postAmenity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postAmenity.fulfilled, (state, action) => {
        state.loading = false;
        const newAmenity = action.payload;
        state.AllAmenities.push(newAmenity);
        
        // Update categorized amenities
        const category = newAmenity.category || 'uncategorized';
        if (!state.CategorizedAmenities[category]) {
          state.CategorizedAmenities[category] = [];
        }
        state.CategorizedAmenities[category].push(newAmenity);
        
        // Update categorized amenities without last item
        if (state.CategorizedAmenities[category].length > 1) {
          state.CategorizedAmenitiesWithoutLastItem[category] = 
            state.CategorizedAmenities[category].slice(0, -1);
        } else {
          state.CategorizedAmenitiesWithoutLastItem[category] = [];
        }
        
        // Update two amenities per category if needed
        if (state.CategorizedAmenities[category].length <= 2) {
          state.TwoAmenitiesPerCategory[category] = state.CategorizedAmenities[category].slice(0, 2);
        }
      })
      
      //------- DeleteAmenity -------
      .addCase(DeleteAmenity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DeleteAmenity.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload._id;
        const deletedCategory = action.payload.category || 'uncategorized';
        
        // Update flat array
        state.AllAmenities = state.AllAmenities.filter(
          amenity => amenity._id !== deletedId
        );
        
        // Update categorized amenities
        if (state.CategorizedAmenities[deletedCategory]) {
          state.CategorizedAmenities[deletedCategory] = 
            state.CategorizedAmenities[deletedCategory].filter(
              amenity => amenity._id !== deletedId
            );
          
          // Update categorized amenities without last item
          if (state.CategorizedAmenities[deletedCategory].length > 1) {
            state.CategorizedAmenitiesWithoutLastItem[deletedCategory] = 
              state.CategorizedAmenities[deletedCategory].slice(0, -1);
          } else {
            state.CategorizedAmenitiesWithoutLastItem[deletedCategory] = [];
          }
          
          // Update two amenities per category
          state.TwoAmenitiesPerCategory[deletedCategory] = 
            state.CategorizedAmenities[deletedCategory].slice(0, 2);
          
          // Remove category if empty
          if (state.CategorizedAmenities[deletedCategory].length === 0) {
            delete state.CategorizedAmenities[deletedCategory];
            delete state.CategorizedAmenitiesWithoutLastItem[deletedCategory];
            delete state.TwoAmenitiesPerCategory[deletedCategory];
          }
        }
      })
      
      //------- updateAmenity -------
      .addCase(updateAmenity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAmenity.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAmenity = action.payload;
        const oldAmenity = state.AllAmenities.find(a => a._id === updatedAmenity._id);
        const oldCategory = oldAmenity?.category || 'uncategorized';
        const newCategory = updatedAmenity.category || 'uncategorized';
        
        // Update flat array
        state.AllAmenities = state.AllAmenities.map(amenity =>
          amenity._id === updatedAmenity._id ? updatedAmenity : amenity
        );
        
        // Handle category change if needed
        if (oldCategory !== newCategory) {
          // Remove from old category
          if (state.CategorizedAmenities[oldCategory]) {
            state.CategorizedAmenities[oldCategory] = 
              state.CategorizedAmenities[oldCategory].filter(
                amenity => amenity._id !== updatedAmenity._id
              );
            
            // Update categorized amenities without last item for old category
            if (state.CategorizedAmenities[oldCategory].length > 1) {
              state.CategorizedAmenitiesWithoutLastItem[oldCategory] = 
                state.CategorizedAmenities[oldCategory].slice(0, -1);
            } else {
              state.CategorizedAmenitiesWithoutLastItem[oldCategory] = [];
            }
            
            // Update two amenities for old category
            state.TwoAmenitiesPerCategory[oldCategory] = 
              state.CategorizedAmenities[oldCategory].slice(0, 2);
            
            // Remove old category if empty
            if (state.CategorizedAmenities[oldCategory].length === 0) {
              delete state.CategorizedAmenities[oldCategory];
              delete state.CategorizedAmenitiesWithoutLastItem[oldCategory];
              delete state.TwoAmenitiesPerCategory[oldCategory];
            }
          }
          
          // Add to new category
          if (!state.CategorizedAmenities[newCategory]) {
            state.CategorizedAmenities[newCategory] = [];
          }
          state.CategorizedAmenities[newCategory].push(updatedAmenity);
          
          // Update categorized amenities without last item for new category
          if (state.CategorizedAmenities[newCategory].length > 1) {
            state.CategorizedAmenitiesWithoutLastItem[newCategory] = 
              state.CategorizedAmenities[newCategory].slice(0, -1);
          } else {
            state.CategorizedAmenitiesWithoutLastItem[newCategory] = [];
          }
          
          // Update two amenities for new category
          state.TwoAmenitiesPerCategory[newCategory] = 
            state.CategorizedAmenities[newCategory].slice(0, 2);
        } else {
          // Just update within the same category
          if (state.CategorizedAmenities[newCategory]) {
            state.CategorizedAmenities[newCategory] = 
              state.CategorizedAmenities[newCategory].map(amenity =>
                amenity._id === updatedAmenity._id ? updatedAmenity : amenity
              );
            
            // Update categorized amenities without last item
            if (state.CategorizedAmenities[newCategory].length > 1) {
              state.CategorizedAmenitiesWithoutLastItem[newCategory] = 
                state.CategorizedAmenities[newCategory].slice(0, -1);
            } else {
              state.CategorizedAmenitiesWithoutLastItem[newCategory] = [];
            }
            
            // Update two amenities if the updated one was in the first two
            const indexInFirstTwo = state.TwoAmenitiesPerCategory[newCategory]?.findIndex(
              a => a._id === updatedAmenity._id
            );
            if (indexInFirstTwo !== undefined && indexInFirstTwo !== -1) {
              state.TwoAmenitiesPerCategory[newCategory][indexInFirstTwo] = updatedAmenity;
            }
          }
        }
      })
      
      // Handle rejected cases for all thunks
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export const { ToggleModal } = AmenitySlice.actions;
export default AmenitySlice.reducer;