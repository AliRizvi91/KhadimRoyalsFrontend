"use client"
import React from 'react';
import { motion } from 'framer-motion';

function MenuIcons({ isOpen, onClick }) {
  return (
    <div 
      className="flex flex-col justify-center items-center cursor-pointer gap-[5px]"
      onClick={onClick}
    >
      {/* Top line */}
      <motion.div
        className="w-[3.9rem] h-[1.8px] bg-white origin-center"
        animate={{
          y: isOpen ? 5 : 0,
          rotate: isOpen ? 45 : 0,
          position: 'relative',
          top: isOpen ? '5px' : '0px',
        }}
        transition={{
          y: { duration: 0.2, delay: isOpen ? 0 : 0.3 },
          rotate: { delay: isOpen ? 0.3 : 0, duration: 0.3 },
          ease: "easeInOut"
        }}
      />
      
      {/* Middle line */}
      <motion.div
        className="w-[3.9rem] h-[1.5px] bg-white"
        animate={{
          opacity: isOpen ? 0 : 1,
          width: isOpen ? 0 : '3.9rem',
        }}
        transition={{
          opacity: { 
            delay: isOpen ? 0.1 : 0.2,  // Appears later when closing
            duration: 0.2 
          },
          width: { 
            delay: isOpen ? 0.1 : 0.2,  // Expands later when closing
            duration: 0.2 
          },
          ease: "easeInOut"
        }}
      />
      
      {/* Bottom line */}
      <motion.div
        className="w-[3.9rem] h-[1.8px] bg-white origin-center"
        animate={{
          y: isOpen ? -5 : 0,
          rotate: isOpen ? -45 : 0,
        }}
        transition={{
          y: { duration: 0.2, delay: isOpen ? 0 : 0.3 },
          rotate: { delay: isOpen ? 0.3 : 0, duration: 0.3 },
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

export default MenuIcons;