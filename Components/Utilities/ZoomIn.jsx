import { motion } from 'framer-motion';

const ZoomIn = ({ children, duration = 0.5, delay = 0, scale = 0.9 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: scale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0, 0.71, 0.2, 1.01]
      }}
    >
      {children}
    </motion.div>
  );
};

export default ZoomIn;