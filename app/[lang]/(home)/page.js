'use client'
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
// Components
import HomePart1 from '@/Components/Home/HomePart1';
import ChatClient from '@/Components/Home/ChatClient';

// Utilities
import SmoothScroll from '@/Components/Utilities/SmoothScroll';
import Deco from '@/Components/Home/Deco';
import Amenities from '@/Components/Home/Amenities';
import Gallery from '@/Components/Home/Gallery';

export default function Home() {
  const [isGalleryInView, setIsGalleryInView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const galleryRef = useRef(null);
  const isInView = useInView(galleryRef, {
    margin: "0px 0px -20% 0px",
    once: false
  });


  useEffect(() => {
    setIsGalleryInView(isInView);
  }, [isInView]);


  const sidebarColors = isGalleryInView
    ? { bg: 'bg-white', text: 'text-black' }
    : { bg: 'bg-black', text: 'text-white' };

  return (
    <>

      <SmoothScroll>
        <div>
          <motion.div
            className="h-[100%] mb-[100vh]"
            initial={{
              backgroundColor: "#E8E4D9",
              color: "#000"
            }}
            animate={{
              backgroundColor: isGalleryInView ? "#000" : "#E8E4D9",
              color: isGalleryInView ? "#E8E4D9" : "#000",
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <section>

              {/* ChatBar */}
              <div className='fixed h-screen flex justify-center items-end right-7 z-10'>
                <motion.div className={`relative bottom-12 cursor-pointer shadow-2xs`}>
                  <ChatClient />
                </motion.div>
              </div>

              <HomePart1 />
              <Deco />
              <div ref={galleryRef}>
                <Gallery />
              </div>

              <Amenities ColorChange={isGalleryInView} />

            </section>
          </motion.div>

        </div>
      </SmoothScroll>
    </>
  );
}