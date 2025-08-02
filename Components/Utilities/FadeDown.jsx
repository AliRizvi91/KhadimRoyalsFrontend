import { motion } from 'framer-motion'
import React from 'react'

function FadeDown({ children, className,YAxis = 50, delay = 0.5, opacity = 0, duration = 1.2 }) {
  return (
    <motion.div 
      initial={{ y: YAxis, opacity: opacity }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }} // Only animate once
      transition={{
        y: {
          type: "spring",
          stiffness: 100,
          damping: 45,
          delay: delay,
          duration: duration
        },
        opacity: {
          duration: duration,
          ease: "easeOut",
          delay: delay
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default FadeDown