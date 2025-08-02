'use client';

import { motion } from 'framer-motion';
import { FiPhone, FiVideo } from 'react-icons/fi';
import { MdOutlineDeleteSweep } from "react-icons/md";
import { DeleteAllMessages } from '@/RTK/Thunks/MessageThunks';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

const ChatHeader = ({ user }) => {
  const dispatch = useDispatch();
  
const handleDeleteAllMessages = async () => {
  const isConfirmed = window.confirm(
    `Are you sure you want to delete all messages with ${user?.firstName}? This action cannot be undone.`
  );
  
  if (!isConfirmed) return;
  
  const toastId = toast.loading('Deleting messages...');
  
  try {
    const resultAction = await dispatch(DeleteAllMessages({ receiverId: user?._id }));
    
    if (DeleteAllMessages.fulfilled.match(resultAction)) {
      toast.success('All messages deleted successfully', {
        id: toastId,
        duration: 3000,
      });
    } else {
      throw new Error(resultAction.error.message || 'Failed to delete messages');
    }
  } catch (error) {
    toast.error(error.message, {
      id: toastId,
      duration: 3000,
    });
    console.error('Error deleting messages:', error);
  }
};

  return (
    <div className="manrope h-16 flex items-center justify-between px-4 lg:px-6 bg-gradient-to-br from-[#cc9774] to-[#996f53] text-white">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-extrabold">
          {user?.firstName.charAt(0)}
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold truncate">{user?.firstName}</h2>
        </div>
      </div>
      <div className="flex items-center space-x-2 lg:space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          onClick={handleDeleteAllMessages}
          aria-label="Delete all messages"
        >
          <MdOutlineDeleteSweep size={18} className="lg:w-7 lg:h-7 fill-white cursor-pointer" />
        </motion.button>
      </div>
    </div>
  );
};

export default ChatHeader;