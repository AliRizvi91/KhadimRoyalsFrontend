"use client";
import { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


// icons
import { PiCardsThreeFill } from "react-icons/pi";
import { PiDotsThreeVerticalFill } from "react-icons/pi";
import { GiMoneyStack } from "react-icons/gi";
import { DiDatabase } from "react-icons/di";
import { IoCloseSharp } from "react-icons/io5";
import { MdMeetingRoom } from "react-icons/md";
import { MdDelete } from "react-icons/md";
// Components
import BubbleButton from './BubbleButton';
import TooltipButton from './TooltipButton';
import { AnimatedProcessingText } from '../Utilities/AnimatedProcessingText';

// RTK
import { getAllBook, deleteBook } from '@/RTK/Thunks/Bookthunks';
import { setUserBookings } from '@/RTK/Slices/BookSlice';

export default function DrawerComponent({ openButton, isOpen, setIsOpen }) {
  const [isLoading , setIsLoading]= useState(false)
  const { user } = useSelector((state) => state.StoreOfUser) || {}
  const dispatch = useDispatch();
  const router = useRouter()
  const { currentUserBookings } = useSelector((state) => state.StoreOfBook);
 
  
  useEffect(() => {
    const GetBookings = async () => {
      await dispatch(getAllBook());
      if (user?._id) {
        await dispatch(setUserBookings(user._id));
      }
    }
    GetBookings()
  }, [dispatch, user?._id]);

  const deleteBooking = async (bookingId) => {
    await dispatch(deleteBook(bookingId));
    // toast.success('Deleted Book Successfully');
  }
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  

 const handleCheckout = async()=>{
  setIsLoading(true)
  await router.push('/checkout')
 }



  return (
    <div className="relative">
      {/* Toggle Button */}
      <div className="text-center">
        <button
          onClick={toggleDrawer}
          className="cursor-pointer relative"
          type="button"
          aria-label="Toggle drawer"
        >
          <div className="absolute inset-0 w-full h-full flex justify-end">
            {currentUserBookings?.length > 0 && (
              <div className="h-4 w-4 text-[12px] text-black manrope font-extrabold rounded-full bg-sky-400 flex justify-center items-center -top-[4px]">
                {currentUserBookings.length}
              </div>
            )}
          </div>
          {openButton}
        </button>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleDrawer}
              className="fixed inset-0 z-30 bg-[#e8e4d9b7]"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }}
              className="fixed top-0 right-0 z-[1000] h-screen p-4 overflow-y-auto bg-black border-1 border-black text-white sm:w-80 w-full"
              aria-labelledby="drawer-right-label"
            >
              <div className="flex justify-between items-center mb-4">
                <h5
                  id="drawer-right-label"
                  className="inline-flex items-center text-base font-semibold text-white"
                >
                  <PiCardsThreeFill className="w-6 h-6 me-2.5" />
                  <div className="uppercase manrope text-3xl font-extrabold">
                    Khadim<span className='sm:text-[12px] text-[10px]'>Royals</span>.
                  </div>
                </h5>
                <button
                  onClick={toggleDrawer}
                  aria-label="Close drawer"
                  className="text-gray-300 bg-transparent rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center cursor-pointer"
                >
                  <IoCloseSharp className="w-7 h-7" />
                </button>
              </div>

              <div className="bg-white w-full h-[1px] my-6 opacity-20" />

              {/* Booking List */}
              <ul className="divide-y divide-gray-600 pb-10 manrope">
                {currentUserBookings?.length > 0 ? (
                  currentUserBookings.map((booking) => (
                    <li key={booking._id} className="py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <div className="shrink-0">
                          <MdMeetingRoom className='text-[#E8E4D9] w-8 h-8' />
                        </div>
                        <div className="flex-1 min-w-0 ms-4">
                          <p className="text-sm font-extrabold text-gray-100">
                            Room No: {booking.roomId?.roomNumber || 'null'}
                          </p>
                          <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                            {booking.specialRequests || 'No description available'}
                          </p>
                        </div>
                        <div className="flex flex-col justify-between items-center gap-2">
                          <span>${booking.totalAmount}</span>
                          <div className="flex justify-end items-center gap-1">
                            <TooltipButton inputBTN={<PiDotsThreeVerticalFill className='w-6 h-6 text-white' />} Data={booking} />
                            <button className='cursor-pointer' onClick={() => deleteBooking(booking?._id)}>
                              <MdDelete className='text-red-700 w-6 h-6' />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-4 text-center text-gray-400">
                    No bookings found
                  </li>
                )}
              </ul>

              {currentUserBookings?.length > 0 && (
                <div className="w-full flex justify-center items-center">

                  <Link href="/checkout" passHref>
                    <BubbleButton
                      className="text-white text-[18px]"
                      BGImage={2}
                      onClick={handleCheckout}
                    >
                        {isLoading ? (<AnimatedProcessingText Text={`Processing`}/>) : (
                          <span className={`flex justify-center items-center gap-3 font-semibold`} >CheckOut <GiMoneyStack className={'w-6 h-6'} /></span> 
                        )}
                    </BubbleButton>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}