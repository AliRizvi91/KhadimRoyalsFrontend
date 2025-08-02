'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import '@/CSS/Home.css'
import FadeDown from '../Utilities/FadeDown'
import { useScroll, useTransform, motion } from 'framer-motion'
import BubbleButton from '../Custom/BubbleButton'
import { useSelector } from 'react-redux'
import { useTranslations } from 'next-intl'

function HomePart1() {
  const [maskChange, setMaskChange] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const { user } = useSelector((state) => state.StoreOfUser) || {}
  const t = useTranslations('Home')
  const maskRef = useRef(null)

  // Memoize the scroll configuration to prevent unnecessary recalculations
  const scrollOptions = {
    target: maskRef,
    offset: ["start start", "end end"]
  }
  
  const { scrollYProgress } = useScroll(scrollOptions)

  // Handle screen size changes
  const checkScreenSize = useCallback(() => {
    setIsSmallScreen(window.innerWidth <= 900)
  }, [])

  useEffect(() => {
    // Initial check
    checkScreenSize()
    
    // Debounced resize handler
    const handleResize = () => {
      let timeoutId
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkScreenSize, 100)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [checkScreenSize])

  // Memoize transform values based on screen size
  const windowWidth = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    isSmallScreen ? ['40%', '50%', '100%'] : ['17%', '50%', '100%']
  )

  const windowHeight = useTransform(
    scrollYProgress,
    [0, 0.3],
    ['40vh', '90vh']
  )

  const windowTopRounded = useTransform(
    scrollYProgress,
    [0, 0.2],
    ['20rem', '15rem']
  )

  // Optimized scroll event handler
  useEffect(() => {
    const handleScrollChange = (latest) => {
      const shouldChange = latest >= 0.74
      if (shouldChange !== maskChange) {
        setMaskChange(shouldChange)
      }
    }

    const unsubscribe = scrollYProgress.on("change", handleScrollChange)
    return () => unsubscribe()
  }, [scrollYProgress, maskChange])

  // Text content memoized to prevent unnecessary re-renders
  const headerContent = (
    <div className="w-full relative h-[70%] top-0 flex flex-col justify-center items-center text-center bg-[#E8E4D9]">
      <FadeDown duration={1.2} YAxis={20}>
        <p className='xl:text-8xl md:text-7xl sm:text-6xl text-4xl manrope font-black tracking-tighter z-20'>
          {t('thereIsNoPlaceLike')}
        </p>
      </FadeDown>
      <FadeDown delay={0.6} duration={1.2}>
        <p className='xl:text-[20vh] md:text-[17vh] sm:text-[15vh] text-[11vh] italic mt-[-30px] font-thin relative z-1'>
          {t('home')}
        </p>
      </FadeDown>
    </div>
  )

  const maskImage = (
    <motion.div
      style={{
        width: windowWidth,
        height: windowHeight,
        borderTopRightRadius: windowTopRounded,
        borderTopLeftRadius: windowTopRounded,
        backgroundImage: "url('assets/Images/HomeMaskImage.webp')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
      className="sticky top-20 rounded-t-full"
    />
  )

  return (
    <motion.div
      ref={maskRef}
      className="relative top-0 pt-24 h-[174vh] overflow-hidden"
    >
      <div className="w-full h-full flex flex-col justify-start items-center sm:pb-20 pb-4">
        {headerContent}
        
        <FadeDown 
          className="w-full h-full flex flex-col justify-start items-center pt-10" 
          delay={0.6} 
          duration={1.2}
        >
          {maskImage}
        </FadeDown>
      </div>
    </motion.div>
  )
}

export default React.memo(HomePart1)