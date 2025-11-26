import type { NextRequest } from 'next/server';

// Minimal request config used by next-intl plugin. This function should
// return configuration for the current request (locale, messages path, etc.).
// For now we provide a simple implementation that prefers the NEXT_LOCALE
// cookie, then the accept-language header, and falls back to 'en'.

export default function getRequestConfig(req?: NextRequest) {
  const cookieLocale = req?.cookies?.get?.('NEXT_LOCALE')?.value;
  const header = req?.headers?.get('accept-language') || undefined;
  let locale = 'en';
  if (cookieLocale) locale = cookieLocale;
  else if (header) {
    // crude parsing: take first language
    const first = header.split(',')[0];
    if (first.startsWith('ru')) locale = 'ru';
    else locale = 'en';
  }

  return {
    locale,
    // sourceLocale and messages configuration are optional for basic use.
    // next-intl will then load messages using the runtime helpers.
  };
}
