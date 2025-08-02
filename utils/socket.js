// utils/socket.js
import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (userId) => {
  if (!socket && userId) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_BASEURL || 'http://localhost:4500', {
      withCredentials: true,
      query: { userId }
    });
    
    // Optional: Add error handling
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
  }
  
  return socket;
};


export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected and cleared');
  }
};