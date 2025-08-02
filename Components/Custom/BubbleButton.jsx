'use client'; // Required for Framer Motion in Next.js

import { motion } from 'framer-motion';
import { useState } from 'react';

const BubbleButton = ({ children,className, onClick,BGImage }) => {
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const handleHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setHoverPosition({ x, y });
  };

  const handleHoverEnd = () => {
    setHoverPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      className={`${className} relative text-2xl text-center py-3 px-8 sm:w-50 sm:h-21 w-45 h-20  mx-1 cursor-pointer text-white rounded-full font-medium shadow-lg overflow-hidden`}
      whileHover={{ scale: 1.05 }}
      onMouseMove={handleHover}
      onMouseLeave={handleHoverEnd}
      onClick={onClick}
      animate={{
        x: hoverPosition.x * 45, // Adjust multiplier for more/less movement
        y: hoverPosition.y * 45,
        transition: { type: 'spring', damping: 10, stiffness: 100 }
      }}
      style={{
        backgroundImage: BGImage === 1 ? "url('/assets/Images/Button1.webp')" : "url('/assets/Images/Button2.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <motion.span 
        className="relative z-10"
        animate={{
          x: -hoverPosition.x * 8, // Counter-movement for text (optional)
          y: -hoverPosition.y * 8,
        }}
      >
        {children}
      </motion.span>
      
      {/* Optional bubble background effect */}
      <motion.div 
        className="absolute inset-0 bg-gray-600 rounded-lg opacity-0"
        animate={{
          opacity: 0.3,
          x: hoverPosition.x * 30,
          y: hoverPosition.y * 30,
          scale: 1.5,
          transition: { duration: 0.3 }
        }}
      />
    </motion.button>
  );
};

export default BubbleButton;