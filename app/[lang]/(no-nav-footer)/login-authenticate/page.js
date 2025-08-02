'use client'
import React, { useEffect, useState } from 'react'
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { MdError } from "react-icons/md";
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
// RTK
import { ResendToken, TokenVerification } from '@/RTK/Thunks/UserThunks';
import { useDispatch } from 'react-redux';
// components
import Loader from '@/Components/Custom/Loader';
// Utilities
// import AnimatedText from '@/Components/Utilities/AnimatedText';

const AnimatedText = dynamic(
  () => import('@/Components/Utilities/AnimatedText'),
  { ssr: false }
);
import FadeDown from '@/Components/Utilities/FadeDown';


function VerificationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const dispatch = useDispatch();
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'success', 'error'

  useEffect(() => {
    if (token) {
      dispatch(TokenVerification({ token }))
        .unwrap()
        .then(() => setVerificationStatus('success'))
        .catch(() => setVerificationStatus('error'));
    }
  }, [dispatch, token]);

  if (verificationStatus === 'pending') {
    return (
      <div className={`flex flex-col justify-center items-center h-[100vh] w-full bg-gradient-to-tr from-black to-[#3d3d3d] `}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#E8E4D9] mb-8"></div>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    const handleResendToken = async () => {
      try {
        await dispatch(ResendToken({
          email: email,
          token: token
        })).unwrap();
        // Close the tab after successful dispatch
        window.close();
      } catch (error) {
        // Errors are already handled in the thunk
      }
    };
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className='w-full h-[100vh] flex flex-col justify-center items-center text-white bg-gradient-to-tr from-black to-[#3d3d3d]'>
        <MdError className='sm:w-50 sm:h-50 w-25 h-25 fill-[#af1a1a]' />
        <AnimatedText delay={0.5} className='sm:text-4xl text-3xl font-semibold'>Verification Fail</AnimatedText>

        <FadeDown duration={1.6} YAxis={8} delay={2}>
          <p className='sm:text-[15px] text-[11px] manrope uppercase text-center relative top-3' style={{ letterSpacing: '0.7rem' }}>Invalid token.Please try again!.</p>
        </FadeDown>

        <motion.button
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.050 }}
          onClick={handleResendToken}
          className={`w-[30vh] py-4 px-6 my-8 relative top-10 text-white rounded-lg font-extrabold cursor-pointer shadow-2xs manrope uppercase bg-gradient-to-tr from-black to-[#3d3d3d] shadow-[#ad3e3e]`}
        >
          Resend Token
        </motion.button>
      </motion.div>
    );
  }



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className='w-full h-[100vh] flex flex-col justify-center items-center text-white bg-gradient-to-tr from-black to-[#3d3d3d]'>
      <IoCheckmarkDoneCircleSharp className='sm:w-50 sm:h-50 w-25 h-25 fill-[#E8E4D9]' />
      <AnimatedText delay={0.5} className='sm:text-4xl text-3xl font-semibold'>Email Verified</AnimatedText>

      <FadeDown duration={1.6} YAxis={8} delay={2}>
        <p className='sm:text-[15px] text-[11px] manrope uppercase text-center  relative top-3' style={{ letterSpacing: '0.7rem' }}>You can now close this tab</p>
      </FadeDown>
            <motion.button
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.050 }}
              onClick={() => window.close()}
              className={`w-[30vh] py-4 px-6 my-8 relative top-10 text-white rounded-lg font-extrabold cursor-pointer shadow-2xs manrope uppercase bg-gradient-to-tr from-black to-[#3d3d3d] shadow-[#3d3d3d]`}
            >
              Close
            </motion.button>
    </motion.div>
  );
}

export default VerificationPage;