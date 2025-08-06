import { io } from 'socket.io-client';

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const initializeSocket = (userId) => {
  if (socket?.connected) {
    return socket;
  }

  if (!userId || !process.env.NEXT_PUBLIC_BACKEND_BASEURL) {
    console.error('Socket initialization failed - missing requirements');
    return null;
  }

  // Clean the backend URL
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASEURL.replace(/\/$/, '');
  
  // Initialize socket with explicit configuration
  socket = io(backendUrl, {
    path: '/api/socket.io',
    query: { userId },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    forceNew: true,
    withCredentials: true,
    autoConnect: true,
    upgrade: true,
    secure: process.env.NODE_ENV === 'production',
    rejectUnauthorized: false
  });

  // Connection events
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    reconnectAttempts = 0;
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error.message);
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const delay = Math.min(5000, 1000 * Math.pow(2, reconnectAttempts));
      setTimeout(() => {
        socket.connect();
        reconnectAttempts++;
      }, delay);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
    if (reason === 'io server disconnect') {
      socket.connect();
    }
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

// Utility function to get socket instance
export const getSocket = () => {
  if (!socket) {
    console.warn('Socket not initialized');
  }
  return socket;
};