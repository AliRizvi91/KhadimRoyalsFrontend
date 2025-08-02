import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoCloseSharp } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/RTK/Thunks/UserThunks';
import { setAuthModal } from '@/RTK/Slices/UserSlice';
import GoogleLoginButton from '../OAuth/GoogleLoginButton';
import FormCSS from '@/CSS/Form.module.css';

const AuthModal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { ModalOfAuth } = useSelector((state) => state.StoreOfUser);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rememberMe) return toast.info('Please confirm "Remember me"');
    if (password.length < 8) return toast.info('Password must have at least 8 characters');

    setIsLoading(true);
    try {
      await dispatch(login({ email, password }));
      dispatch(setAuthModal(false));
      toast.success('Logged in successfully!');
      window.location.href = '/';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdrop = () => dispatch(setAuthModal(false));
  
  const handleNavigation = useCallback(async (e, path) => {
    e.preventDefault();
    setIsNavigating(true);
    dispatch(setAuthModal(false));
    
    // Wait a brief moment to allow the loading indicator to show
    await new Promise(resolve => setTimeout(resolve, 100));
    
    router.push(path);
  }, [dispatch, router]);


  return (
    <>
      {/* Navigation Loading Overlay - now shown when isNavigating is true */}
      {isNavigating && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#e8e4d98f] bg-opacity-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 border-4 border-black border-t-transparent rounded-full"
          />
        </div>
      )}

      <AnimatePresence>
        {ModalOfAuth && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0000009a]"
              onClick={handleBackdrop}
            />

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative w-full max-w-md"
            >
              <div className="relative bg-[#E8E4D9] text-black rounded-lg shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 md:p-5 border-b rounded-t border-[#00000096]">
                  <div className="flex flex-col justify-center items-start h-full">
                    <h3 className="text-2xl font-semibold text-gray-900">Login in</h3>
                    <p className='manrope text-[12px]'>into your account?</p>
                  </div>
                  <button
                    type="button"
                    className="end-2.5 text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                    onClick={handleBackdrop}
                  >
                    <IoCloseSharp className="w-6 h-6" />
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                <div className="p-4 md:p-5">
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="email" className="block mb-1 text-[17px] font-medium text-gray-900">Your email</label>
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email*"
                        required
                        className="w-full p-2 py-3 bg-[#0f12100e] rounded-lg border-none text-[16px] text-[#0f1210] outline-none focus:outline-none focus:bg-[#0f12101e] manrope"
                      />
                    </div>
                    <PasswordInput
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password (min 8 chars)*"
                      minLength={8}
                      required
                    />
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="remember"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className={`${FormCSS.customCheckbox} w-4 h-4 border border-[#0f1210] rounded-sm`}
                          />
                        </div>
                        <label htmlFor="remember" className="ms-2 text-sm font-semibold text-[#0f1210]">
                          Remember me
                        </label>
                      </div>
                      <Link 
                        href="/resetpassword-email"
                        onClick={(e) => handleNavigation(e, '/resetpassword-email')}
                        className="text-sm text-[#a37648] hover:underline manrope font-semibold"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <motion.button
                      initial={{ background: '#0f1210', scale: 1 }}
                      whileHover={{ background: '#0f1210ec' }}
                      whileTap={{ background: '#0f1210', scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 px-6 my-5 text-white rounded-lg font-semibold cursor-pointer flex items-center justify-center ${isLoading ? 'opacity-70' : ''}`}
                    >
                      {isLoading ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Signing In...
                        </>
                      ) : 'Sign In'}
                    </motion.button>
                    <div className="w-full flex justify-center items-center">
                      <div className="manrope font-semibold text-sm">
                        New to KhadimRoyals?{' '}
                        <Link 
                          href="/signup" 
                          onClick={(e) => handleNavigation(e, '/signup')}
                          className="text-[#a37648] font-semibold hover:underline"
                        >
                          Create account
                        </Link>
                      </div>
                    </div>
                  </form>
                  
                  <div className="flex justify-center items-center my-4 h-full">
                    <div className="w-full h-[1px] bg-[#000000bb]"></div>
                    <p className='px-5'>OR</p>
                    <div className="w-full h-[1px] bg-[#000000bb]"></div>
                  </div>

                  <GoogleLoginButton />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const PasswordInput = memo(({ name, value, onChange, placeholder, required, minLength }) => {
  const inputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  return (
    <div>
      <label htmlFor="password" className="block mb-1 text-[17px] font-medium text-gray-900 manrope">Your password</label>
      <div className="relative">
        <input
          ref={inputRef}
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className="w-full p-2 py-3 bg-[#0f12100e] rounded-lg border-none text-[#0f1210] text-[16px] outline-none focus:outline-none focus:bg-[#0f12101e] pr-12 manrope"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <FaEye className='h-5 w-5 cursor-pointer text-gray-600' />
          ) : (
            <FaEyeSlash className='h-5 w-5 cursor-pointer text-gray-600' />
          )}
        </button>
      </div>
    </div>
  );
});

export default AuthModal;