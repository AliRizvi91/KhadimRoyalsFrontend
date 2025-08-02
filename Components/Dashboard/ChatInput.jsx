// Components/Dashboard/ChatInput.js
'use client';
import { motion } from 'framer-motion';
import { FiPaperclip, FiSmile } from 'react-icons/fi';
import { BiSend } from 'react-icons/bi';
import EmojiPicker from 'emoji-picker-react';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { postMessage } from '@/RTK/Thunks/MessageThunks';
import { getSocket } from '@/utils/socket';

const ChatInput = ({ receiverId, socket }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSend = async () => {
    // Don't send if there's nothing to send or no receiver/socket
    if ((!message.trim() && !selectedFile) || !receiverId || !socket) return;

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
        receiverId
      })).unwrap();

      // Emit socket event for real-time update only after successful post
      socket.emit('send-message', {
        receiverId,
        text: message,
        image: selectedFile ? result.image : null,
        // Include any other necessary fields like timestamp, sender info, etc.
      });

      // Reset form
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

  const handleEmojiSelect = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="border-t px-3 py-6 relative bg-black"
    >
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-10 z-10">
          <EmojiPicker
            onEmojiClick={handleEmojiSelect}
            width={300}
            height={350}
          />
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
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
      
      <motion.div className="flex items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mr-2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <FiSmile size={25} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mr-2 text-gray-500 hover:text-gray-700"
          onClick={handleFileSelect}
        >
          <FiPaperclip size={25} />
        </motion.button>
        
        <motion.div className="flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full border rounded-full py-2 px-4 focus:outline-none manrope text-[17px] bg-gray-500 hover:bg-white hover:text-black focus:text-black focus:bg-white"
          />
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={(!message.trim() && !selectedFile) || !receiverId}
          className={`ml-2 p-2 rounded-full transition-all duration-200 ${
            (message.trim() || selectedFile) && receiverId
              ? 'bg-[#a36338] text-white hover:bg-[#a36338d5] cursor-pointer' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <BiSend size={18} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ChatInput;