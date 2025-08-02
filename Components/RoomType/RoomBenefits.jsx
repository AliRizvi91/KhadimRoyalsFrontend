import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import { TbAlertSquareFilled } from 'react-icons/tb';
import TimelineModal from './TimeLineModal';
import CloudinarySVG from '../Custom/CloudinarySVG';

const RoomBenefits = ({ Stars, Alert, title, content }) => {
  const { TwoAmenitiesPerCategory } = useSelector(state => state.StoreOfAmenities);

  const guestFavoriteData = useMemo(() => ({
    text: "Guest Favorite",
    description: "One of the most loved homes on my website, according to guests",
    rating: Stars,
    stars: "Stars"
  }), [Stars]);

  const renderGuestFavoriteCard = () => (
    <div className="flex justify-center items-center manrope border-2 border-[#18120c48] p-6 rounded-2xl gap-2">
      <div className="flex justify-center items-end manrope font-bold w-[70%]">
        <p>{guestFavoriteData.text}</p>
        <FaCanadianMapleLeaf className='fill-[#dfb84b] text-2xl' />
      </div>
      <p className='w-full lg:text-[16px] text-[14px]'>{guestFavoriteData.description}</p>
      <div className="flex flex-col justify-center text-2xl">
        <span className='font-black'>{guestFavoriteData.rating}</span>
        <span className='font-semibold text-[15px]'>{guestFavoriteData.stars}</span>
      </div>
    </div>
  );

  const renderAlert = () => (
    Alert && Alert !== '' && (
      <div className="w-full p-4 flex justify-center items-center rounded-2xl manrope gap-5 bg-[#fd45458f]">
        <TbAlertSquareFilled className='text-[18px] opacity-90' />
        <p className='text-[18px]'>{Alert}</p>
      </div>
    )
  );

  const renderAmenitiesGrid = () => (
    <div className="flex flex-col justify-center items-center manrope border-2 border-[#18120c48] p-8 rounded-4xl w-full">
      <div className="w-full">
        {TwoAmenitiesPerCategory && Object.entries(TwoAmenitiesPerCategory).map(([category, amenities]) => (
          <div key={category} className="mb-6">
            <div className="grid grid-cols-2 justify-items-start lg:gap-12 gap-6">
              {amenities.map((amenity, index) => (
                <div key={`${category}-${index}`} className="flex items-center gap-5">
                  <div className="w-15">
                    <CloudinarySVG 
                      Icon={amenity.icon} 
                      ClassName="w-7 h-7" 
                    />
                  </div>
                  <div className="w-full">
                    <p className='xl:text-[17px] lg:text-[14px] md:text-[13px] text-[12px]'>
                      {amenity.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContentParagraphs = () => (
    <>
      {content?.para1 && (
        <p className='md:text-[24px] sm:text-[19px] text-[16px] font-light manrope mb-7'>
          {content.para1}
        </p>
      )}
      {content?.para2 && (
        <p className='md:text-[24px] sm:text-[19px] text-[16px] font-light manrope mb-7'>
          {content.para2}
        </p>
      )}
    </>
  );

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 md:gap-20 gap-10 md:pb-20 pb-10">
      {/* Left Column - Text Content */}
      <div className="flex flex-col justify-center items-center w-full md:gap-2 gap-1">
        {renderGuestFavoriteCard()}
        {renderAlert()}
        {renderAmenitiesGrid()}
        <TimelineModal ButtonText="See All Benefits" />
      </div>

      {/* Right Column - Description */}
      <div className="text-start">
        <h1 className='md:text-[5rem] sm:text-[4rem] text-[3rem] font-semibold'>
          {title}
        </h1>
        {renderContentParagraphs()}
      </div>
    </div>
  );
};

export default React.memo(RoomBenefits);