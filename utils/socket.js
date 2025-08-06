import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (userId) => {
  if (socket?.connected) return socket;

  if (!userId || !process.env.NEXT_PUBLIC_BACKEND_BASEURL) {
    console.error('Socket initialization failed - missing userId or backend URL');
    return null;
  }

  // Ensure the backend URL doesn't have a trailing slash
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASEURL.replace(/\/$/, '');

  socket = io(backendUrl, {
    withCredentials: true,
    query: { userId },
    path: '/socket.io', // Must match backend path (no trailing slash)
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    autoConnect: true,
    forceNew: true,
    upgrade: true,
    secure: true,
    rejectUnauthorized: false // Only for development if using self-signed certs
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