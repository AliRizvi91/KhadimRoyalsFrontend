'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { BiLeftTopArrowCircle } from "react-icons/bi";

const Dropdown = ({ items, name, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  const handleItemClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    // Create a synthetic event object to match what handleChange expects
    onChange({
      target: {
        name: name,
        value: item
      }
    });
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full">
      <motion.button
        type="button"
        className="bg-[#12110fe7] text-white px-4 w-full py-4 rounded-2xl flex items-center justify-between"
        onClick={handleButtonClick}
      >
        {value || 'Roles'} {/* Use the value prop instead of local state */}
        <motion.span
          className="ml-2"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <BiLeftTopArrowCircle className='h-7 w-7' />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="absolute mt-2 w-full bg-[#E8E4D9] rounded-md shadow-lg z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, duration: 2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((item, index) => (
              <motion.li
                key={index}
                name={name}
                className={`px-4 py-2 hover:bg-[#0f1210]/10 cursor-pointer ${value === item ? 'bg-gray-200' : ''}`}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={(e) => handleItemClick(e, item)}
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;