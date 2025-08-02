'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import { GiPowerButton } from "react-icons/gi";
import { logout, setAuthModal } from '@/RTK/Slices/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import LanguageSwitcher from './LanguageSwitcher';
import { useParams, useRouter } from 'next/navigation';
import { SiPhpmyadmin } from "react-icons/si";

export default function ClickPopoverComponent({ children, title, content }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    const [isDashBoardLoading, setIsDashboardLoading] = useState(false);
    const router = useRouter()
    const popoverRef = useRef(null);
    const buttonRef = useRef(null);
    const {user} = useSelector((state)=> state.StoreOfUser)
    const dispatch = useDispatch();
    const { lang } = useParams()
    const CurrentURL = `${process.env.NEXT_PUBLIC_FRONTEND_BASEURL}/${lang}`

    const modalState = useSelector(state => state.StoreOfUser.ModalOfAuth); // Get current modal state

    const handleClickOutside = useCallback((event) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target) &&
            buttonRef.current && !buttonRef.current.contains(event.target)) {
            setIsVisible(false);
        }
    }, []);

    const toggleVisibility = useCallback(() => {
        const newVisibility = !isVisible;
        setIsVisible(newVisibility);

        if (newVisibility) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isVisible, handleClickOutside]);

    const handleLogout = useCallback(async () => {
        try {
            setIsLogoutLoading(true);
            await dispatch(logout());
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        } finally {
            setIsLogoutLoading(false);
        }
    }, [dispatch]);

    const handleOpenAuthModal = useCallback(() => {
        // Explicitly set to the opposite of current modal state
        dispatch(setAuthModal(!modalState));
        setIsVisible(false); // Close the popover
    }, [dispatch, modalState]); // Add modalState to dependencies

    const handleAdminDashboard = useCallback(() => {
        router.push('/dashboard')
        setIsDashboardLoading(true); // Close the popover
    }, [isDashBoardLoading]); // Add modalState to dependencies


    return (
        <div className="relative inline-block z-600">
            <button
                ref={buttonRef}
                type="button"
                onClick={toggleVisibility}
                className="focus:outline-none"
                aria-expanded={isVisible}
                aria-haspopup="true"
            >
                {children}
            </button>

            <motion.div
                ref={popoverRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : -10
                }}
                transition={{ duration: 0.2 }}
                className={`absolute z-10 w-64 text-sm text-center text-white bg-gradient-to-tr from-black to-[#474747] shadow-[#3d3d3d] p-3 rounded-lg shadow-sm ${!isVisible && 'pointer-events-none'}`}
                style={{ top: '100%', left: '-270%', transform: 'translateX(-50%)', marginTop: '0.5rem' }}
                role="dialog"
                aria-hidden={!isVisible}
            >
                <div className="w-full h-full flex flex-col gap-5">

                    <div className="flex flex-col justify-center items-center gap-2">
                        <h3 className='uppercase font-semibold manrope'>Languages</h3>
                        {CurrentURL ? (<LanguageSwitcher />) : ''}
                        <p className='text-[11px] text-white manrope'>The language change functionality is currently applied only to the Home components and not the entire website due to specific requirements.</p>
                    </div>

                    <div className="absolute w-2 h-2 bg-[#18120c] border-t border-l border-gray-200 transform rotate-45 -top-1 left-1/2 -translate-x-1/2"></div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center gap-2">
                            <motion.button
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.050 }}
                                onClick={handleOpenAuthModal}
                                className="flex justify-center items-center gap-1 w-full py-4 px-4 my-1 text-[11px] text-white rounded-lg font-extrabold cursor-pointer shadow-2xs hover: manrope uppercase bg-gradient-to-tr from-black to-[#3d3d3d] shadow-[#2a7a42]"
                            >
                                <GiPowerButton className='w-4 h-4 fill-green-700 stroke-[20px] stroke-green-400' />
                                Sign In
                            </motion.button>

                            <motion.button
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.050 }}
                                disabled={isLogoutLoading}
                                onClick={handleLogout}
                                className="flex justify-center items-center gap-1 w-full py-4 px-4 my-1 text-[11px] text-white rounded-lg font-extrabold cursor-pointer shadow-2xs manrope uppercase bg-gradient-to-tr from-black to-[#3d3d3d] shadow-[#772b2b] disabled:opacity-70"
                            >
                                <GiPowerButton className="w-4 h-4 fill-red-700 stroke-[20px] stroke-red-500" />
                                {isLogoutLoading ? '...' : 'Sign out'}
                            </motion.button>
                        </div>

                        {user?._id === '6870a0fbcf4c4e535ce2d4df' ? (
                        <motion.button
                            key="logout"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.050 }}
                            disabled={isDashBoardLoading}
                            onClick={handleAdminDashboard}
                            className="flex justify-center items-center gap-1 w-full py-4 px-4 text-[14px] rounded-sm border-0 select-none cursor-pointer manrope font-extrabold uppercase"
                            style={{
                                color: "#333",
                                background: "radial-gradient(93% 87% at 87% 89%, rgba(0, 0, 0, 0.1) 0%, transparent 86.18%), radial-gradient(66% 66% at 26% 20%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 69.79%, rgba(255, 255, 255, 0) 100%)",
                                backgroundColor: "#E8E4D9",
                                boxShadow: "inset -3px -3px 9px rgba(255, 255, 255, 0.5), inset 0px 3px 9px rgba(255, 255, 255, 0.4), inset 0px 1px 1px rgba(255, 255, 255, 0.8), inset 0px -8px 36px rgba(0, 0, 0, 0.1), inset 0px 1px 5px rgba(255, 255, 255, 0.8), 2px 19px 31px rgba(0, 0, 0, 0.1)"
                            }}
                        >
                            <SiPhpmyadmin className="w-6 h-6 " />
                            {isDashBoardLoading ? '...' : 'DashBoard'}
                        </motion.button>
                        ): ''}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}