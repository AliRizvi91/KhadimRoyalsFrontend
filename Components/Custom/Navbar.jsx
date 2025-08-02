"use client"
import React, { useEffect, useState, useCallback } from 'react'
import { motion, useAnimate, stagger } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'
import { useDispatch, useSelector } from 'react-redux'
import { MdTrolley } from "react-icons/md";
import Link from 'next/link'

// Component
import MenuIcons from '../Utilities/MenuIcons'
import Container from './Container'
import BorderedAvatar from './BorderedAvatar'
import DrawerComponent from './Drawer'
import ClickPopopComponent from './ClickPopopComponent'
import AuthModal from './AuthModal'
import { useParams } from 'next/navigation'





const Navbar = () => {
  const [scope, animate] = useAnimate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [isColorBend, setIsColorBlend] = useState(true);
  const [activeItem, setActiveItem] = useState(null)
  const { lang } = useParams()
  const { user, ModalOfAuth } = useSelector((state) => state.StoreOfUser) || {}

  const isLg = useMediaQuery({ query: '(min-width: 1024px)' })
  const isSm = useMediaQuery({ query: '(min-width: 640px)' })

  const NAV_ITEMS = ['Home', 'Apartment', 'Experience', 'Contact']
  const FOOTER_ITEMS = ['book now', 'privacy', 'cookies']
  const NAV_IMAGES = Array(8).fill('/assets/Images/SignUp1.webp')

  const navItemVariants = {
    initial: { y: 0, opacity: 0, transition: { duration: 0.5 } },
    hover: {
      y: isLg ? -106 : (isSm ? -68 : -53),
      transition: { duration: 0.5 }
    },
  }


  useEffect(() => {
    setIsColorBlend(!isOpen);
  }, [isOpen]);

  const navItemsmallVariants = {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { y: -24, transition: { duration: 0.4 } }
  }

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  useEffect(() => {
    const runAnimations = async () => {
      if (isMenuOpen) {
        await Promise.all([
          animate(scope.current.querySelector(".nav-container"), {
            y: 0,
            borderEndEndRadius: "0rem",
            borderEndStartRadius: "0rem"
          }, { duration: 0.8, ease: [0.12, 0.9, 0.3, 1] }),

          animate(".NavSlide",
            { opacity: 1, scale: 1 },
            { duration: 0.8, delay: stagger(0.04, { startDelay: 0.2 }) }
          ),

          animate(".nav-link",
            { y: 0, opacity: 1 },
            { duration: 0.8, delay: stagger(0.04, { startDelay: 0.2 }) }
          )
        ])
      } else {
        await Promise.all([
          animate(scope.current.querySelector(".nav-container"),
            {
              y: '-100vh',
              borderEndEndRadius: "2rem",
              borderEndStartRadius: "2rem"
            },
            {
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }
          ),

          animate(".NavSlide",
            { opacity: 0, scale: 1.3 },
            { duration: 0.8 }
          ),

          animate(".nav-link",
            { y: -100, opacity: 0 },
            { duration: 0.8 }
          )
        ])
      }
    }

    runAnimations()
  }, [isMenuOpen, animate, scope])

  const avatarPath = user?.image

  return (
    <div ref={scope} className="relative">
      <div className={`relative w-full h-fit`}>
        <div className={`fixed top-0 z-50 w-full flex justify-between items-center text-white pb-1 pt-7 px-5 ${isColorBend ? 'mix-blend-difference' : 'text-black bg-[#E8E4D9]'}`}>
          <Link
            href="/"
            className="uppercase manrope sm:text-3xl text-2xl font-extrabold"
          >
            Khadim<span className='sm:text-[12px] text-[10px]'>Royals</span>.
          </Link>

          <div className="flex items-center sm:gap-3 gap-1">
            <DrawerComponent openButton={<MdTrolley className='w-8 h-8 mx-1 relative top-1' />} isOpen={isOpen} setIsOpen={setIsOpen} />
            <MenuIcons onClick={toggleMenu} isOpen={isMenuOpen} />
            <ClickPopopComponent />
          </div>
        </div>

        <div className="absolute inset-0 flex justify-end items-center w-full h-[6rem]">
          <div className={`pointer-events-auto relative ${lang === 'ar' ? 'sm:-right-38 -right-34' : 'sm:right-38 right-34'} cursor-pointer`}>
            <BorderedAvatar path={avatarPath} />
            <span className='relative z-500'>
              {ModalOfAuth && <AuthModal />}
            </span>
          </div>
        </div>
      </div>

      {/* Fullscreen Navigation */}
      <motion.div
        className="nav-container fixed top-0 left-0 w-full h-screen bg-[#18120c] text-white z-40 rounded-none"
        initial={{ y: '-100vh' }}
      >
        <Container className="flex sm:flex-row flex-col justify-between sm:items-center items-start h-full">

          {/* Left Navigation Links */}
          <div className="flex flex-col justify-between items-start h-full sm:py-40 pt-[8rem] w-1/3">
            <div className="flex flex-col space-y-3 lg:text-8xl sm:text-6xl text-5xl font-thin">
              {NAV_ITEMS.map((item) => (
                <div key={item} className={`overflow-hidden lg:h-[6rem] sm:h-[4rem] h-[3rem] w-fit pb-1`}>
                  <motion.div
                    className="nav-link"
                    initial={"initial"}
                    whileHover={activeItem === item ? 'hover' : 'hover'}
                    onHoverStart={() => setActiveItem(item)}
                    onHoverEnd={() => setActiveItem(null)}
                    whileTap="hover"
                    variants={navItemVariants}
                  >
                    <a href={``} className='text-white block'>{item}</a>
                    <a href={`/${item.toLowerCase()}`} className='text-white block'>{item}</a>
                  </motion.div>
                </div>
              ))}
            </div>
            <p className='manrope sm:text-[14px] text-[8px] font-thin sm:pt-0 pt-1 sm:ps-0 ps-1'>© 2025 All rights reserved.</p>
          </div>

          {/* Middle Image Slider */}
          <div className="md:flex flex-col justify-center items-center h-full w-1/3 relative overflow-hidden hidden">
            <div className="absolute top-0 left-0 right-0 h-20 z-10 bg-gradient-to-b from-[#18120c] to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-40 z-10 bg-gradient-to-t from-[#18120c] to-transparent pointer-events-none" />

            <motion.div
              animate={{ y: ["0%", "-100%"] }}
              transition={{ duration: 60, ease: "linear", repeat: Infinity }}
              className="flex flex-col"
            >
              {[...NAV_IMAGES, ...NAV_IMAGES].map((image, index) => (
                <motion.div
                  key={`nav-img-${index}`}
                  className="NavSlide xl:h-90 xl:w-90 md:w-60 md:h-60 rounded-4xl my-2 flex justify-center bg-[#18120c]"
                  initial={{ opacity: 0, scale: 1.5 }}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover rounded-4xl"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Contact Info */}
          <div className="flex flex-col justify-between items-start h-full sm:py-40 py-11 w-1/3 manrope">
            <div>
              <div className="sm:text-[21px] text-[14px] py-1">
                <p className='font-thin opacity-60 pb-0'>mail</p>
                <p className='font-normal'>attaraliraza4@gmail.com</p>
              </div>
              <div className="sm:text-[21px] text-[14px] py-1">
                <p className='font-thin opacity-60 pb-0'>Phone</p>
                <p className='font-normal'>0328-4963623</p>
              </div>
              <div className="sm:text-[21px] text-[14px] py-1">
                <p className='font-thin opacity-60 pb-0'>Social</p>
                <p className='font-normal'>Instagram</p>
                <p className='font-normal'>facebook</p>
              </div>
            </div>

            <div className="md:w-22 md:h-22 w-16 h-16 sm:block hidden">
              <img
                src="/assets/Images/KRLogo.webp"
                alt="Logo"
                className='w-full'
                loading="lazy"
              />
            </div>

            <div className="sm:flex sm:flex-col flex-row sm:space-y-2 space-x-2 opacity-60 hidden">
              {FOOTER_ITEMS.map((item) => (
                <motion.div
                  key={item}
                  className="overflow-hidden h-[1.5rem] w-fit pb-1"
                >
                  <motion.div
                    whileHover="hover"
                    initial="initial"
                    animate="animate"
                    variants={navItemsmallVariants}
                    className="nav-link">
                    <a
                      href="#"
                      className='text-white block'
                      onClick={(e) => e.preventDefault()}
                    >
                      {item}
                    </a>
                    <a
                      href="#"
                      className='text-white block'
                      onClick={(e) => e.preventDefault()}
                    >
                      {item}
                    </a>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </motion.div>
    </div>
  )
}

export default Navbar