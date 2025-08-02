// Components/Dashboard/ChatPage.js
'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '@/Components/Dashboard/Sidebar';
import UserList from '@/Components/Dashboard/UserList';
import ChatHeader from '@/Components/Dashboard/ChatHeader';
import MessageList from '@/Components/Dashboard/MessageList';
import ChatInput from '@/Components/Dashboard/ChatInput';
import { getAllUsers } from '@/RTK/Thunks/UserThunks';
import { getmessage } from '@/RTK/Thunks/MessageThunks';
import { initializeSocket, disconnectSocket } from '@/utils/socket';

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [OnlineUsers, setOnlineUsers] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const [Socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});

  const { AllUsers, user } = useSelector((state) => state.StoreOfUser);
  const { Messages } = useSelector((state) => state.StoreOfMessage);
  const dispatch = useDispatch();
  const currentClient = AllUsers.filter((user) => user._id === selectedUser);
  const withoutCurrentUserAllUsers = AllUsers.filter((item) => item._id !== user?._id);

  // Memoized scroll function
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser !== '') {
      dispatch(getmessage({
        recieverId: selectedUser
      }));
    }
  }, [dispatch, selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [Messages, scrollToBottom]);

  // Socket effect with proper cleanup
  useEffect(() => {
    if (!user?._id) return;

    let socket;
    try {
      socket = initializeSocket(user._id);
      if (!socket) {
        console.error('Socket connection failed');
        return;
      }

      setSocket(socket);

      const handleConnect = () => {
        console.log('Socket connected:', socket.id);
      };

      const handleConnectError = (err) => {
        console.error('Socket connection error:', err);
      };

      const handleOnlineUsers = (onlineUserIds) => {
        console.log('Online user IDs:', onlineUserIds);
        setOnlineUsers(onlineUserIds);
      };

      const handleReceiveMessage = (message) => {
        console.log('Received message:', message);
        if (message.senderId === selectedUser) {
          dispatch(getmessage({ recieverId: selectedUser }));
        }
      };

      const handleUnreadCounts = (counts) => {
        setUnreadCounts(prev => {
          const filteredCounts = {};
          Object.entries(counts).forEach(([senderId, count]) => {
            if (senderId && count > 0) {
              filteredCounts[senderId] = count;
            }
          });
          return filteredCounts;
        });
      };

      socket.on('connect', handleConnect);
      socket.on('connect_error', handleConnectError);
      socket.on('getOnlineUsers', handleOnlineUsers);
      socket.on('recieve-message', handleReceiveMessage);
      socket.on('update-unread-counts', handleUnreadCounts);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('connect_error', handleConnectError);
        socket.off('getOnlineUsers', handleOnlineUsers);
        socket.off('recieve-message', handleReceiveMessage);
        socket.off('update-unread-counts', handleUnreadCounts);
        disconnectSocket();
      };
    } catch (error) {
      console.error('Socket initialization error:', error);
      if (socket) disconnectSocket();
    }
  }, [user?._id, dispatch, selectedUser]);

  // Mark messages as read effect
  useEffect(() => {
    if (!selectedUser || !Socket || !user?._id) return;

    Socket.emit('mark-as-read', {
      senderId: selectedUser,
      receiverId: user._id
    });

    setUnreadCounts(prev => {
      const newCounts = {...prev};
      delete newCounts[selectedUser];
      return newCounts;
    });
  }, [selectedUser, user?._id, Socket]);

  // Mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-screen relative manrope" style={{ backgroundColor: '#E8E4D9', color: '#0f1210' }}>
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </motion.button>

      <Sidebar />

      <UserList
        users={withoutCurrentUserAllUsers}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isMobile={isMobile}
        onlineUserIds={OnlineUsers}
        unreadCounts={unreadCounts}
      />

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          />
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 flex flex-col min-w-0"
        style={{ backgroundColor: '#E8E4D9' }}
      >
        <ChatHeader user={currentClient[0]} />

        <MessageList
          messages={Messages}
          messagesEndRef={messagesEndRef}
          user={user}
          selectedUserName={currentClient[0]?.firstName}
          isTyping={isTyping}
        />

        <ChatInput
          receiverId={selectedUser}
          socket={Socket}
        />
      </motion.div>
    </div>
  );
};

export default ChatPage;