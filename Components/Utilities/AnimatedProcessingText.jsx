import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const AnimatedProcessingText = ({ Text , className }) => {
  const [dots, setDots] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev < 3 ? prev + 1 : 0));
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.span 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${className} inline-flex items-center`}
    >
       {Text}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: i < dots ? 1 : 0 }}
          transition={{ duration: 0.1 }}
        >
          .
        </motion.span>
      ))}
    </motion.span>
  );
};

