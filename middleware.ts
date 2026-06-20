import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Trailing slash → canonical path (301 Permanent Redirect)
  // Prevents GSC "Redirect error" from implicit Next.js 308 trailing-slash redirects
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const cleanPath = pathname.slice(0, -1);
    return NextResponse.redirect(
      new URL(`${cleanPath}${request.nextUrl.search}`, request.url),
      { status: 301 }
    );
  }

  // /en or /en/* → redirect to canonical path without /en prefix
  // (keeps URLs clean: /blog not /en/blog)
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const cleanPath = pathname === '/en' ? '/' : pathname.replace(/^\/en/, '');
    const url = new URL(`${cleanPath}${request.nextUrl.search}`, request.url);
    const response = NextResponse.redirect(url, { status: 301 });
    response.cookies.set('NEXT_LOCALE', 'en', { path: '/', maxAge: 31536000 });
    return response;
  }

  // /ru or /ru/* → pass through, app/[locale]/ handles with locale="ru"
  if (pathname === '/ru' || pathname.startsWith('/ru/')) {
    return NextResponse.next();
  }

  // Root path / → language detection + redirect or rewrite to /en
  if (pathname === '/') {
    const langParam = request.nextUrl.searchParams.get('lang');
    if (langParam === 'ru') {
      const response = NextResponse.redirect(new URL('/ru', request.url), { status: 307 });
      response.cookies.set('NEXT_LOCALE', 'ru', { path: '/', maxAge: 31536000 });
      return response;
    }
    if (langParam === 'en') {
      const url = request.nextUrl.clone();
      url.pathname = '/en';
      const response = NextResponse.rewrite(url);
      response.cookies.set('NEXT_LOCALE', 'en', { path: '/', maxAge: 31536000 });
      return response;
    }

    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
    if (localeCookie === 'ru') {
      return NextResponse.redirect(new URL('/ru', request.url), { status: 307 });
    }

    const acceptLanguage = request.headers.get('accept-language') || '';
    const isRussian = acceptLanguage.includes('ru');
    if (isRussian && localeCookie !== 'en') {
      return NextResponse.redirect(new URL('/ru', request.url), { status: 307 });
    }

    // Default: rewrite / → /en → app/[locale]/page.tsx with locale="en"
    const url = request.nextUrl.clone();
    url.pathname = '/en';
    return NextResponse.rewrite(url);
  }

  // All other non-prefixed paths (e.g. /blog, /about, /solutions/planMaster)
  // → internally rewrite to /en/... so app/[locale]/ handles them with locale="en"
  // Browser URL stays unchanged (no redirect), canonical URLs remain clean
  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Exclude static files, api routes, Next.js internals
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
