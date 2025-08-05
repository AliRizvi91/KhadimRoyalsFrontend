import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PanoramicViewer from '../RoomType/PanoramicViewer';
import { PiCaretCircleDoubleLeftThin, PiCaretCircleDoubleRightThin } from "react-icons/pi";
import { useDispatch, useSelector } from 'react-redux';
import { GetCarouselItem } from '@/RTK/Slices/RoomSlice';

const CarouselComponent = ({}) => {
  const { getAllTheRoom = [] } = useSelector(state => state.StoreOfRoom);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dispatch = useDispatch();

  // Reset index when rooms change
  useEffect(() => {
    setCurrentIndex(0);
  }, [getAllTheRoom]);

  // Dispatch GetCarouselItem when currentRoom changes
  useEffect(() => {
    if (getAllTheRoom.length > 0) {
      const currentRoom = getAllTheRoom[currentIndex];
      dispatch(GetCarouselItem(currentRoom));
    }
  }, [dispatch, currentIndex, getAllTheRoom]);

  const goToPrevious = () => {
    if (isTransitioning || getAllTheRoom.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev === 0 ? getAllTheRoom.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToNext = () => {
    if (isTransitioning || getAllTheRoom.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev === getAllTheRoom.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (!getAllTheRoom || getAllTheRoom.length === 0) {
    return (
      <div className="relative w-full flex justify-center items-center my-20 h-56 md:h-96">
        <div className="text-center text-gray-500">No rooms available</div>
      </div>
    );
  }

  const currentRoom = getAllTheRoom[currentIndex];

  return (
    <div className="relative w-full flex flex-col justify-center items-center mb-20">
      {/* Carousel wrapper */}
      <div className="relative w-full h-[60vh] mb-5 rounded-lg overflow-hidden">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="w-full h-full">
            <PanoramicViewer imageUrl={currentRoom?.image} />
          </div>
        </motion.div>
      </div>

      {/* Room info */}
      {currentRoom && (
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">{currentRoom.name}</h3>
          <p className="text-gray-600">{currentRoom.description}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-8">
        <motion.button
          onClick={goToPrevious}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="focus:outline-none"
          disabled={isTransitioning}
        >
          <PiCaretCircleDoubleLeftThin className='text-black w-12 h-12 md:w-14 md:h-14 cursor-pointer' />
        </motion.button>

        <div className="flex gap-2">
          {getAllTheRoom.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 500);
                }
              }}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-gray-600' : 'bg-gray-300'
              }`}
              disabled={isTransitioning}
            />
          ))}
        </div>

        <motion.button
          onClick={goToNext}
          initial={{scale:1}}
          whileHover={{ scale: 0.95 }}
          whileTap={{ scale: 0.98 }}
          className="focus:outline-none"
          disabled={isTransitioning}
        >
          <PiCaretCircleDoubleRightThin className='text-black w-12 h-12 md:w-14 md:h-14 cursor-pointer' />
        </motion.button>
      </div>
    </div>
  );
};

export default CarouselComponent;