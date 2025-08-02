'use client';

import { motion } from 'framer-motion';

const UserListItem = ({ 
  user, 
  index, 
  selectedUser, 
  setSelectedUser, 
  setIsMobileMenuOpen, 
  onlineUserIds,
  unreadCounts
}) => {
  const isOnline = onlineUserIds.includes(user?._id);
  const unreadCount = unreadCounts[user?._id] || 0;
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 2, type: 'tween', stiffness: '70', damping: '20' }}
      whileHover={{ 
        backgroundColor: selectedUser === index ? '' : '#cc97748e' 
      }}
      whileTap={{ scale: 0.96 }}
      onClick={() => {
        setSelectedUser(user?._id);
        setIsMobileMenuOpen(false);
      }}
      className={`p-4 cursor-pointer focus:bg-black transition-all duration-200 ${
        selectedUser === user?._id ? 'bg-gradient-to-br from-[#111111] to-[#3d3d3d] text-white' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-[#cc9774] to-[#996f53] rounded-full flex items-center justify-center text-white font-semibold">
            {user.firstName.charAt(0)}
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
    {unreadCount > 0 && selectedUser !== user?._id &&  (
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">
        {unreadCount > 9 ? '9+' : unreadCount}
      </div>
    )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold truncate">{user.firstName}</h3>
          </div>
          <p className={`text-sm ${selectedUser === user?._id ? 'text-gray-200' : 'text-gray-500'} truncate mt-1`}>
            {user.email}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default UserListItem;