import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ru'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Disable automatic locale detection
  localeDetection: false,

  // Don't use prefix for default locale (en will be /, ru will be /ru)
  localePrefix: 'as-needed'
});

export const config = {
  // Match all routes except static files and api
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

