import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'ru'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if pathname already has a locale prefix
  const hasLocalePrefix = locales.some(locale =>
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocalePrefix) {
    return NextResponse.next();
  }

  // Handle root path
  if (pathname === '/') {
    // Check for explicit lang parameter in URL
    const langParam = request.nextUrl.searchParams.get('lang');
    if (langParam && locales.includes(langParam)) {
      const response = NextResponse.redirect(
        new URL(`/${langParam}`, request.url),
        { status: 307 }
      );
      // Save preference
      response.cookies.set('NEXT_LOCALE', langParam, {
        path: '/',
        maxAge: 31536000, // 1 year
      });
      return response;
    }

    // Check if user has a locale preference cookie
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;

    if (localeCookie && locales.includes(localeCookie)) {
      // Use saved preference
      return NextResponse.redirect(
        new URL(`/${localeCookie}`, request.url),
        { status: 307 }
      );
    }

    // Only auto-detect language if no preference is saved
    const acceptLanguage = request.headers.get('accept-language') || '';
    const isRussian = acceptLanguage.includes('ru');
    const locale = isRussian ? 'ru' : defaultLocale;

    return NextResponse.redirect(
      new URL(`/${locale}`, request.url),
      { status: 307 }
    );
  }

  // Add default locale prefix to all other paths
  return NextResponse.redirect(
    new URL(`/${defaultLocale}${pathname}`, request.url),
    { status: 307 }
  );
}

export const config = {
  // Match all routes except static files and api
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
