'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BsChatDots, BsThreeDotsVertical } from 'react-icons/bs';
import { FiUsers, FiSettings } from 'react-icons/fi';
import { IoMdNotifications } from 'react-icons/io';
import SidebarIcon from './SidebarIcon';


const Sidebar = () => {
  const sidebarIcons = [
    { icon: BsChatDots, active: true },
    { icon: FiUsers, active: false },
    { icon: IoMdNotifications, active: false },
    { icon: FiSettings, active: false }
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:flex w-20 flex-col items-center justify-between py-8 space-y-6 melodrama shadow-2xl shadow-black"
      style={{ backgroundColor: '#0f1210' }}
    >
      <div className="relative w-[1px] h-[80%] bg-white"/>

      {/* User Avatar at bottom */}
      <div className="transform rotate-90 relative my-20 ">
        <Link
          href="/"
          className="uppercase manrope sm:text-3xl text-2xl font-extrabold text-white relative -left-3"
        >
          Khadim<span className='sm:text-[12px] text-[10px]'>Royals</span>.
        </Link>
      </div>
      <div className="relative w-[1px] h-[80%] bg-white"/>
    </motion.div>
  );
};

export default Sidebar;