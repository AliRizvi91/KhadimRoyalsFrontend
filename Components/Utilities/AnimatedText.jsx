import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';

function AnimatedText({ children, className, delay = 0, characterDelay = 0.05 }) {
  const {lang} = useParams()

  // For RTL languages (Arabic, Urdu), return a simpler animation
  if (lang === 'ur' || lang === 'ar') {
    return (
      <motion.p
        className={`${className}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          delay: delay,
          duration: 1.2,
          ease: "easeOut"
        }}
        style={{ fontWeight: 'normal' }}
      >
        {children}
      </motion.p>
    );
  }

  // For LTR languages, return the character-by-character animation
  const words = children.split(' ');

  return (
    <div className={`${className} flex flex-wrap`}>
      {words.map((word, wordIndex) => (
        <div key={`word-${wordIndex}`} className="inline-block mr-2 mb-2">
          {word.split('').map((character, charIndex) => (
            <motion.span
              key={`char-${wordIndex}-${charIndex}`}
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontWeight: 'bolder' }}
              transition={{
                delay: delay + (wordIndex * 0.2) + (charIndex * characterDelay),
                duration: 1.2,
                ease: "easeOut"
              }}
            >
              {character}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default AnimatedText;