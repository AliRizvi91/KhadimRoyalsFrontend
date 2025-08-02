// ClassicPart1.js
"use client"
import React, { useMemo } from 'react'
import dynamic from 'next/dynamic';
import FadeDown from '../Utilities/FadeDown'
import ZoomIn from '../Utilities/ZoomIn';

const AnimatedText = dynamic(
  () => import('../Utilities/AnimatedText'),
  { ssr: false }
);


function ClassicPart1({image,title,description}) {


  return (
    <div className='relative w-full sm:h-screen h-full bg-[#E8E4D9] flex flex-col justify-start items-center z-10'>
      {/* Vertical divider lines - consider using CSS pseudo-elements instead */}
      <div className="w-[1px] sm:h-55 h-45 bg-[#18120c57]" />
      
      {/* Logo/Circle section */}
      <div className="w-full sm:h-[40%] h-[30%] flex items-center justify-center">
              <ZoomIn delay={0.2} duration={0.8}>
        <div className="sm:w-65 sm:h-65 w-55 h-55 rounded-full mb-3"style={{
                backgroundImage: `url("${image}")`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }} />
      </ZoomIn>
      </div>
      
      {/* Main title - using memoized content */}
      <h1 className='md:text-[6rem] sm:text-[4rem] text-[2.5rem] font-semibold'>
        <AnimatedText delay={0.5}>{title}</AnimatedText>
      </h1>
      
      {/* Description with fade effect */}
      <FadeDown duration={0.4} YAxis={4}>
        <p className='md:text-[17px] sm:text-[13px] text-[10px] manrope sm:w-[48%] w-[80%] text-center mx-auto pb-4'>
          {description}
        </p>
      </FadeDown>
      
      {/* Empty paragraph - consider removing if not needed */}
      <p className='manrope sm:w-[28%] w-[78%] text-center mx-auto pb-4' />
      
      {/* Bottom vertical divider */}
      <div className="w-[1px] sm:h-45 h-15 bg-[#18120c57]" />
    </div>
  )
}

export default React.memo(ClassicPart1)