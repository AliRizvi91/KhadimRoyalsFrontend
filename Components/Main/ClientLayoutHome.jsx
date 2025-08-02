'use client';

import '@/app/globals.css';
import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import ReduxProvider from '@/Components/ReduxComponents/ReduxProvider';
import Loading from '@/Components/Custom/Loading';
import AuthenticateUser from './AuthenticateUser';
import { OAuthGoogleProvider } from '../OAuth/OAuthGoogleProvider';
import { NextIntlClientProvider } from 'next-intl';

// Dynamically import CustomCursor with optimized settings
const CustomCursor = dynamic(() => import('@/Components/Utilities/CustomCursor'), {
  ssr: false,
  loading: () => null,
});

import Navbar from "@/Components/Custom/Navbar";

const Footer = dynamic(() => import('@/Components/Custom/Footer'), {
  loading: () => null,
});

export default function ClientLayoutHome({ children, params }) {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    // Load messages for the current locale
    async function loadMessages() {
      try {
        const loadedMessages = await import(`@/src/i18n/locales/${params}.json`);
        setMessages(loadedMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Fallback to default messages if needed
        const defaultMessages = await import('@/src/i18n/locales/en.json');
        setMessages(defaultMessages);
      }
    }

    loadMessages();

    // Optimize loading check
    if (document.readyState === 'complete') {
      setIsLoading(false);
    } else {
      const handleLoad = () => setIsLoading(false);
      window.addEventListener('load', handleLoad, { once: true });
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [params]);

  if (!messages) {
    return <Loading className="fixed inset-0 z-50 bg-black flex items-center justify-center" />;
  }

  return (
    <ReduxProvider>
      <OAuthGoogleProvider>
        <NextIntlClientProvider locale={params} messages={messages}>
          <AuthenticateUser>
            {isLoading ? (
              <Loading className="fixed inset-0 z-50 bg-black flex items-center justify-center" />
            ) : (
              <div className="transition-opacity duration-200 opacity-100 relative z-10" aria-busy={false}>
                <main className="flex-grow">
                  <Suspense fallback={null}>
                    <Navbar />
                  </Suspense>
                  {children}
                  <Suspense fallback={null}>
                    <Footer />
                  </Suspense>
                </main>
                <Suspense fallback={null}>
                  <CustomCursor />
                </Suspense>
                <Toaster
                  position="bottom-left"
                  theme="dark"
                  richColors
                  closeButton
                  toastOptions={{
                    duration: 9000,
                    classNames: {
                      toast: 'bg-black font-sans text-sm text-white border border-gray-800',
                      title: 'text-white',
                      description: 'text-gray-300',
                      actionButton: 'bg-white text-black',
                      closeButton: 'text-black hover:text-white bg-gray-100 hover:bg-gray-700 border-none',
                    },
                  }}
                />
              </div>
            )}
          </AuthenticateUser>
        </NextIntlClientProvider>
      </OAuthGoogleProvider>
    </ReduxProvider>
  );
}