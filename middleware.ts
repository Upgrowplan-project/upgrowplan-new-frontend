import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'ru'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // If someone visits /en or /en/* - redirect to path without /en (canonicalize)
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const cleanPath = pathname === '/en' ? '/' : pathname.replace(/^\/en/, '');
    const url = new URL(`${cleanPath}${request.nextUrl.search}`, request.url);
    const response = NextResponse.redirect(url, { status: 307 });
    // remember preference
    response.cookies.set('NEXT_LOCALE', 'en', { path: '/', maxAge: 31536000 });
    return response;
  }

  // If path is already Russian, continue
  if (pathname === '/ru' || pathname.startsWith('/ru/')) {
    return NextResponse.next();
  }

  // Root path handling
  if (pathname === '/') {
    // Respect explicit lang param
    const langParam = request.nextUrl.searchParams.get('lang');
    if (langParam === 'ru') {
      const response = NextResponse.redirect(new URL('/ru', request.url), { status: 307 });
      response.cookies.set('NEXT_LOCALE', 'ru', { path: '/', maxAge: 31536000 });
      return response;
    }
    if (langParam === 'en') {
      const response = NextResponse.next();
      response.cookies.set('NEXT_LOCALE', 'en', { path: '/', maxAge: 31536000 });
      return response;
    }

    // Respect cookie preference (ru -> redirect to /ru, en -> stay at /)
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
    if (localeCookie === 'ru') {
      return NextResponse.redirect(new URL('/ru', request.url), { status: 307 });
    }
    if (localeCookie === 'en') {
      return NextResponse.next();
    }

    // Auto-detect only if no preference saved
    const acceptLanguage = request.headers.get('accept-language') || '';
    const isRussian = acceptLanguage.includes('ru');
    if (isRussian) {
      return NextResponse.redirect(new URL('/ru', request.url), { status: 307 });
    }

    // Default: stay on root (English)
    return NextResponse.next();
  }

  // For all other non-prefixed paths (English pages), just continue
  return NextResponse.next();
}

export const config = {
  // Match all routes except static files and api
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
