import React from 'react'

function Container({children,className}) {
  return (
    <>
      <div className={`${className} mx-auto px-3 max-w-[1600px]`}>{children}</div>
    </>
  )
}

export default Container
