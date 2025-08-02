import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from './Container';
import GalleryCarousel from './GalleryCarousel';

function GalleryPhotos({ImageData}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);


  const openCarousel = (index) => {
    setSelectedIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCarousel = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <Container>
        <div className={`w-full grid lg:grid-cols-3 grid-cols-2 2xl:gap-14 xl:gap-11 sm:gap-8 gap-4 py-20 justify-items-center`}>
          {ImageData.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => openCarousel(index)}
              className="p-0 border-none bg-transparent focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className='xl:w-[22vw] xl:h-[56vh] sm:w-[32vh] sm:h-[48vh] w-[20vh] h-[30vh] bg-[#E8E4D9] rounded-[2rem] cursor-pointer' 
                style={{
                  backgroundImage: `url(${item})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </motion.button>
          ))}
        </div>
      </Container>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
            onClick={closeCarousel} // Close when clicking on backdrop
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()} // Prevent click propagation to backdrop
            >
              
              <GalleryCarousel 
                images={ImageData} 
                initialIndex={selectedIndex} 
                onClose={closeCarousel}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default GalleryPhotos;