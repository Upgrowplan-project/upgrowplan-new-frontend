// Cookie Consent Management Utilities

export interface CookieConsent {
    consent_given: boolean;
    date: string;
    version: string;
    categories: {
        essential: boolean;
        analytical: boolean;
        marketing: boolean;
    };
}

const CONSENT_KEY = 'cookie_consent';
const CONSENT_VERSION = '1.0';
const CONSENT_DURATION_DAYS = 365;

/**
 * Get current cookie consent from localStorage
 */
export function getConsent(): CookieConsent | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (!stored) return null;

        const consent: CookieConsent = JSON.parse(stored);

        // Check if consent is still valid (not expired)
        const consentDate = new Date(consent.date);
        const expiryDate = new Date(consentDate);
        expiryDate.setDate(expiryDate.getDate() + CONSENT_DURATION_DAYS);

        if (new Date() > expiryDate) {
            // Consent expired
            localStorage.removeItem(CONSENT_KEY);
            return null;
        }

        return consent;
    } catch (error) {
        console.error('Error reading cookie consent:', error);
        return null;
    }
}

/**
 * Save cookie consent to localStorage
 */
export function saveConsent(consent: Partial<CookieConsent['categories']>): void {
    if (typeof window === 'undefined') return;

    const consentData: CookieConsent = {
        consent_given: true,
        date: new Date().toISOString(),
        version: CONSENT_VERSION,
        categories: {
            essential: true, // Always true
            analytical: consent.analytical ?? false,
            marketing: consent.marketing ?? false,
        },
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));

    // Initialize analytics based on consent
    initializeAnalytics(consentData.categories);
}

/**
 * Accept all cookies
 */
export function acceptAllCookies(): void {
    saveConsent({
        analytical: true,
        marketing: true,
    });
}

/**
 * Reject all non-essential cookies
 */
export function rejectAllCookies(): void {
    saveConsent({
        analytical: false,
        marketing: false,
    });
}

/**
 * Initialize analytics scripts based on consent
 */
export function initializeAnalytics(categories: CookieConsent['categories']): void {
    if (typeof window === 'undefined') return;

    // Google Analytics
    if (categories.analytical) {
        initializeGoogleAnalytics();
    }

    // Yandex Metrika (for Russian version)
    if (categories.analytical) {
        initializeYandexMetrika();
    }

    // Facebook Pixel
    if (categories.marketing) {
        initializeFacebookPixel();
    }

    // Hotjar
    if (categories.analytical) {
        initializeHotjar();
    }
}

/**
 * Initialize Google Analytics
 */
function initializeGoogleAnalytics(): void {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
    if (!GA_ID) return;

    // Add Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', GA_ID);
}

/**
 * Initialize Yandex Metrika
 */
function initializeYandexMetrika(): void {
    const YM_ID = process.env.NEXT_PUBLIC_YM_ID;
    if (!YM_ID) return;

    // Add Yandex Metrika script
    (window as any).ym = (window as any).ym || function (...args: any[]) {
        ((window as any).ym.a = (window as any).ym.a || []).push(args);
    };
    (window as any).ym.l = Date.now();

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    document.head.appendChild(script);

    script.onload = () => {
        (window as any).ym(YM_ID, 'init', {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
        });
    };
}

/**
 * Initialize Facebook Pixel
 */
function initializeFacebookPixel(): void {
    const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
    if (!FB_PIXEL_ID) return;

    // Add Facebook Pixel script
    (window as any).fbq = function (...args: any[]) {
        ((window as any).fbq.callMethod
            ? (window as any).fbq.callMethod(...args)
            : (window as any).fbq.queue.push(args));
    };
    if (!(window as any)._fbq) (window as any)._fbq = (window as any).fbq;
    (window as any).fbq.push = (window as any).fbq;
    (window as any).fbq.loaded = true;
    (window as any).fbq.version = '2.0';
    (window as any).fbq.queue = [];

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);

    (window as any).fbq('init', FB_PIXEL_ID);
    (window as any).fbq('track', 'PageView');
}

/**
 * Initialize Hotjar
 */
function initializeHotjar(): void {
    const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;
    if (!HOTJAR_ID) return;

    (window as any).hj = (window as any).hj || function (...args: any[]) {
        ((window as any).hj.q = (window as any).hj.q || []).push(args);
    };
    (window as any)._hjSettings = { hjid: HOTJAR_ID, hjsv: 6 };

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://static.hotjar.com/c/hotjar-${HOTJAR_ID}.js?sv=6`;
    document.head.appendChild(script);
}

/**
 * Check if consent has been given
 */
export function hasConsent(): boolean {
    const consent = getConsent();
    return consent !== null && consent.consent_given;
}
