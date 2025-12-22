import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Fallback to 'en' if locale is undefined
  const currentLocale = locale || 'en';

  const commonMessages = (await import(`../locales/${currentLocale}/common.json`)).default;
  const headerMessages = (await import(`../locales/${currentLocale}/header.json`)).default;
  const synthFocusLabMessages = (await import(`../locales/${currentLocale}/synthFocusLab.json`)).default;

  return {
    locale: currentLocale,
    messages: {
      ...commonMessages,
      header: headerMessages,
      ...synthFocusLabMessages,
    }
  };
});
