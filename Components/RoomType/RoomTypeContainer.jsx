import React from 'react'

function RoomTypeContainer({children,className}) {
  return (
     <div className={`${className} mx-auto px-3 max-w-[1400px]`}>{children}</div>
  )
}

export default RoomTypeContainer
