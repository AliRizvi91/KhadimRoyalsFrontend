import React, { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'next/navigation'


// Utilities
import Loader from '../Custom/Loader'
import FadeDown from '../Utilities/FadeDown'
const AnimatedText = dynamic(
  () => import('../Utilities/AnimatedText'),
  { 
    ssr: false,
    loading: () => <span>Amenities</span> // Fallback for dynamic import
  }
)

// Custom Components
import Container from '../Custom/Container'
import CloudinarySVG from '../Custom/CloudinarySVG'
import BubbleButton from '../Custom/BubbleButton'

// RTK
import { getAllAmenity, postAmenityLanguage } from '@/RTK/Thunks/AmenitiesThunks'

// Constants
const GRID_BORDERS = {
  en: [
    'border-b-2 border-r-2',
    'border-b-2 md:border-r-2',
    'border-b-2 border-r-2',
    'border-b-2',
    'border-r-2 md:border-b-0 border-b-2',
    'md:border-b-0 border-b-2 md:border-r-2',
    'border-r-2',
    ''
  ],
  ar: [
    'border-b-2 border-r-0',
    'border-b-2 md:border-r-2',
    'border-b-2 border-r-2',
    'border-b-2 border-r-2',
    'border-r-0',
    'md:border-b-0 border-b-2 md:border-r-2',
    'border-r-2',
    'border-r-2'
  ]
}

function Amenities({ ColorChange }) {
  const borderColor = ColorChange ? "#E8E4D9" : "#18120c"
  const dispatch = useDispatch()
  const { lang } = useParams()
  const { TwoAmenitiesPerCategory, loading, error } = useSelector((state) => state.StoreOfAmenities)
  const t = useTranslations('Home')

  // Memoized amenities data
  const allAmenities = useMemo(() => 
    TwoAmenitiesPerCategory ? Object.values(TwoAmenitiesPerCategory).flat().slice(0, 8) : [],
    [TwoAmenitiesPerCategory]
  )

  const allAmenityNames = useMemo(() => 
    allAmenities.map(amenity => amenity?.name).filter(Boolean),
    [allAmenities]
  )

  // Data fetching effects
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        await dispatch(getAllAmenity())
      } catch (error) {
        console.error("Error fetching amenities:", error)
      }
    }
    fetchAmenities()
  }, [dispatch])

  useEffect(() => {
    const updateAmenityLanguages = async () => {
      try {
        if (allAmenityNames?.length > 0) {
          // Safely extract names with null checks
          const amenityNames = allAmenityNames
            .map(amenity => amenity?.name)
            .filter(name => name != null);
          
          if (amenityNames.length > 0) {
            await dispatch(postAmenityLanguage(amenityNames)).unwrap();
          }
        }
      } catch (error) {
        console.error('Error updating amenity languages:', error);
      }
    };

    updateAmenityLanguages();
  }, [allAmenityNames, dispatch]);

  // Loading and error states
  if (loading) return (
    <div className={`flex flex-col justify-center items-center h-[60vh] w-full bg-black `}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#E8E4D9] mb-8"></div>
      </div>
  )

  if (error) return (
    <div className="w-full h-full flex justify-center items-center text-red-500">
      <p>Error loading amenities: {error.message || 'Unknown error'}</p>
    </div>
  )

  return (
    <div className="w-full h-full">
      <Container className="text-center flex flex-col justify-center items-center pb-50">
        <h1 className='xl:text-[17rem] lg:text-[12rem] md:text-[8rem] text-[4rem] text-center font-semibold'>
          <AnimatedText className="justify-center" delay={0.5}>
            {t('Amenities')}
          </AnimatedText>
        </h1>

        <FadeDown className="w-full flex justify-center md:-mt-10" duration={1.2} YAxis={10}>
          <p className='md:text-[24px] sm:text-[19px] text-[16px] manrope mb-7 sm:w-[80%] w-full text-center'>
            {t('Amenitiesline')}
          </p>
        </FadeDown>

        <div className="grid md:grid-cols-4 grid-cols-2 justify-items-center manrope w-full md:h-[38rem] sm:h-[74rem] h-[63rem] sm:mt-20 my-15">
          {allAmenities.map((amenity, index) => {
            const borderClasses = GRID_BORDERS[lang]?.[index] || GRID_BORDERS.en[index]

            return (
              <motion.div
                key={amenity?._id || `amenity-${index}`}
                className={`flex flex-col justify-center items-center w-full h-full md:py-0 py-[10%] ${borderClasses} border-[#18120c]`}
                animate={{ borderColor }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              >
                {amenity ? (
                  <div className="w-23 h-35 flex flex-col justify-center items-center md:m-25 sm:m-16 m-12 sm:gap-5 gap-4">
                    <CloudinarySVG 
                      Icon={amenity.icon} 
                      ColorChange={ColorChange} 
                      ClassName="sm:w-13 sm:h-13 w-10 h-10"
                    />
                    <p className='font-bold text-[13px]'>
                      {t(amenity.name)}
                    </p>
                  </div>
                ) : (
                  <p className='text-[13px]'>No amenity</p>
                )}
              </motion.div>
            )
          })}
        </div>
      </Container>
    </div>
  )
}

export default React.memo(Amenities)