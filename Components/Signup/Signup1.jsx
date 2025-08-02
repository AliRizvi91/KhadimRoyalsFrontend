"use client";

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
// Icons
import { FaEye, FaEyeSlash } from "react-icons/fa";
// Components
import ImageUploader from '../Custom/ImageUploader';
import CustomAvatar from '../Custom/CustomAvatar';
import Dropdown from '../Custom/Dropdown';
// RTK
import { signup } from '@/RTK/Thunks/UserThunks';
// CSS
import FormCSS from '@/CSS/Form.module.css';

// Constants
const INITIAL_USER_STATE = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  street: '',
  city: '',
  zipCode: '',
  country: '',
  role: 'guest',
  isVerified: false,
};

const ROLE_OPTIONS = ['guest', 'staff', 'admin'];

function Signup1() {
  const [user, setUser] = useState(INITIAL_USER_STATE);
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const passwordRef = useRef(null);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCheckboxChange = useCallback(() => {
    setUser(prev => ({ ...prev, isVerified: !prev.isVerified }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
    setTimeout(() => passwordRef.current?.focus(), 0);
  }, []);

  const playNotificationSound = useCallback(async () => {
    try {
      const sound = new Audio('/assets/Sounds/notification.mp3');
      await sound.play().catch(e => console.warn('Audio play interrupted:', e));
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, []);

  const validateForm = useCallback(async () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'phone'];
    const missingFields = requiredFields.filter(field => !user[field]);

    if (missingFields.length > 0) {
      await playNotificationSound();
      toast.error('Missing required fields', {
        description: `Please fill in: ${missingFields.join(', ').replace(/([A-Z])/g, ' $1').toLowerCase()}`,
        duration: 5000,
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      await playNotificationSound();
      toast.error('Invalid email format', {
        description: 'Please enter a valid email address (e.g., user@example.com)',
        duration: 5000,
      });
      return false;
    }

    if (user.password.length < 8) {
      await playNotificationSound();
      toast.error('Password too short', {
        description: 'Password should be at least 8 characters long',
        duration: 5000,
      });
      return false;
    }

    return true;
  }, [user, playNotificationSound]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const isValid = await validateForm();
      if (!isValid) return;

      const formData = new FormData();
      Object.entries(user).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      if (image) formData.append('image', image);

      const loadingToast = toast.loading('Creating your account...', {
        description: 'This may take a few seconds.',
      });

      const resultAction = await dispatch(signup(formData));

      if (signup.fulfilled.match(resultAction)) {
        await playNotificationSound();
        toast.dismiss(loadingToast);
        toast.success('Welcome aboard!', {
          description: 'Your account has been created successfully.',
          action: {
            label: 'Go to Dashboard',
            onClick: () => router.push('/dashboard'),
          },
        });
        router.push('/');
      } else {
        throw new Error(resultAction.error?.message || 'Registration failed');
      }
    } catch (error) {
      await playNotificationSound();
      toast.dismiss(toast.loading());
      toast.error('Registration Error', {
        description: error.message || 'Please check your information and try again.',
        action: {
          label: 'Retry',
          onClick: () => handleSubmit(e),
        },
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#E8E4D9] flex flex-col items-center justify-start py-7 manrope">
      <div className="relative sm:pt-0 py-13 flex flex-col justify-center items-center w-full max-w-[70vh] px-4">
        <div className="h-30 w-px bg-[#0f1210] opacity-20 mx-auto" />
        <h1 className="melodrama md:text-7xl sm:text-6xl text-5xl font-semibold text-center py-5">signup</h1>
        <p className="text-sm text-center text-gray-700 pb-7">
          Join our community! Fill in your details to get started.
        </p>

        <ImageUploader
          defaultImageComponent={<CustomAvatar />}
          onImageSelect={setImage}
        />

        <form onSubmit={handleSubmit} className="space-y-4 mt-6 w-full">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              placeholder="First Name*"
              required
            />
            <InputField
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              placeholder="Last Name*"
              required
            />
          </div>

          <InputField
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Email*"
            required
          />

          <PasswordInput
            ref={passwordRef}
            name="password"
            value={user.password}
            onChange={handleChange}
            showPassword={showPassword}
            onToggleVisibility={togglePasswordVisibility}
            placeholder="Password (min 8 chars)*"
            minLength={8}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="street"
              value={user.street}
              onChange={handleChange}
              placeholder="Street"
            />
            <InputField
              name="city"
              value={user.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="zipCode"
              value={user.zipCode}
              onChange={handleChange}
              placeholder="Zip Code"
            />
            <InputField
              name="country"
              value={user.country}
              onChange={handleChange}
              placeholder="Country"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="phone"
              value={user.phone}
              onChange={handleChange}
              placeholder="Phone No*"
              required
            />
            <Dropdown
              items={ROLE_OPTIONS}
              name="role"
              value={user.role}
              onChange={handleChange}
            />
          </div>

          <CheckboxInput
            id="remember"
            checked={user.isVerified}
            onChange={handleCheckboxChange}
            label="Verified"
          />

          <SubmitButton />
        </form>

        <LoginLink />
      </div>
    </div>
  );
}

// Extracted components for better reusability
const InputField = React.memo(({ type = 'text', ...props }) => (
  <input
    type={type}
    className="w-full p-3 py-5 bg-[#0f12100e] rounded-lg border-none text-[#0f1210] outline-none focus:outline-none focus:bg-[#0f12101e]"
    {...props}
  />
));

const PasswordInput = React.forwardRef(({ 
  showPassword, 
  onToggleVisibility, 
  ...props 
}, ref) => (
  <div className="relative">
    <input
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      className="w-full p-3 py-5 bg-[#0f12100e] rounded-lg border-none text-[#0f1210] outline-none focus:outline-none focus:bg-[#0f12101e] pr-12"
      {...props}
    />
    <button
      type="button"
      onClick={onToggleVisibility}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? (
        <FaEye className="h-5 w-5 cursor-pointer" />
      ) : (
        <FaEyeSlash className="h-5 w-5 cursor-pointer" />
      )}
    </button>
  </div>
));

const CheckboxInput = ({ id, checked, onChange, label }) => (
  <div className="flex items-start mb-5">
    <div className="flex items-center h-5">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`${FormCSS.customCheckbox} w-4 h-4 border border-[#0f1210] rounded-sm`}
      />
    </div>
    <label htmlFor={id} className="ms-2 text-sm font-semibold text-[#0f1210]">
      {label}
    </label>
  </div>
);

const SubmitButton = () => (
  <motion.button
    initial={{ background: '#0f1210', scale: 1 }}
    whileHover={{ background: '#0f1210ec' }}
    whileTap={{ background: '#0f1210', scale: 0.9 }}
    transition={{ duration: 0.2 }}
    type="submit"
    className="w-full py-4 px-6 mb-7 text-white rounded-lg font-semibold cursor-pointer"
  >
    Sign Up
  </motion.button>
);

const LoginLink = () => (
  <div className="flex justify-start items-start w-full">
    <p className="text-center text-sm ms-2">
      Already have an account?{' '}
      <Link href="/" className="text-[#0f1210] font-black hover:underline">
        Login
      </Link>
    </p>
  </div>
);

export default React.memo(Signup1);