'use client';

import { motion } from 'framer-motion';

const SidebarIcon = ({ icon: Icon, active }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
        active 
          ? 'bg-blue-500 text-white shadow-lg' 
          : 'text-gray-400 hover:text-white hover:bg-gray-700'
      }`}
    >
      <Icon size={24} />
    </motion.div>
  );
};

export default SidebarIcon;