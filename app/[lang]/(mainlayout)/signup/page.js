'use client'
import { memo } from 'react'
import dynamic from 'next/dynamic'
import Signup1 from '@/Components/Signup/Signup1'

// Dynamically import SmoothScroll with no SSR for better performance
const SmoothScroll = dynamic(
  () => import('@/Components/Utilities/SmoothScroll'),
  { 
    ssr: false,
    loading: () => null // Optional loading component
  }
)

function SignUp() {
  return (
    <SmoothScroll>
      <Signup1 />
    </SmoothScroll>
  )
}

export default memo(SignUp)