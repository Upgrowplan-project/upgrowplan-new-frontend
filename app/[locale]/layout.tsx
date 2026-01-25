// app/[locale]/layout.tsx
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../globals.css";

import AOSWrapper from "../AOSWrapper";
import Footer from "@/components/Footer";
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

  // Загружаем переводы на сервере
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
    // если нет переводов — оставляем пустые сообщения
    messages = {};
  }

  return (
    <div suppressHydrationWarning>
      <AOSWrapper />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <main>{children}</main>
        <Footer />
        <CookieBannerWrapper />
      </NextIntlClientProvider>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  );
}
