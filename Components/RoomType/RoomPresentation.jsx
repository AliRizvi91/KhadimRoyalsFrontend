import React from 'react';
import { useSelector } from 'react-redux';
import CarouselComponent from '../Custom/CarouselComponent';

const RoomPresentation = ({ ClassicId }) => {
  const { CarouselState } = useSelector(state => state.StoreOfRoom);

  if (ClassicId !== '68552999676c10f45805a5a4') {
    return null;
  }

  const renderRoomInfo = () => (
    <div className="w-full sm:py-4 sm:px-6 py-2 px-4 bg-black text-white my-1 rounded-[10px]">
      <div className="flex justify-between items-center">
        <div className="text-start">
          <h1 className='md:text-4xl sm:text-3xl text-[19px] font-semibold'>
            Room Number: <span className='text-[#dfb84b]'>{CarouselState?.roomNumber}</span>
          </h1>
          <h1 className='md:text-4xl sm:text-3xl text-[19px] font-semibold'>
            Floor: <span className='text-[#dfb84b]'>{CarouselState?.floor}</span>
          </h1>
        </div>
        <div className="grid grid-cols-1 justify-center items-center sm:gap-3 gap-1 h-full manrope sm:text-[15px] text-[10px] sm:w-auto w-full">
          <div className="flex justify-center items-center gap-2 text-white">
            <div className="sm:h-5 sm:w-5 h-2 w-2 bg-[#bd2c00] rounded-[3px]"></div>
            <p>Occupied</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="room-presentation">
      <h1 className='md:text-[5rem] sm:text-[4rem] text-[3rem] font-semibold mb-7'>
        360 degree
      </h1>
      {renderRoomInfo()}
      <CarouselComponent />
    </div>
  );
};

export default React.memo(RoomPresentation);