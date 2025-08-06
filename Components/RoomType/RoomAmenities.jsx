"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

// RTK
import { getAllRoom } from '@/RTK/Thunks/RoomThunks';
import { getAllBook } from '@/RTK/Thunks/Bookthunks';
import { setCarouselBookings } from '@/RTK/Slices/BookSlice';

// Components
import RoomTypeContainer from './RoomTypeContainer';
import CustomDateRangePicker from '../Custom/CustomDateRangePicker';
import Loader from '../Custom/Loader';

// Dynamic imports with loading states
const RoomPresentation = dynamic(() => import('./RoomPresentation'), {
  loading: () => <Loader />,
  ssr: false
});

const RoomBenefits = dynamic(() => import('./RoomBenefits'), {
  loading: () => <Loader />,
  ssr: false
});

const RoomAmenities = ({ title, content, Stars, ClassicId, location, Alert, Miniprice }) => {
  // State and selectors
  const { CarouselState, startDate, endDate } = useSelector(state => state.StoreOfRoom);
  const { ID } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isBooking, setIsBooking] = useState(false);
  const {user} = useSelector((state)=> state=> state.StoreOfUser)

  // Memoized values
  const cleanLocation = useMemo(() => 
    location?.replace(/^"|"$/g, '').replace('https:/', 'https://'), 
    [location]
  );

  const currentPrice = useMemo(() => 
    ID === '6853f1818ed264b0d5b2c14c' ? Miniprice : CarouselState?.currentPrice,
    [ID, Miniprice, CarouselState]
  );

  // Effects
  useEffect(() => {
    dispatch(getAllRoom());
    if(user !== null){
      dispatch(getAllBook());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (CarouselState?._id) {
      dispatch(setCarouselBookings(CarouselState._id));
    }
  }, [dispatch, CarouselState]);

  // Event handlers
  const handleDateChange = useCallback(({ start, end }) => {
    console.log('Selected date range:', start, end);
  }, []);

  const playNotificationSound = useCallback(async () => {
    try {
      const sound = new Audio('/assets/Sounds/notification.mp3');
      await sound.play();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, []);

  const BookNow = useCallback(async () => {
    if (isBooking) return;
    
    if (!startDate || !endDate) {
      await playNotificationSound();
      toast.error('Please select dates from start to end');
      return;
    }

    setIsBooking(true);

    try {
      const start = startDate instanceof Date ? startDate : new Date(startDate);
      const end = endDate instanceof Date ? endDate : new Date(endDate);

      const queryParams = new URLSearchParams({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        roomId: CarouselState?._id || '',
        CategoryId: ID || '',
        roomAmount: currentPrice,
      }).toString();

      router.push(`/booking?${queryParams}`);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to process booking');
      setIsBooking(false);
    }
  }, [isBooking, startDate, endDate, playNotificationSound, CarouselState, ID, currentPrice, router]);

  // Render helpers
  const renderPriceSection = () => (
    <div className="w-full flex justify-center items-center">
      <h1 className='md:text-[4rem] sm:text-[3.5rem] text-[3rem] font-semibold pt-30 pb-5'>
        Price: <span className='text-[#dfb84b]'>{currentPrice}$</span>
      </h1>
    </div>
  );

  const renderMapSection = () => (
    <div className="w-full lg:h-full h-[23rem] relative rounded-[5px] overflow-hidden shadow-xl">
      {cleanLocation && (
        <iframe
          src={cleanLocation}
          className="w-full h-full"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 'none' }}
          title="Location Map"
        />
      )}
    </div>
  );

  const renderDatePickerSection = () => (
    <div className="w-full h-full flex sm:flex-row flex-col justify-center items-center relative gap-1">
      {/* Promo Card 1 */}
      <div
        className="h-100 w-70 rounded-[7px] relative manrope shadow-2xl bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/Images/DateBG1.png)' }}
      >
        <div className="w-full h-full p-10 flex flex-col justify-center items-center text-white text-center">
          <div className="w-[1px] h-10 bg-white my-1" />
          <h1 className='text-2xl font-black melodrama pb-5'>Step into Royalty – Book Your Perfect Pair Today!</h1>
          <p className='text-[13px]'>Step into a world of premium craftsmanship and timeless style with our exquisite collection of footwear.</p>
        </div>
      </div>

      {/* Promo Card 2 */}
      <div
        className="h-100 w-70 rounded-[7px] relative manrope shadow-2xl bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/Images/DateBG1.png)' }}
      >
        <div className="w-full h-full p-10 flex flex-col justify-center items-center text-white text-center">
          <div className="w-[1px] h-10 bg-white my-1" />
          <h1 className='text-2xl font-black melodrama'>Start to End Date</h1>
          <CustomDateRangePicker
            currentCategory={ID}
            onDateChange={handleDateChange}
            minDate={new Date()}
          />
          <p className='text-[13px] mb-8'>Elevate your stride and make a lasting impression.</p>

          <div className="flex justify-center items-center gap-3 text-[18px] font-bold">
            <span>{startDate}</span>
            <div className='w-[1px] h-full bg-white' />
            <span>{endDate}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookButton = () => (
    <motion.button
      onClick={BookNow}
      className={`block focus:outline-none font-medium rounded-full text-sm w-[35%] mx-auto py-5 text-center cursor-pointer manrope mt-24 relative ${
        isBooking ? 'opacity-75 pointer-events-none' : ''
      }`}
      type="button"
      disabled={isBooking}
      initial={{ backgroundColor: 'rgba(0, 0, 0, 0.08)', color: 'black' }}
      whileHover={!isBooking ? {
        backgroundColor: '#000000',
        color: '#ffffff'
      } : {}}
      whileTap={!isBooking ? {
        backgroundColor: '#000000',
        color: '#ffffff'
      } : {}}
      animate={{
        backgroundColor: isBooking ? '#000000' : 'rgba(0, 0, 0, 0.08)',
        color: isBooking ? '#ffffff' : 'black'
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {isBooking ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </div>
      ) : (
        'Book Now'
      )}
    </motion.button>
  );

  return (
    <div className="w-full h-full pt-5 overflow-x-hidden pb-10">
      <RoomTypeContainer>
        <RoomBenefits Stars={Stars} Alert={Alert} title={title} content={content} />
        <RoomPresentation ClassicId={ClassicId} />

        {/* Map and Date Picker Section */}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-7">
          {renderMapSection()}
          {renderDatePickerSection()}
        </div>

        {/* Price Section */}
        {renderPriceSection()}

        {/* Book Now Button */}
        {renderBookButton()}
      </RoomTypeContainer>
    </div>
  );
};

export default React.memo(RoomAmenities);