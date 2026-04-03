// app/[locale]/layout.tsx
// CSS, MobileNavWrapper, AOSWrapper are now in root layout (app/layout.tsx)
// This layout only adds i18n context for locale-prefixed routes (/ru/...)
import CookieBannerWrapper from "@/components/CookieBannerWrapper";
import { NextIntlClientProvider } from "next-intl";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ru" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;

  let messages: Record<string, any> = {};
  try {
    const common = await import(`../../locales/${locale}/common.json`);
    const header = await import(`../../locales/${locale}/header.json`);
    const monitoring = await import(`../../locales/${locale}/monitoring.json`);
    messages = {
      ...common?.default,
      header: header?.default ?? {},
      monitoring: monitoring?.default ?? {},
    };
  } catch (err) {
    messages = {};
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
      <CookieBannerWrapper />
    </NextIntlClientProvider>
  );
}
