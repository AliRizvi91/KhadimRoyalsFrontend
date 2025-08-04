'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from "react-icons/fa";
// RTK
import { mailForResetPassword } from '@/RTK/Thunks/UserThunks';
import { useDispatch } from 'react-redux';

const RPEmail = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // For App Router, we need to handle navigation state differently
  useEffect(() => {
    setIsNavigating(false); // Reset navigation state when component mounts
  }, [pathname]);

  const playNotificationSound = async () => {
    try {
      const sound = new Audio('/assets/Sounds/notification.mp3');
      await sound.play();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleLinkClick = () => {
    setIsNavigating(true);
    window.location.href = '/'; // This will force a full page reload
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      await playNotificationSound();
      toast.error('Email required', {
        description: 'Please enter your email address',
        duration: 5000,
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      await playNotificationSound();
      toast.error('Invalid email format', {
        description: 'Please enter a valid email address (e.g., user@example.com)',
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const loadingToast = toast.loading('Sending reset link...', {
        description: 'This may take a few seconds.',
        duration: Infinity,
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      await dispatch(mailForResetPassword({ email: email }))

      toast.dismiss(loadingToast);
      await playNotificationSound();
      toast('Reset link sent!', {
        description: 'Check your email for the password reset link.',
        duration: 5000,
      });
      setEmail('');
      // Delay the router push by 2 minutes (120,000 milliseconds)
      setTimeout(async () => {
        await router.push('/');
      }, 70000);
    } catch (error) {
      await playNotificationSound();
      toast.error('Failed to send reset link', {
        description: 'Please try again later.',
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
      {/* Loading overlay for page navigation */}
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center h-screen w-full bg-[#e8e4d98f]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 border-4 border-black border-t-transparent rounded-full"
          />
        </div>
      )}

      <div className="relative sm:pt-0 sm:py-13 py-2 flex flex-col justify-center items-center w-full max-w-[70vh] px-4">
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
          Please share your email address, and we'll send you a secure link to reset your password.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mt-6 w-full"
        >
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email*"
            required
            className="w-full p-3 py-5 bg-[#0f12100e] rounded-lg border-none text-[#0f1210] outline-none focus:outline-none focus:bg-[#0f12101e]"
          />

          <motion.button
            initial={{ background: '#0f1210', scale: 1 }}
            whileHover={{ background: '#0f1210ec' }}
            whileTap={{ background: '#0f1210', scale: 0.96 }}
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
            {isLoading ? 'Sending...' : 'Send Reset Link'}
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
            <button onClick={handleLinkClick} className="text-[#0f1210] font-black hover:underline">
              Login
            </button>
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end items-start w-full"
        >
          <p className="text-center text-sm ms-2">
            Join us! Create your account.{' '}
            <Link href="/signup" onClick={handleLinkClick} className="text-[#0f1210] font-black hover:underline">
              SignUp
            </Link>
          </p>
        </motion.div>
        <div className="h-30 w-px bg-[#0f1210] opacity-20 mx-auto mt-7" />
      </div>
    </div>
  );
};

export default RPEmail;