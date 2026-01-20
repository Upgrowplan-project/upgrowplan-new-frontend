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
    // Try to detect language from browser Accept-Language header
    const acceptLanguage = request.headers.get('accept-language') || '';
    const isRussian = acceptLanguage.includes('ru');
    const locale = isRussian ? 'ru' : 'en';
    
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

