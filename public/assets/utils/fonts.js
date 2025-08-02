// utils/fonts.js
import { Manrope, Melodrama } from 'next/font/google';

export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const melodrama = Melodrama({
  subsets: ['latin'],
  variable: '--font-melodrama',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});