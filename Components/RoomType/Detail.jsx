"use client"
import React from 'react'
import RoomTypeContainer from './RoomTypeContainer'

const Detail = ({ roomDtailData }) => {
  // Calculate border radius classes outside the map function
  const getBorderRadiusClass = (index, arrayLength) => {
    return [
      index === 0 ? 'rounded-l-3xl' : '',
      index === arrayLength - 1 ? 'rounded-r-2xl' : ''
    ].join(' ')
  }

  return (
    <RoomTypeContainer>
      <div className="relative flex justify-center items-center lg:text-3xl text-[23px] manrope font-normal xl:w-[75vh] lg:w-[58vh] md:w-[37vh] w-[10vh] mx-auto pb-10">
        {roomDtailData.map((item, index) => (
          <RoomDetailItem 
            key={item._id}
            item={item}
            borderRadiusClass={getBorderRadiusClass(index, roomDtailData.length)}
          />
        ))}
      </div>
    </RoomTypeContainer>
  )
}

// Extracted component for better readability and reusability
const RoomDetailItem = ({ item, borderRadiusClass }) => (
  <div 
    className={`flex flex-col justify-center items-center w-full h-full 
      border-[1px] border-[#18120c57] px-[16%] py-5 ${borderRadiusClass}`}
  >
    <span>{item.number}</span>
    <p className='sm:text-[15px] text-[12px]'>{item.name}</p>
  </div>
)

export default React.memo(Detail)