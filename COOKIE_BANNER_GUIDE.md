# Cookie Banner Implementation Guide

## Overview

This implementation provides GDPR-compliant cookie consent management with two versions:
- **English (GDPR)**: Strict compliance with EU regulations - blocks analytics until consent
- **Russian (152-ФЗ)**: Informational banner with implied consent

## Files Created

1. **`lib/cookieConsent.ts`** - Core utilities for consent management
2. **`components/CookieBanner.tsx`** - Main banner component
3. **`components/CookieSettings.tsx`** - Settings modal for granular control
4. **`components/CookieBannerWrapper.tsx`** - Client-side wrapper for locale detection
5. **`app/globals.css`** - Updated with cookie banner styles

## Features

### GDPR Version (English)
- ✅ Modal-style banner at bottom of screen
- ✅ "Accept All" / "Reject All" / "Cookie Settings" buttons
- ✅ Granular control over cookie categories
- ✅ Blocks analytics scripts until consent given
- ✅ Link to Privacy Policy

### Russian Version
- ✅ Simple notification bar
- ✅ "Понятно" (OK) button
- ✅ Optional "Подробнее" (Details) for settings
- ✅ Analytics can load immediately (informational only)
- ✅ Link to Privacy Policy

## Cookie Categories

1. **Essential** - Always enabled, required for site functionality
2. **Analytical** - Google Analytics, Yandex Metrika, Hotjar
3. **Marketing** - Facebook Pixel, advertising trackers

## Environment Variables

Add these to your `.env.local` file:

```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Yandex Metrika
NEXT_PUBLIC_YM_ID=XXXXXXXX

# Facebook Pixel
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXXXXXXX

# Hotjar
NEXT_PUBLIC_HOTJAR_ID=XXXXXXX
```

## Storage

Consent is stored in `localStorage` with the following structure:

```json
{
  "consent_given": true,
  "date": "2024-05-20T10:30:00.000Z",
  "version": "1.0",
  "categories": {
    "essential": true,
    "analytical": true,
    "marketing": false
  }
}
```

Consent expires after 365 days.

## Usage

The Cookie Banner is automatically displayed on all pages via the layout component.

### Programmatic Access

```typescript
import { 
  getConsent, 
  acceptAllCookies, 
  rejectAllCookies,
  hasConsent 
} from '@/lib/cookieConsent';

// Check if user has given consent
if (hasConsent()) {
  // Load analytics
}

// Get full consent object
const consent = getConsent();
if (consent?.categories.analytical) {
  // Initialize analytics
}
```

## Customization

### Changing Text

Edit translations in `components/CookieBanner.tsx`:

```typescript
const translations = {
  en: {
    gdpr: {
      title: "Your custom title",
      description: "Your custom description",
      // ...
    }
  },
  ru: {
    simple: {
      description: "Ваш текст",
      // ...
    }
  }
};
```

### Styling

Cookie banner uses inline styles matching the site's design system:
- Primary color: `#0785f6`
- Brand color: `#1e6078`
- Light background: `#d7ecf6`

Modify styles in `components/CookieBanner.tsx` or add CSS classes in `globals.css`.

## Accessibility

- ✅ Keyboard navigation support (Tab)
- ✅ Focus visible states
- ✅ ARIA labels on buttons
- ✅ High contrast colors
- ✅ Screen reader compatible

## Responsive Design

- ✅ Mobile-optimized layouts
- ✅ Touch-friendly button sizes
- ✅ Proper z-index (9999) to stay on top
- ✅ Doesn't block important UI elements

## Testing

1. **Clear consent**: Open DevTools → Application → Local Storage → Delete `cookie_consent`
2. **Test English version**: Navigate to `/` or `/en`
3. **Test Russian version**: Navigate to `/ru`
4. **Test settings modal**: Click "Cookie Settings" / "Подробнее"
5. **Test persistence**: Refresh page - banner should not reappear

## Compliance Notes

### GDPR (English)
- Scripts are **blocked** until user accepts
- User must explicitly opt-in
- Granular control provided
- Consent can be withdrawn (clear localStorage)

### 152-ФЗ (Russian)
- Informational only
- Scripts can load immediately
- User is notified
- Implied consent by continuing to use site

## Future Enhancements

- [ ] IP-based geolocation for automatic version selection
- [ ] Cookie consent API integration
- [ ] A/B testing different banner designs
- [ ] Analytics on consent rates
- [ ] Multi-language support beyond EN/RU
