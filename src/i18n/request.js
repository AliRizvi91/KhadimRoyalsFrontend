// src/i18n/request.js
import { locales, defaultLocale } from './config';

export default function requestConfig() {
  return {
    locales,
    defaultLocale
  };
}