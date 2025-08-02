'use client'
import React, { useEffect, useState } from 'react'
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { MdError } from "react-icons/md";
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
// Utilities
import AnimatedText from '@/Components/Utilities/AnimatedText';
import FadeDown from '@/Components/Utilities/FadeDown';


function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [resetStatus, setResetStatus] = useState('pending'); // 'pending', 'success', 'error'

  useEffect(() => {
    if (token ) {
        setResetStatus('success')
    }else{
        setResetStatus('error');
    }
  }, [token]);

  if (resetStatus === 'pending') {
    return (
      <div className={`flex flex-col justify-center items-center h-[100vh] w-full bg-gradient-to-tr from-black to-[#3d3d3d] `}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#E8E4D9] mb-8"></div>
      </div>
    );
  }


  if (resetStatus === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className='w-full h-[100vh] flex flex-col justify-center items-center text-white bg-gradient-to-tr from-black to-[#3d3d3d]'>
        <MdError className='sm:w-50 sm:h-50 w-25 h-25 fill-[#af1a1a]' />
        <AnimatedText delay={0.5} className='sm:text-4xl text-3xl font-semibold'>Password Reset Failed</AnimatedText>

        <FadeDown duration={1.6} YAxis={8} delay={2}>
          <p className='sm:text-[15px] text-[11px] manrope uppercase text-center relative top-3' style={{ letterSpacing: '0.7rem' }}>Invalid or expired token. Please try again!</p>
        </FadeDown>

        <motion.button
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.050 }}
          onClick={() => window.close()}
          className={`w-[30vh] py-4 px-6 my-8 relative top-10 text-white rounded-lg font-extrabold cursor-pointer shadow-2xs manrope uppercase bg-gradient-to-tr from-black to-[#3d3d3d] shadow-[#ad3e3e]`}
        >
          Close
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
      <AnimatedText delay={0.5} className='sm:text-4xl text-3xl font-semibold'>Password Reset Successful</AnimatedText>

      <FadeDown duration={1.6} YAxis={8} delay={2}>
        <p className='sm:text-[15px] text-[11px] manrope uppercase text-center relative top-3' style={{ letterSpacing: '0.7rem' }}>Your password has been updated successfully</p>
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

export default ResetPasswordPage;