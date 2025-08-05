"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
// Components
import { AnimatedProcessingText } from '../Utilities/AnimatedProcessingText';
// RTK
import { postBook } from '@/RTK/Thunks/Bookthunks';

// Constants
const INITIAL_BOOKING_STATE = {
  userId: '',
  roomId: '',
  startDate: '',
  endDate: '',
  guests: null,
  totalAmount: null,
  status: 'pending',
  specialRequests: '',
};

function BookingPart1() {
  const [commingCategoryId, setCommingCategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.StoreOfUser);
  const [booking, setBooking] = useState(INITIAL_BOOKING_STATE);

  // Memoized URL parameters
  const urlParams = useMemo(() => ({
    startDate: searchParams.get('startDate'),
    endDate: searchParams.get('endDate'),
    roomId: searchParams.get('roomId'),
    roomAmount: searchParams.get('roomAmount'),
    categoryId: searchParams.get('CategoryId')
  }), [searchParams]);

  // Sync with URL parameters
  useEffect(() => {
    if (urlParams.startDate && urlParams.endDate) {
      setBooking(prev => ({
        ...prev,
        startDate: urlParams.startDate,
        endDate: urlParams.endDate,
        roomId: urlParams.roomId || '',
        totalAmount: urlParams.roomAmount,
        userId: user?._id || ''
      }));
      setCommingCategoryId(urlParams.categoryId);
    }
  }, [urlParams, user?._id]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setBooking(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleNumberChange = useCallback((e) => {
    const { name, value } = e.target;
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      setBooking(prev => ({ ...prev, [name]: numValue }));
    }
  }, []);

  const playNotificationSound = useCallback(async () => {
    try {
      const sound = new Audio('/assets/Sounds/notification.mp3');
      await sound.play().catch(e => console.warn('Audio play interrupted:', e));
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, []);

  const validateBooking = useCallback(async () => {
    if (!booking.startDate || !booking.endDate || !booking.guests) {
      await playNotificationSound();
      toast.error('Missing required fields', {
        description: 'Please fill in all required fields',
        duration: 5000,
      });
      return false;
    }

    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);

    if (start >= end) {
      await playNotificationSound();
      toast.error('Invalid dates', {
        description: 'Check-out date must be after check-in date',
        duration: 5000,
      });
      return false;
    }

    return true;
  }, [booking, playNotificationSound]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isValid = await validateBooking();
      if (!isValid) {
        setIsLoading(false);
        return;
      }

      if(user !== null){
        const loadingToast = toast.loading('Processing Booking...', {
          description: 'This may take a few seconds.',
          duration: Infinity,
        });
        const resultAction = await dispatch(postBook(booking));
        
        if (postBook.fulfilled.match(resultAction)) {
          await playNotificationSound();
          toast.dismiss(loadingToast);
          toast.success('Booking Successful!');
          router.push(`/room/${commingCategoryId}`);
        } else {
          throw new Error(resultAction.error?.message || 'Booking failed');
        }
      }else{
        toast.error('🔒 Please login to continue')
        return;
      }

    } catch (error) {
      await playNotificationSound();
      toast.dismiss(toast.loading());
      toast.error('Booking Error', {
        description: error.message || 'Please check your information and try again.',
        duration: 8000,
        action: {
          label: 'Retry',
          onClick: () => handleSubmit(e),
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDates = useMemo(() => ({
    start: booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'Select date',
    end: booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'Select date'
  }), [booking.startDate, booking.endDate]);

  return (
    <div className="min-h-screen w-full bg-[#E8E4D9] flex flex-col items-center justify-start py-7 manrope">
      <div className="relative sm:pt-0 py-13 flex flex-col justify-center items-center w-full max-w-[70vh] px-4">
        <div className="h-30 w-px bg-[#0f1210] opacity-20 mx-auto" />
        <h1 className="melodrama md:text-7xl sm:text-6xl text-5xl font-semibold text-center py-5">Book</h1>
        <p className="text-sm text-center text-gray-700 pb-7 sm:w-[60vh] w-full">
          The reservation request is not considered completed, we will contact you for acceptance.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6 w-full">
          <div className="grid grid-cols-2 gap-4">
            <DateDisplay value={formattedDates.start} />
            <DateDisplay value={formattedDates.end} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              type="number"
              name="guests"
              value={booking.guests ?? ''}
              onChange={handleNumberChange}
              placeholder="Number of Guests*"
              min="1"
              required
            />
            <div className="w-full p-3 py-5 bg-[#0f12100e] rounded-lg border-none text-[#0f1210] outline-none">
              {booking.totalAmount || '0'}
            </div>
          </div>

          <textarea
            name="specialRequests"
            value={booking.specialRequests}
            onChange={handleChange}
            placeholder="Special Requests"
            className="w-full p-3 py-5 bg-[#0f12100e] rounded-lg border-none text-[#0f1210] outline-none focus:outline-none focus:bg-[#0f12101e] min-h-[100px]"
          />

          <SubmitButton isLoading={isLoading} />
        </form>
      </div>
    </div>
  );
}

// Extracted components for better readability and reusability
const DateDisplay = ({ value }) => (
  <div className="w-full p-3 py-5 bg-[#0f12100e] rounded-lg border-none text-[#0f1210] outline-none">
    {value}
  </div>
);

const SubmitButton = ({ isLoading }) => (
  <motion.button
    initial={{ background: '#0f1210', scale: 1 }}
    whileHover={{ background: '#0f1210ec' }}
    whileTap={{ background: '#0f1210', scale: 0.95 }}
    transition={{ duration: 0.2 }}
    type="submit"
    className="w-full py-4 px-6 mb-7 text-white rounded-lg font-semibold cursor-pointer"
    disabled={isLoading}
  >
    {isLoading ? <AnimatedProcessingText Text="Processing" /> : 'Booking'}
  </motion.button>
);

const InputField = React.memo(({ type, name, value, onChange, placeholder, required, min }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    min={min}
    className="w-full p-3 py-5 bg-[#0f12100e] rounded-lg border-none text-[#0f1210] outline-none focus:outline-none focus:bg-[#0f12101e]"
  />
));

export default React.memo(BookingPart1);