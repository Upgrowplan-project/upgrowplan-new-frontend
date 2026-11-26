import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { reportBotCrawl } from './lib/eventQueue';

// AI crawlers that matter for GEO Visibility tracking
const AI_BOT_PATTERNS: [string, string][] = [
  ['GPTBot',            'gptbot'],
  ['OAI-SearchBot',     'oai-searchbot'],
  ['ChatGPT-User',      'chatgpt-user'],
  ['PerplexityBot',     'perplexitybot'],
  ['Perplexity-User',   'perplexity-user'],
  ['ClaudeBot',         'claudebot'],
  ['Claude-User',       'claude-user'],
  ['Claude-SearchBot',  'claude-searchbot'],
  ['anthropic-ai',      'anthropic-ai'],
  ['Google-Extended',   'google-extended'],
  ['CCBot',             'ccbot'],
  ['Applebot-Extended', 'applebot-extended'],
  ['Meta-ExternalAgent','meta-externalagent'],
  // [21.11] это инструмент проверки URL в Search Console, а не Gemini (Gemini отдельного робота не имеет:
  // Google-Extended — только строка в robots.txt, читает обычный Googlebot)
  ['Google-InspectionTool', 'google-inspectiontool'],
];

function detectAiBot(ua: string): string | null {
  if (!ua) return null;
  const u = ua.toLowerCase();
  for (const [name, pattern] of AI_BOT_PATTERNS) {
    if (u.includes(pattern)) return name;
  }
  return null;
}

// Only track content pages — skip static assets already excluded by matcher
const CONTENT_PATH_PREFIXES = ['/blog/', '/solutions/', '/about', '/why-upgrowplan', '/ai-business-plan-generator', '/alternatives/'];

// [26.11] /ru/* и главная тоже: русская версия — тот же контент с префиксом /ru (раньше /ru/blog/… не совпадал с '/blog/')
function isContentPath(pathname: string): boolean {
  const p = pathname === '/ru' ? '/' : pathname.replace(/^\/ru(?=\/)/, '');
  return p === '/' || p === '/blog' || CONTENT_PATH_PREFIXES.some(prefix => p === prefix || p.startsWith(prefix));
}

// GEO Visibility: AI bot visit → event queue (lib/eventQueue.ts), sent to monitoring once a day; waitUntil keeps the
// write alive after the response. [26.11] Вызывается ДО развилки по языкам: прежде /ru/* и «/» выходили из middleware
// раньше этого места, и визиты ИИ-ботов на русские страницы и главную не записывались никогда.
function trackAiBot(request: NextRequest, event: NextFetchEvent, pathname: string): void {
  const ua = request.headers.get('user-agent') || '';
  const botName = detectAiBot(ua);
  if (botName && isContentPath(pathname)) {
    event.waitUntil(reportBotCrawl({ bot_name: botName, bot_raw_ua: ua, url_path: pathname, crawled_at: new Date().toISOString() }));
  }
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
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

  // [26.11] учёт ИИ-ботов — до развилки по языкам (после переадресаций: заход на переадресацию — не визит страницы)
  trackAiBot(request, event, pathname);

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
