export const locales = ['en', 'ar', 'ur'];
export const defaultLocale = 'en';
export const localeNames = {
  en: 'English',
  ar: 'العربية',
  ur: 'اردو'
};

// Optional: If you need request-specific config
export default function getRequestConfig() {
  return {
    locales,
    defaultLocale
  };
}