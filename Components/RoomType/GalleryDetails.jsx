"use client"
import React, { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { IoArrowBackCircleOutline } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import RoomTypeContainer from './RoomTypeContainer'
import { getAllRoomTypeDetails } from '@/RTK/Thunks/RoomTypeDetailsThunks'
import { filterItemsById, clearcurrentGallery } from '@/RTK/Slices/RoomTypeDetailsSlice'

const GalleryDetails = () => {
  const router = useRouter()
  const { ID } = useParams()
  const dispatch = useDispatch()
  const { currentGallery } = useSelector((state) => state.StoreOfRoomTypeDetails)
  
  // Memoized animation configurations
  const textAnimation = {
    initial: { x: -500, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 1.8, type: 'spring', stiffness: 200, damping: 90 }
  }

  const imageAnimation = {
    initial: { x: 500, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 1.8, type: 'spring', stiffness: 200, damping: 90 }
  }

  const viewportSettings = { once: true }

  // Handle back navigation with cleanup
  const handleBackClick = useCallback(() => {
    dispatch(clearcurrentGallery())
    router.push('/')
  }, [dispatch, router])

  // Fetch room type details
  useEffect(() => {
    const fetchRoomType = async () => {
      try {
        await dispatch(getAllRoomTypeDetails())
        await dispatch(filterItemsById(ID))
      } catch (error) {
        console.error("Failed to fetch room details:", error)
      }
    }

    fetchRoomType()
  }, [dispatch, ID])

  // Render individual gallery item
  const renderGalleryItem = (item) => (
    <div key={item._id} className="flex justify-center items-center py-20">
      <div className="flex md:flex-row flex-col justify-start items-start md:gap-20 gap-4">
        {/* Text Content */}
        <motion.div
          {...textAnimation}
          viewport={viewportSettings}
          className="text-start"
        >
          <h1 className='md:text-[3rem] sm:text-[2.7rem] text-[2.3rem] pb-5'>
            {item.title || 'Loading...'}
          </h1>
          <p className='md:text-[17px] sm:text-[16px] text-[14px] mb-7 md:w-[30vw] w-full'>
            {item.description || 'Loading description...'}
          </p>
        </motion.div>

        {/* Images Grid */}
        <motion.div
          {...imageAnimation}
          viewport={viewportSettings}
          className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-3 grid-cols-2 gap-3"
        >
          {item.images?.map((image, index) => (
            <div 
              key={index} 
              className="md:w-[100%] md:h-[15rem] w-[10rem] h-full bg-black rounded-2xl overflow-hidden"
            >
              <img 
                src={image} 
                className='w-full h-full object-cover'
                alt={`Room image ${index + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )

  return (
    <div className="w-full h-full bg-[#E8E4D9] relative z-200 mb-[100vh] overflow-x-hidden">
      <RoomTypeContainer>
        <button 
          className="relative justify-start items-start my-20 cursor-pointer"
          onClick={handleBackClick}
          aria-label="Go back to home"
        >
          <IoArrowBackCircleOutline className='text-5xl' />
        </button>

        {currentGallery?.length > 0 
          ? currentGallery.map(renderGalleryItem)
          : <div className="py-20 text-center">Loading gallery...</div>
        }
      </RoomTypeContainer>
    </div>
  )
}

export default React.memo(GalleryDetails)