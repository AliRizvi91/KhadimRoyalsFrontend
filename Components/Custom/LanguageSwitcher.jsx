'use client';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/src/i18n/config';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale) => {
    setIsLoading(true)
    const segments = pathname.split('/');
    segments[1] = newLocale; // Replace the locale segment
    router.push(segments.join('/'));
  };

  const currentLocale = pathname.split('/')[1] || 'en';

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <motion.button
          key={locale}
          onClick={() => changeLanguage(locale)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden p-3 text-[12px] rounded-sm border-0 select-none cursor-pointer manrope font-extrabold"
          style={{
            color: "#333", // Dark text for contrast
            background: "radial-gradient(93% 87% at 87% 89%, rgba(0, 0, 0, 0.1) 0%, transparent 86.18%), radial-gradient(66% 66% at 26% 20%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 69.79%, rgba(255, 255, 255, 0) 100%)",
            backgroundColor: "#E8E4D9",
            boxShadow: "inset -3px -3px 9px rgba(255, 255, 255, 0.5), inset 0px 3px 9px rgba(255, 255, 255, 0.4), inset 0px 1px 1px rgba(255, 255, 255, 0.8), inset 0px -8px 36px rgba(0, 0, 0, 0.1), inset 0px 1px 5px rgba(255, 255, 255, 0.8), 2px 19px 31px rgba(0, 0, 0, 0.1)"
          }}
        >
          {isLoading ? (        <div className="flex justify-center items-center">
          <motion.div
            className={`w-5 h-5 border-1 border-black border-t-transparent rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          />
        </div>) : locale.toUpperCase()}
        </motion.button>
      ))}
    </div>
  );
}