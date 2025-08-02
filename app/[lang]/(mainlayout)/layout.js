import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { melodrama, manrope } from '@/Components/Utilities/Fonts/fonts';
import '../../globals.css'
import ClientLayout from '@/Components/Main/ClientLayout';

const Navbar = dynamic(() => import('@/Components/Custom/Navbar'), {
  loading: () => null,
});

const Footer = dynamic(() => import('@/Components/Custom/Footer'), {
  loading: () => null,
});

export const metadata = {
  title: 'Khadim Royals',
  description: 'Luxury hotel experience with premium services',
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      dir="ltr"
      className={`${manrope.variable} ${melodrama.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <ClientLayout>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          {children}
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </ClientLayout>
      </body>
    </html>
  );
}