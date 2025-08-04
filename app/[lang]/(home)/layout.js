import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { locales } from '@/src/i18n/config';
// Components
import ClientLayoutHome from '@/Components/Main/ClientLayoutHome';
import { melodrama, manrope } from '@/Components/Utilities/Fonts/fonts';

// Css
import '../../globals.css'

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export const metadata = {
  title: 'Khadim Royals',
  description: 'Luxury hotel experience with premium services',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_FRONTEND_BASEURL 
  ),
  openGraph: {
    title: 'Khadim Royals',
    description: 'Luxury hotel experience with premium services',
    images: '/opengraph-image.jpg',
  },
};

export default function RootLayout({ children, params }) {
  const { lang } = params;
  const direction = lang === 'ar' ? 'rtl' : 'ltr';           
  
  return (
    // Remove the <html> and <body> tags - Next.js provides them automatically
    <div className={`${manrope.variable} ${melodrama.variable} min-h-screen flex flex-col`} dir={direction}>
      <ClientLayoutHome params={lang}>
        {children}
      </ClientLayoutHome>
    </div>
  );
}
