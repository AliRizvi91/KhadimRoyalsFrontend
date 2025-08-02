// middleware.js
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/config.js';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*|error|not-found).*)']
};