import { motion, AnimatePresence } from "framer-motion";

const TextAnimation = ({ heading, paragraph, isVisible, className = "" }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <div className={className}>
          <motion.h1 
            className='text-4xl md:text-6xl lg:text-7xl uppercase mb-6'
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {heading}
          </motion.h1>
          
          <motion.p 
            className='w-full md:w-3/4 lg:w-[40%] text-lg md:text-[18px] relative z-20'
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeInOut",
            //   delay: 0.1
            }}
          >
            {paragraph}
          </motion.p>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TextAnimation;

// Usage example:
// <TextAnimation heading="Hello World" paragraph="This is some description text" isVisible={true} />