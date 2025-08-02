import { createSlice } from '@reduxjs/toolkit';
import { getmessage, postMessage, DeleteAllMessages, DeleteMessage } from '../Thunks/MessageThunks';

const MessageSlice = createSlice({
  name: 'Message',
  initialState: {
    Messages: [],
    loading: false,
    error: null,
    deleteLoading: false, // Separate loading state for delete operations
  },
  reducers: {
    addNewMessage: (state, action) => {
      state.Messages.unshift(action.payload); // Add new message at beginning
    },
    clearMessages: (state) => {
      state.Messages = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      //------- Get Messages ------- 
      .addCase(getmessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getmessage.fulfilled, (state, action) => {
        state.loading = false;
        state.Messages = action.payload;
      })
      .addCase(getmessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      
      //------- Post Message -------
      .addCase(postMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.Messages.unshift(action.payload); // Add new message at beginning
      })
      .addCase(postMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      
      //------- Delete All Messages -------
      .addCase(DeleteAllMessages.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(DeleteAllMessages.fulfilled, (state) => {
        state.deleteLoading = false;
        state.Messages = [];
      })
      .addCase(DeleteAllMessages.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || action.error.message;
      })
      
      //------- Delete Single Message -------
      .addCase(DeleteMessage.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(DeleteMessage.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.Messages = state.Messages.filter(
          message => message._id !== action.payload.deletedMessageId
        );
      })
      .addCase(DeleteMessage.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { addNewMessage, clearMessages } = MessageSlice.actions;
export default MessageSlice.reducer;