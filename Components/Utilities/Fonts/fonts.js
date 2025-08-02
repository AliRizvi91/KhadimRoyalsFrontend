// utils/fonts.js
import { Manrope } from 'next/font/google';
import localFont from 'next/font/local';


// Manrope (local font)
export const manrope = localFont({
  src: [
    {
      path: '../../../public/fonts/manrope/Manrope-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/manrope/Manrope-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/manrope/Manrope-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/manrope/Manrope-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/manrope/Manrope-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/manrope/Manrope-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/manrope/Manrope-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-manrope',
  display: 'swap',
});

// For Melodrama (local font)
export const melodrama = localFont({
  src: [
    {
      path: '../../../public/fonts/melodrama/Melodrama-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/melodrama/Melodrama-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/melodrama/Melodrama-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/melodrama/Melodrama-Semibold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/melodrama/Melodrama-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-melodrama',
  display: 'swap',
});