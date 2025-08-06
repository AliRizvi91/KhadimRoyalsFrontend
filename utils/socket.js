import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (userId) => {
  // Return existing socket if already connected
  if (socket?.connected) {
    return socket;
  }

  // Only initialize if we have a userId and backend URL
  if (!userId || !process.env.NEXT_PUBLIC_BACKEND_BASEURL) {
    console.error('Socket initialization failed - missing userId or backend URL');
    return null;
  }

  // Initialize new socket connection
  socket = io(process.env.NEXT_PUBLIC_BACKEND_BASEURL, {
    withCredentials: true,
    query: { userId },
    path: '/socket.io', // Must match backend path
    transports: ['websocket', 'polling'], // Fallback options
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: true,
    forceNew: true // Important for Vercel deployments
  });

  // Event handlers
  socket.on('connect', () => {
    console.log('Socket connected with ID:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
    // Attempt reconnection
    setTimeout(() => {
      socket.connect();
    }, 5000);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      // Try to reconnect if server disconnects us
      socket.connect();
    }
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn('Socket not initialized - call initializeSocket first');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.off(); // Remove all listeners
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected and cleared');
  }
};

// Optional: Auto-reconnect when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    if (socket && !socket.connected) {
      socket.connect();
    }
  });
}