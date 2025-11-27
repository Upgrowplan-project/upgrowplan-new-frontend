// app/[locale]/layout.tsx
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../globals.css";

import AOSWrapper from "../AOSWrapper";
import Footer from "@/components/Footer";
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
    messages = {
      ...common?.default,
      header: header?.default ?? {},
    };
  } catch (err) {
    // если нет переводов — оставляем пустые сообщения
    messages = {};
  }

  return (
    <>
      <AOSWrapper />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <main>{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </>
  );
}

