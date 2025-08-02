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
    process.env.NEXT_PUBLIC_FRONTEND_BASEURL || 'http://localhost:3000'
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
    <html 
      lang={lang} 
      dir={direction}
      className={`${manrope.variable} ${melodrama.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <ClientLayoutHome params={lang}>
          {children}
        </ClientLayoutHome>
      </body>
    </html>
  );
}