"use client"
import { motion } from "framer-motion";
import RoomTypeContainer from "./RoomTypeContainer";
import { RiGalleryView2 } from "react-icons/ri";
import { useParams, useRouter } from "next/navigation";

const MasonryGallery = ({galleryImages}) => {
  const router = useRouter();
  const { ID } = useParams();

  const handleGallery = () => {
    router.push(`/roomDetails/${ID}`);
  };

  return (
    <RoomTypeContainer className="pb-6">
      {galleryImages &&
      <motion.div 
  initial={{ opacity: 0}}
  whileInView={{ opacity: 1}}
  viewport={{ once: true }}
  transition={{ duration: 1.2 }}
  className="md:h-[64vh] h-full w-full flex justify-center items-center px-auto md:my-20 my-10"
>
        <div className="grid md:grid-cols-[60%_40%] grid-cols-1 lg:gap-2 gap-1 h-full">
          {/* Left side - large image */}
          <div className="relative">
            <div className="w-full h-[64vh] overflow-hidden">
              <img
                className={`w-full h-full`}
                src={galleryImages[0]}
                alt={galleryImages[0]}
                loading="lazy"
              />

              {/* Overlay button */}
              <div className="absolute inset-0 flex items-end justify-start m-5 transition-all duration-300 md:rounded-l-4xl md:rounded-t-none rounded-t-4xl">
                <motion.button 
                  onClick={handleGallery} 
                  className="backdrop-blur-md bg-white/60 hover:bg-white/70 cursor-pointer uppercase py-5 px-6 manrope rounded-full text-[15px] font-medium flex items-center gap-2 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RiGalleryView2 className="text-xl me-1" />
                  <span>see photos</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right side - grid of smaller images */}
          <div className="grid grid-cols-2 lg:gap-2 gap-1 justify-items-end overflow-hidden">
            {galleryImages.slice(1, 5).map((image, index) => (
              <motion.div
               key={index} className="w-full h-full overflow-hidden">
                <img
                  className={`w-full h-full`}
                  src={image}
                  alt={image}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
}
    </RoomTypeContainer>
  );
};

export default MasonryGallery;