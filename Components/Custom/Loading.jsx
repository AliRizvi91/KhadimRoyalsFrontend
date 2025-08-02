"use client"
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const Loading = () => {
  const [percentage, setPercentage] = useState(0);
  const controls = useAnimation();
  const isMounted = useRef(false);
  const animationRef = useRef();

  useEffect(() => {
    isMounted.current = true;

    const animatePercentage = () => {
      const duration = 2000; // 2 seconds in milliseconds
      const startTime = performance.now();
      const endTime = startTime + duration;

      const updatePercentage = (currentTime) => {
        if (!isMounted.current) return;

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentPercentage = Math.floor(progress * 100);

        setPercentage(currentPercentage);

        if (currentTime < endTime) {
          animationRef.current = requestAnimationFrame(updatePercentage);
        } else {
          // Animation complete
          controls.start({
            opacity: 0,
            transition: { duration: 0.2, ease: "easeInOut" }
          });
        }
      };

      animationRef.current = requestAnimationFrame(updatePercentage);
    };

    animatePercentage();

    return () => {
      isMounted.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [controls]);

  return (
    <motion.div
      className="fixed inset-0 flex justify-center items-center bg-gradient-to-tr from-black to-[#383838] w-full h-screen z-[9999]"
      initial={{ opacity: 1 }}
      animate={controls}
    >
      <div className="relative w-full h-full flex justify-center items-center">
        {/* Brand Name */}
        <div className="flex justify-end items-end">
          <div className="text-white uppercase manrope md:text-8xl sm:text-7xl text-5xl font-black">
            Khadim <span className='md:text-[29px] sm:text-[24px] text-[19px] font-bold'>Royals</span>.
          </div>
        </div>
        
        {/* Animated Overlay */}
        <motion.div 
          className="absolute inset-0 h-full w-full bg-[#E8E4D9] z-10"
          initial={{ left: '-100%' }}
          animate={{ left: '0%' }}
          transition={{
            duration: 2,
            ease: 'easeInOut'
          }}
        />
        
        {/* Percentage Counter */}
        <motion.div 
          className="absolute inset-0 flex justify-end items-end z-20 h-screen w-full"
          initial={{ left: '-100%' }}
          animate={{ left: '0%' }}
          transition={{
            duration: 2,
            ease: 'easeInOut'
          }}
        >
          <div className="relative md:text-9xl sm:text-6xl text-3xl sm:p-20 p-10 text-black">
            {percentage}%
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Loading;