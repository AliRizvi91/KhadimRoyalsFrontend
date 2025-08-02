import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

// Custom Components
import Container from '../Custom/Container'
// import AnimatedText from '../Utilities/AnimatedText'
const AnimatedText = dynamic(
  () => import('../Utilities/AnimatedText'),
  { ssr: false }
);
import GalleryCarousel from '../Custom/GalleryCarousel'
import { getAllGallery } from '@/RTK/Thunks/GalleryThunks'


// Default translations fallback
const DEFAULT_TRANSLATIONS = {
  gallery: 'Gallery',
  classic: 'Classic',
  mini: 'Mini'
}

function Gallery() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('Classic')
  const t = useTranslations('Home')
  const { lang } = useParams()

  const dispatch = useDispatch()
  const galleryData = useSelector((state) => state.StoreOfgallery.items)

  // Memoized gallery data access
  const [classicGallery, miniGallery] = React.useMemo(() => [
    galleryData[0] || { images: [] },
    galleryData[1] || { images: [] }
  ], [galleryData])

  const currentGallery = activeTab === 'Classic' ? classicGallery : miniGallery

  // Robust translation function with fallback
  const getTranslation = (key) => {
    try {
      return t(key)
    } catch (error) {
      console.warn(`Missing translation for key "Home.${key}" in locale "${lang}"`)
      return DEFAULT_TRANSLATIONS[key] || key
    }
  }

  // Handlers with useCallback
  const openCarousel = useCallback((index) => {
    setSelectedIndex(index)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeCarousel = useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = 'auto'
  }, [])

  // Fetch gallery data
  useEffect(() => {
    dispatch(getAllGallery())
  }, [dispatch])

  // Clean up effect
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])


  return (
    <>
      <Container className="flex flex-col justify-start items-end">
        <h1 className='lg:text-[17rem] sm:text-[12rem] text-[6rem] font-semibold'>
          <AnimatedText delay={0.5}>{getTranslation('gallery')}</AnimatedText>
        </h1>

        <div className="w-full relative">
          <div className="flex relative z-500">
              <button 
                className={`uppercase text-2xl mx-1 px-2 cursor-pointer font-bold ${lang === 'ar'?'hover:text-yellow-600':''}`}
                onClick={() => setActiveTab('Classic')}
              >
                {getTranslation('Classic')}
              </button>
              <button 
                className={`uppercase text-2xl mx-1 px-2 cursor-pointer font-bold ${lang === 'ar'?'hover:text-yellow-600':''}`}
                onClick={() => setActiveTab('mini')}
              >
                {getTranslation('mini')}
              </button>
          </div>
          
          {lang === 'en' || lang === 'ur' ? (
              <motion.span 
    className={`h-[1px] ${lang === 'ur' || lang === 'ar' ? 'w-15':'w-22'} bg-[#E8E4D9] absolute -bottom-2`}
    initial={false}
    animate={{
      left: activeTab === 'Classic' ? '13px' : lang === 'ur' ? '4.8rem':'6.5rem', 
    }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  />
          ) : '' }

        </div>

        <div className="w-full grid lg:grid-cols-3 grid-cols-2 py-20 justify-items-center">
          {currentGallery.images.map((item, index) => (
            <motion.button
              key={`${activeTab}-${index}`}
              onClick={() => openCarousel(index)}
              className="p-0 border-none bg-transparent m-[1rem] focus:outline-none xl:w-[25vw] lg:w-[31vw] sm:w-[40vw] w-[40vw] xl:h-[63vh] lg:h-[55vh] md:h-[56vh] sm:h-[46vh] h-[30vh]"
              whileHover={{ scale: 0.95 }}
              whileTap={{ scale: 0.98 }}
              aria-label={`Open image ${index + 1}`}
            >
              <div 
                className="w-full h-full bg-[#E8E4D9] rounded-[1rem] cursor-pointer" 
                style={{
                  backgroundImage: `url(${item})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
                loading="lazy"
              />
            </motion.button>
          ))}
        </div>
      </Container>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
            onClick={closeCarousel}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <GalleryCarousel 
                images={currentGallery.images} 
                initialIndex={selectedIndex} 
                onClose={closeCarousel}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default React.memo(Gallery)