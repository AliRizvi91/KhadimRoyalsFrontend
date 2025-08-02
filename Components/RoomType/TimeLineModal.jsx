import { getAllAmenity } from '@/RTK/Thunks/AmenitiesThunks';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import CloudinarySVG from '../Custom/CloudinarySVG';
import { useDispatch, useSelector } from 'react-redux';
import { ToggleModal } from '@/RTK/Slices/AmenitySlice';
import { useParams } from 'next/navigation';

export default function TimelineModal({ ButtonText }) {
  const dispatch = useDispatch();
  const { CategorizedAmenities,CategorizedAmenitiesWithoutLastItem, Modal, loading, error } = useSelector((state) => state.StoreOfAmenities);
  const {ID} = useParams()
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const y = useMotionValue(0);
  const scrollYProgress = useTransform(y, [0, 1], [0, 1]);

  useEffect(() => {
    try {
      dispatch(getAllAmenity());
    } catch (error) {
      console.log("Dispatching getAllAmenity in TimeLineModal Error", error);
    }
  }, [dispatch]);

  // Smooth scroll handler with Framer Motion
  useEffect(() => {
    if (!Modal || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    let targetScrollPos = container.scrollTop;
    let animationId;
    let isAnimating = false;

    const updateScroll = () => {
      container.scrollTop = targetScrollPos;
      if (isAnimating) {
        animationId = requestAnimationFrame(updateScroll);
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      
      if (isAnimating) {
        cancelAnimationFrame(animationId);
      }
      
      const delta = e.deltaY || e.detail || -e.wheelDelta;
      const maxScroll = container.scrollHeight - container.clientHeight;
      
      // Calculate target scroll position with easing
      targetScrollPos = Math.max(0, Math.min(targetScrollPos + delta * 0.5, maxScroll));
      
      isAnimating = true;
      animationId = requestAnimationFrame(updateScroll);
      
      // Stop animation after a short delay
      setTimeout(() => {
        isAnimating = false;
        cancelAnimationFrame(animationId);
      }, 300);
    };

    // Add momentum scrolling effect
    const handleWheelEnd = (e) => {
      if (isAnimating) {
        const velocity = e.deltaY * 0.1;
        targetScrollPos += velocity * 20; // Adjust momentum factor
        
        // Apply boundaries
        const maxScroll = container.scrollHeight - container.clientHeight;
        targetScrollPos = Math.max(0, Math.min(targetScrollPos, maxScroll));
        
        // Animate to final position with spring physics
        animate(targetScrollPos, targetScrollPos, {
          type: "spring",
          stiffness: 300,
          damping: 200,
          onUpdate: (latest) => {
            container.scrollTop = latest;
          }
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('wheel', handleWheelEnd, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('wheel', handleWheelEnd);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [Modal]);

  const toggleModal = () => {
    dispatch(ToggleModal());
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <>
      {/* Modal toggle button */}
      <motion.button
        onClick={toggleModal}
        className="block focus:outline-none font-medium rounded-full text-sm w-full py-3 text-center cursor-pointer manrope"
        type="button"
        initial={{ backgroundColor: 'rgba(0, 0, 0, 0.08)', color: 'black' }}
        whileHover={{ 
          backgroundColor: '#000000',
          color: '#ffffff'
        }}
        whileTap={{ 
          backgroundColor: '#000000',
          color: '#ffffff'
        }}
        transition={{ 
          duration: 0.4,
          ease: "easeInOut"
        }}
      >
        {ButtonText}
      </motion.button>

      {/* Modal with AnimatePresence */}
      <AnimatePresence>
        {Modal && (
          <motion.div
            id="timeline-modal"
            tabIndex="-1"
            aria-hidden={!Modal}
            className="fixed inset-0 z-50 flex flex-col justify-center items-center w-full h-full bg-[#e8e4d980] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            
            {/* Backdrop click handler */}
            <div 
              className="absolute inset-0"
              onClick={toggleModal}
            />
            
            {/* Modal content */}
            <motion.div
              className="relative lg:w-[35rem]  sm:w-[30rem] w-full h-[80vh]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 500
              }}
            >
              <div className="relative bg-[#E8E4D9] rounded-lg shadow-sm h-full flex flex-col z-500 mx-auto">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 bg-[#E8E4D9] border-b border-gray-300">
                  <div className="flex flex-col justify-center items-start">
                    <h3 className="text-5xl font-semibold">
                      Amenities
                    </h3>
                    <p className='manrope text-[13px]'>Classic Apartment amenities</p>
                  </div>
                  <motion.button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center"
                    onClick={toggleModal}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </motion.button>
                </div>

                {/* Scrollable content area with Framer Motion enhancements */}
                <motion.div 
                  ref={scrollContainerRef}
                  className="overflow-y-auto flex-1 p-4 md:p-5"
                  style={{ y }}
                  drag="y"
                  dragConstraints={{
                    top: 0,
                    bottom: 0,
                  }}
                  dragElastic={0.1}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={() => setIsDragging(false)}
                  onScroll={(e) => {
                    if (!isDragging) {
                      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                      y.set(scrollTop / (scrollHeight - clientHeight));
                    }
                  }}
                >
                  {Object.entries(ID === '6853f1818ed264b0d5b2c14c' ? CategorizedAmenitiesWithoutLastItem : CategorizedAmenities).map(([category, amenities]) => (
                    <motion.div 
                      key={category} 
                      className="mb-8"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="px-5 py-3 mb-5 bg-[rgba(0,0,0,0.08)] rounded-full w-fit manrope text-[15px] font-semibold">
                        {category}
                      </div>

                      <div className="space-y-4">
                        {amenities.map((amenity) => (
                          <motion.div 
                            key={amenity._id} 
                            className="flex flex-col justify-center items-start gap-5 border-b-[1px] border-[#2525254b] pb-5 pt-4"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <div className="flex justify-center items-center gap-3">
                              <CloudinarySVG 
                                Icon={amenity.icon} 
                                ClassName={`sm:w-8 sm:h-8 w-6 h-6`} 
                              />
                              <p className='text-[17px] manrope'>{amenity.name}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}