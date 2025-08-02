"use client"
import { motion } from 'framer-motion'
import React, { useMemo } from 'react'

const FOOTER_ITEMS = ['experiences', 'book now', 'privacy', 'cookies', 'contact']
const CONTACT_INFO = {
  mail: 'abcdefg@gmail.com',
  phone: '0328-4963623',
  social: ['Instagram', 'Facebook']
}
const APARTMENT_TYPES = ['classic', 'mini']

const Footer = () => {
  const navItemsmallVariants = {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { y: -24, transition: { duration: 0.4 } }
  }

  // Memoize the repeated text to avoid recreating it on every render
  const NAV_TEXT = useMemo(() => (
    <h1 className='text-[7rem] font-extrabold manrope'>
      <span className='uppercase melodrama text-[11rem]'>Khadim</span>
      <span className='text-7xl -ms-2 uppercase melodrama'>Royals –</span>
      <span className='text-[#ffffffc2]'>A Sanctuary of Luxury, Reflecting the Grace of Islamic Hospitality.</span>
    </h1>
  ), [])

  const scrollingTexts = useMemo(() => 
    Array(16).fill(NAV_TEXT), [NAV_TEXT]
  )

  return (
    <div className="fixed px-5 bottom-0 w-full h-[100vh] bg-black text-[#E8E4D9] -z-100">
      <div className="w-full h-full flex justify-start items-start sm:pt-50 pt-20">
        <div className="flex sm:flex-row flex-col justify-center items-start md:gap-30 gap-10 manrope">
          <div className="flex flex-row justify-center items-start md:gap-30 gap-10">
            {/* Contact Information */}
            <div>
              <ContactItem label="mail" value={CONTACT_INFO.mail} />
              <ContactItem label="Phone" value={CONTACT_INFO.phone} />
              <div className="sm:text-[17px] text-[14px] py-1">
                <p className='font-thin opacity-60 pb-0'>Social</p>
                {CONTACT_INFO.social.map(platform => (
                  <p key={platform} className='font-normal'>{platform}</p>
                ))}
              </div>
            </div>

            {/* Apartment Types */}
            <div className="flex flex-col justify-start items-start sm:text-[17px] mb-5 text-[14px] py-1">
              <p className='font-thin opacity-60 mb-4'>apartments</p>
              {APARTMENT_TYPES.map(type => (
                <Button key={type} text={type} isFirst={type === APARTMENT_TYPES[0]} />
              ))}
            </div>
          </div>

          {/* Footer Navigation Links */}
          <div className="sm:flex sm:flex-col flex-row sm:space-y-2 space-x-2 hidden">
            {FOOTER_ITEMS.map(item => (
              <FooterLink 
                key={item} 
                item={item} 
                variants={navItemsmallVariants} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scrolling text section */}
      <ScrollingText texts={scrollingTexts} />
    </div>
  )
}

// Extracted components for better readability and reusability
const ContactItem = ({ label, value }) => (
  <div className="sm:text-[17px] text-[14px] py-1">
    <p className='font-thin opacity-60 pb-0'>{label}</p>
    <p className='font-normal'>{value}</p>
  </div>
)

const Button = ({ text, isFirst }) => (
  <button className={`${isFirst ? 'uppercase' : ''} rounded-full h-10 w-30 border-[1px] my-1 text-[13px] border-[#E8E4D9]`}>
    {text}
  </button>
)

const FooterLink = ({ item, variants }) => (
  <motion.div className="overflow-hidden h-[1.5rem] w-fit pb-1">
    <motion.div
      whileHover="hover"
      initial="initial"
      animate="animate"
      variants={variants}
      className="nav-link"
    >
      {Array(2).fill().map((_, i) => (
        <a 
          key={i}
          href="#" 
          className='text-white block'
          onClick={(e) => e.preventDefault()}
        >
          {item}
        </a>
      ))}
    </motion.div>
  </motion.div>
)

const ScrollingText = ({ texts }) => (
  <div className="absolute bottom-15 w-full overflow-hidden">
    <div className="relative">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-black to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-black to-transparent" />
      
      {/* Scrolling text */}
      <motion.div
        animate={{ x: ["100%", "-100%"] }}
        transition={{ duration: 24, ease: "linear", repeat: Infinity }}
        className="flex flex-row whitespace-nowrap py-4"
      >
        {texts.map((text, index) => (
          <motion.div
            key={`nav-text-${index}`}
            className="inline-block px-8 text-[#E8E4D9]"
          >
            {text}
          </motion.div>
        ))}
      </motion.div>
    </div>
    
    {/* Copyright */}
    <div className="relative flex justify-between items-center w-full -z-10">
      <div className="manrope text-[13px]">© 2025 All rights reserved.</div>
      <div className="mr-10"></div>
    </div>
  </div>
)

export default React.memo(Footer)