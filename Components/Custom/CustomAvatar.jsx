import React from 'react'

// Icons
import { RiUser6Fill } from "react-icons/ri";

function CustomAvatar() {
  return (
    <>
      <div className="relative w-full h-full rounded-full">
        {/* Gradient border */}
        <div className="absolute inset-0 rounded-full p-[3px] bg-gradient-to-br from-white to-transparent">
          {/* Inner circle with custom shadow */}
          <div className="bg-[#E8E4D9] w-full h-full rounded-full flex flex-col justify-center items-center shadow-[2px_5px_15px_rgba(0,0,0,0.2)]">
            <RiUser6Fill className="w-full h-full fill-[#0f1210]/90 hover:fill-[#0f1210c4] transition-colors p-10" />
          </div>
        </div>
      </div>
    </>
  )
}

export default CustomAvatar