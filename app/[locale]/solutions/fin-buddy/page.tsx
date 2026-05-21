import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { softwareAppSchema, breadcrumbSchema, breadcrumbs, solutionData, speakableSchema, faqSchema, pageFaqs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import EnPage from "./page.en";
import RuPage from "./page.ru";

const SITE_URL = "https://www.upgrowplan.com";
type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.finBuddy;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  const isRu = locale === "ru";
  return {
    ...buildMetadata({ locale, path, ...meta }),
    keywords: isRu
      ? ["ИИ финансовая модель", "P&L онлайн бесплатно", "точка безубыточности калькулятор", "финансовый прогноз стартап", "FinPilot", "финмодель бесплатно"]
      : ["AI financial model", "free P&L generator", "break-even calculator online", "startup financial forecast", "FinPilot free", "financial modeling tool"],
  };
}

export default function FinBuddyPage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const data = solutionData.finBuddy[locale];
  const url = `${SITE_URL}${locale === "ru" ? "/ru" : ""}${solutionData.finBuddy.url}`;
  const faqTitle = locale === "ru" ? "Вопросы о Fin Buddy" : "Fin Buddy FAQ";
  return (
    <>
      <JsonLd
        data={[
          softwareAppSchema({ ...data, url, isFree: solutionData.finBuddy.isFree }),
          breadcrumbSchema(breadcrumbs.solutionPage(locale, data.name)),
          faqSchema(pageFaqs.finBuddy[locale]),
          speakableSchema({ url, name: data.name, description: data.description, locale }),
        ]}
      />
      {locale === "ru" ? <RuPage /> : <EnPage />}
      <FaqSection items={pageFaqs.finBuddy[locale]} title={faqTitle} />
    </>
  );
}
