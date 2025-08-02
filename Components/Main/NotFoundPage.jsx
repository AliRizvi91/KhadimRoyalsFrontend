'use client'
import React from 'react'
import { MdError } from "react-icons/md";
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '@/CSS/NotFound.module.css'
// Utilities
import AnimatedText from '@/Components/Utilities/AnimatedText';
import FadeDown from '@/Components/Utilities/FadeDown';


function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={styles.container}
    >
      <MdError className={styles.errorIcon} />
      <AnimatedText delay={0.5} className={styles.title}>404 - Page Not Found</AnimatedText>

      <FadeDown duration={1.6} YAxis={8} delay={2}>
        <p className={styles.subtitle}>
          The page you're looking for doesn't exist
        </p>
      </FadeDown>

      <motion.div
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.050 }}
        className={styles.homeButton}
      >
        <Link href="/" className={styles.homeButtonLink}>
          Return Home
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default NotFoundPage;