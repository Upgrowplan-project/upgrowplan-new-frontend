import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Fallback to 'en' if locale is undefined
  const currentLocale = locale || 'en';

  return {
    locale: currentLocale,
    // path relative to this file (app/i18n/request.ts) -> ../../locales
    messages: (await import(`../../locales/${currentLocale}/common.json`)).default,
  };
});
