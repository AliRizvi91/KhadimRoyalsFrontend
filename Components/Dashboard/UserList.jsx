'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import UserListItem from './UserListItem';
import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

const UserList = ({ 
  users = [],
  selectedUser, 
  setSelectedUser, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  isMobile,
  onlineUserIds, // Now expecting an array of online user IDs,
  unreadCounts
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!Array.isArray(users)) {
      setFilteredUsers([]);
      return;
    }

    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
      setIsSearching(false);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user => {
        return user?.firstName?.toLowerCase().includes(query) || 
               user?.name?.toLowerCase().includes(query);
      });
      setFilteredUsers(filtered);
      setIsSearching(true);
    }
  }, [users, searchQuery]);

  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const item = {
    hidden: { 
      x: -50, 
      opacity: 0,
      transition: { type: 'spring', stiffness: 100 }
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 8,
        mass: 0.5,
      }
    }
  };

  return (
    <AnimatePresence>
      {(!isMobile || isMobileMenuOpen) && (
        <motion.div 
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
          className={`${
            isMobileMenuOpen 
              ? 'fixed inset-y-0 left-0 z-40 w-80' 
              : 'relative w-80'
          } lg:relative lg:w-80 border-r border-gray-300 flex flex-col shadow-lg lg:shadow-none`}
          style={{ backgroundColor: '#E8E4D9' }}
        >
          <div className="p-4 bg-[#ffe2ba] shadow-2xl shadow-black">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} />
              <input
                type="text"
                placeholder="Search by first name..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border-none outline-none focus:outline-none bg-black text-white"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <motion.div 
            className="flex-1 overflow-y-auto bg-gradient-to-br from-[#ffe2ba] to-[#E8E4D9]"
            variants={container}
            initial="hidden"
            animate={isMounted ? "visible" : "hidden"}
          >
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <motion.div
                  key={user?._id}
                  variants={item}
                  custom={index}
                >
                  <UserListItem 
                    user={user}
                    index={index}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    onlineUserIds={onlineUserIds}  // Pass the array of online user IDs
                    unreadCounts={unreadCounts}
                  />
                </motion.div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                {isSearching ? 'No users found' : 'No users available'}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserList;