'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSearchParams } from 'next/navigation';
import { ResetPassword } from '@/RTK/Thunks/UserThunks';
import { useDispatch } from 'react-redux';


const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  // Handle navigation state
  const handleLinkClick = () => {
    setIsNavigating(true);
  };

  const playNotificationSound = async () => {
    try {
      const sound = new Audio('/assets/Sounds/notification.mp3');
      await sound.play();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    await playNotificationSound();

    setIsLoading(true);

    try {
      const loadingToast = toast.loading('Updating your password...', {
        description: 'This may take a few seconds.',
        duration: Infinity,
      });
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const PasswordDone = formData.password === formData.confirmPassword ? formData.password : ''
      dispatch(ResetPassword({
        token: token,
        password: PasswordDone
      }));

      toast.dismiss(loadingToast);
      await playNotificationSound();
      toast('Password updated!', {
        description: 'Your password has been successfully reset.',
        duration: 5000,
        action: {
          label: 'Login now',
          onClick: () => {
            setIsNavigating(true);
            router.push('/');
          },
        },
      });

      setFormData({ password: '', confirmPassword: '' });
    } catch (error) {
      await playNotificationSound();
      toast.error('Reset failed', {
        description: error.message || 'Failed to reset password. Please try again.',
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

  return (
    <div className="min-h-screen w-full bg-[#E8E4D9] flex flex-col items-center justify-center py-7 manrope">
      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center h-screen w-full bg-[#e8e4d98f]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 border-4 border-black border-t-transparent rounded-full"
          />
        </div>
      )}

      <div className="relative sm:pt-0 py-13 flex flex-col justify-center items-center w-full max-w-[70vh] px-4">
        <div className="h-30 w-px bg-[#0f1210] opacity-20 mx-auto" />

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="melodrama md:text-7xl sm:text-6xl text-5xl font-semibold text-center py-5"
        >
          Reset Password
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-center text-gray-700 pb-7"
        >
          Create a strong, secure password for your account
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mt-6 w-full"
        >
          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password* (min 8 characters)"
              minLength={8}
              required
              className="w-full p-3 py-5 bg-[#0f12100e] rounded-lg border-none text-[#0f1210] outline-none focus:outline-none focus:bg-[#0f12101e] pr-12"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('password')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <FaEye className='h-5 w-5 cursor-pointer text-gray-500' />
              ) : (
                <FaEyeSlash className='h-5 w-5 cursor-pointer text-gray-500' />
              )}
            </button>
          </div>


          {/* Confirm Password Input */}
          <div className="relative mt-4">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm New Password*"
              minLength={8}
              required
              className="w-full p-3 py-5 bg-[#0f12100e] rounded-lg border-none text-[#0f1210] outline-none focus:outline-none focus:bg-[#0f12101e] pr-12"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
                <FaEye className='h-5 w-5 cursor-pointer text-gray-500' />
              ) : (
                <FaEyeSlash className='h-5 w-5 cursor-pointer text-gray-500' />
              )}
            </button>
          </div>

          <motion.button
            initial={{ background: '#0f1210', scale: 1 }}
            whileHover={{ background: '#0f1210ec' }}
            whileTap={{ background: '#0f1210', scale: 0.9 }}
            transition={{ duration: 0.2 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 mb-7 text-white rounded-lg font-semibold cursor-pointer flex items-center justify-center"
          >
            {isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
            ) : null}
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-start items-start w-full"
        >
          <p className="text-center text-sm ms-2">
            Remember your password?{' '}
            <Link
              href="/"
              onClick={handleLinkClick}
              className="text-[#0f1210] font-black hover:underline"
            >
              Login
            </Link>
          </p>
        </motion.div>

        <div className="h-30 w-px bg-[#0f1210] opacity-20 mx-auto mt-7" />
      </div>
    </div>
  );
};

export default ResetPasswordForm;