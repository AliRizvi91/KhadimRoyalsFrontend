import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiSend, FiPaperclip, FiSmile, FiX } from 'react-icons/fi';
import { BiSend } from "react-icons/bi";
import EmojiPicker from 'emoji-picker-react';
import AdminChatMessage from './AdminChatMessage';
import ClientChatMessage from './ClientChatMessage';
import { useDispatch, useSelector } from 'react-redux';
import { getmessage, postMessage } from '@/RTK/Thunks/MessageThunks';
import { initializeSocket, disconnectSocket } from '@/utils/socket';

function ChatClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isMouseInChat, setIsMouseInChat] = useState(false);
  const [Socket, setSocket] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  const { user } = useSelector((state) => state.StoreOfUser);
  const { Messages } = useSelector((state) => state.StoreOfMessage);
  const dispatch = useDispatch();
  
  // Admin ID should be configured properly
  const adminId = '6870a0fbcf4c4e535ce2d4df';
  const selectedUser = adminId;

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleEmojiSelect = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
      }
    };
    fileInput.click();
  };

  const handleSend = async () => {
    if ((!message.trim() && !selectedFile) || !selectedUser || !Socket) return;

    const formData = new FormData();
    
    if (message.trim()) {
      formData.append('text', message);
    }
    
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      const result = await dispatch(postMessage({
        formData,
        receiverId: selectedUser
      })).unwrap();

      Socket.emit('send-message', {
        receiverId: selectedUser,
        text: message,
        image: selectedFile ? result.image : null,
      });

      setMessage('');
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
      socket.on('recieve-message', handleReceiveMessage);
      socket.on('update-unread-counts', handleUnreadCounts);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('connect_error', handleConnectError);
        socket.off('recieve-message', handleReceiveMessage);
        socket.off('update-unread-counts', handleUnreadCounts);
        disconnectSocket();
      };
    } catch (error) {
      console.error('Socket initialization error:', error);
      if (socket) disconnectSocket();
    }
  }, [user?._id, dispatch, selectedUser]);

  useEffect(() => {
    if (!selectedUser || !Socket || !user?._id) return;

    if(isOpen){
      Socket.emit('mark-as-read', {
        senderId: selectedUser,
        receiverId: user._id
      });
  
      setUnreadCounts(prev => {
        const newCounts = {...prev};
        delete newCounts[selectedUser];
        return newCounts;
      });
    }

  }, [selectedUser, user?._id, Socket,isOpen]);

    // Add this new effect for custom scroll handling
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleWheel = (e) => {
      if (isMouseInChat) {
        e.preventDefault();
        chatContainer.scrollBy({
          top: e.deltaY * 0.5, // Adjust scroll speed with multiplier
          behavior: 'smooth'
        });
      }
    };

    chatContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      chatContainer.removeEventListener('wheel', handleWheel);
    };
  }, [isMouseInChat]);

  return (
    <div className="relative z-50">
      <AnimatePresence>
        {/* Chat icon button - keep this part the same */}
        <motion.div 
          className="relative h-40 w-20 flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#6b6b6b] to-black cursor-pointer"
          key="chat-icon"
          initial={{ y: 0, scale: 1, opacity: 1 }}
          animate={isOpen ? { y: 200, opacity: 0 } : { y: 0, opacity: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100, duration: 0.2 }}
          onClick={toggleChat}
        >
          <Image
            src="/assets/Images/ChatIcon.png"
            alt="ChatIcon"
            width={70}
            height={140}
            className="object-cover"
          />
          {unreadCounts[selectedUser] > 0 && (
            <div className="absolute top-1 left-1 bg-red-500 shadow-2xl shadow-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs manrope font-extrabold">
              {unreadCounts[selectedUser]}
            </div>
          )}
        </motion.div>

        {/* Chat box */}
        {isOpen && (
          <motion.div
            key="chat-box"
            initial={{ y: 1100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 1100, opacity: 0 }}
            transition={{type: 'spring', damping: 15, stiffness: 106, duration: 0.2,bounce:1.2  }}
            className="bg-gradient-to-br from-[#4d4d4d] to-black rounded-lg shadow-xl absolute top-[-16rem] right-0 overflow-hidden"
            style={{ height: '27rem', width: '20rem' }}
            onMouseEnter={() => setIsMouseInChat(true)}
            onMouseLeave={() => setIsMouseInChat(false)}
          >
            {/* Chat header - keep this the same */}
            <div className="bg-gradient-to-br from-[#cc9774] to-[#996f53] text-white p-3 flex justify-between items-center">
              <p className="uppercase manrope text-2xl font-extrabold">
                Khadim<span className='text-[10px]'>Royals</span>.
              </p>
              <button onClick={toggleChat} className="focus:outline-none cursor-pointer">
                <FiX size={20} />
              </button>
            </div>

            {/* Modified Chat messages area */}
            <div
              ref={chatContainerRef}
              className="h-[19rem] p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#996f53] scrollbar-track-transparent"
              style={{
                scrollBehavior: 'smooth',
                overscrollBehavior: 'contain'
              }}
            >
              {Messages?.map((msg, index) => (
                msg.senderId === user?._id ? (
                  <ClientChatMessage
                    key={index}
                    message={msg.text}
                    time={new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    imageUrl={msg.image}
                    MesseageBoxSize='max-w-[320px]'
                    senderName={user?.firstName}
                    recieverId={selectedUser}
                    messageId={msg?._id}
                  />
                ) : (
                  <AdminChatMessage
                    key={index}
                    message={msg.text}
                    time={new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    imageUrl={msg.image}
                    senderName="Khadim Royals"
                    MesseageBoxSize='max-w-[320px]'
                    recieverId={selectedUser}
                    messageId={msg?._id}
                  />
                )
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat input area */}
            <div className="border-t p-3 relative bg-black">
              {showEmojiPicker && (
                <div className="absolute bottom-16 right-0 z-10">
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelect}
                    width={300}
                    height={350}
                  />
                </div>
              )}
              
              {selectedFile && (
                <div className="text-white mb-2 text-sm">
                  Selected: {selectedFile.name}
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="ml-2 text-red-400"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <div className="flex items-center">
                <button
                  className="mr-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <FiSmile size={20} />
                </button>
                <button 
                  className="mr-2 text-gray-500 hover:text-gray-700"
                  onClick={handleFileSelect}
                >
                  <FiPaperclip size={20} />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-full py-2 px-4 focus:outline-none manrope text-[13px] bg-gray-500 hover:bg-white hover:text-black focus:text-black focus:bg-white"
                />
                <button 
                  onClick={handleSend}
                  disabled={(!message.trim() && !selectedFile) || !selectedUser}
                  className={`ml-2 p-2 rounded-full transition-all ${
                    (message.trim() || selectedFile) && selectedUser
                      ? 'bg-[#a36338] text-white hover:bg-[#a36338d5] cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <BiSend size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatClient;