"use client"
import React, { useEffect, useCallback, useMemo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'next/navigation'
// Components
import SmoothScroll from '@/Components/Utilities/SmoothScroll'
import ClassicPart1 from '@/Components/RoomType/ClassicPart1'
import Detail from '@/Components/RoomType/Detail'
import MasonryGallery from '@/Components/RoomType/MasonryGallery'
// RTK
import { getAllRoomType } from '@/RTK/Thunks/RoomTypeThunks'
import { getAllGallery } from '@/RTK/Thunks/GalleryThunks'

// Dynamic imports with proper loading states
const RoomAmenities = dynamic(
  () => import('@/Components/RoomType/RoomAmenities'),
  {
    loading: () => <div className="min-h-[500px] bg-[#E8E4D9]" />,
    ssr: false
  }
)

const LoadingFallback = () => (
  <div className="min-h-[500px] bg-[#E8E4D9] flex items-center justify-center">
    Loading...
  </div>
)

function RoomType() {
  const params = useParams()
  const dispatch = useDispatch()
  const { getAllType } = useSelector((state) => state.StoreOfRoomType)
  const { Modal } = useSelector((state) => state.StoreOfAmenities)

  // Memoized room data to prevent unnecessary re-renders
  const roomData = useMemo(() => {
    return getAllType?.find((data) => data._id === params?.ID)
  }, [getAllType, params?.ID])

  // Fetch room data with error handling
  const fetchRoomTypeData = useCallback(async () => {
    try {
      await dispatch(getAllRoomType())
      // Consider adding getAllGallery here if needed
      // await dispatch(getAllGallery())
    } catch (error) {
      console.error("Failed to fetch room data:", error)
      // Consider adding error state handling here
    }
  }, [dispatch])

  // Preload critical resources
  useEffect(() => {
    const preloadResources = () => {
      const resources = [
        // Add paths to critical assets you want to preload
      ]
      
      resources.forEach(resource => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = resource.endsWith('.css') ? 'style' : resource.endsWith('.js') ? 'script' : 'fetch'
        link.href = resource
        document.head.appendChild(link)
      })
    }

    preloadResources()
    fetchRoomTypeData()

    return () => {
      // Cleanup preloaded links
      document.querySelectorAll('link[rel="preload"]').forEach(el => el.remove())
    }
  }, [fetchRoomTypeData])

  if (!roomData) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#E8E4D9]">
        <p>Loading room data...</p>
      </div>
    )
  }

  return (
    <div className={`w-full ${Modal ? 'h-[6vh]' : 'h-full'} mb-[100vh]`}>
      <SmoothScroll>
        <>
          <ClassicPart1
            image={roomData.image}
            title={roomData.title}
            description={roomData.description}
          />
          <div className='w-full h-full bg-[#E8E4D9] overflow-x-hidden'>
            <Suspense fallback={<LoadingFallback />}>
              <Detail roomDtailData={roomData.details} />
              <MasonryGallery galleryImages={roomData.gallery?.images} />
              <RoomAmenities 
                title={roomData.explanation?.title} 
                content={roomData.explanation?.content} 
                Stars={roomData.stars} 
                ClassicId={roomData._id} 
                location={roomData.location}
                Alert={roomData.alert} 
                Miniprice={roomData.price} 
              />
            </Suspense>
          </div>
        </>
      </SmoothScroll>
    </div>
  )
}

export default React.memo(RoomType)