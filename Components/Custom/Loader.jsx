import React from 'react'

function Loader({Text , className}) {
  return (
    <>
      <div className={` ${className} flex flex-col justify-center items-center h-[60vh] w-full bg-[#E8E4D9] `}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black mb-8"></div>
        <p className="text-2xl font-medium">{Text}</p>
      </div>
    </>
  )
}

export default Loader
