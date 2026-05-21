import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { softwareAppSchema, breadcrumbSchema, breadcrumbs, solutionData, faqSchema, pageFaqs, speakableSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import MarketResearchPageEn from "../../../solutions/marketResearch/page.en";
import MarketResearchPageRu from "../../../solutions/marketResearch/page.ru";

const SITE_URL = "https://www.upgrowplan.com";
type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.marketResearch;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  const isRu = locale === "ru";
  return {
    ...buildMetadata({ locale, path, ...meta }),
    keywords: isRu
      ? ["ИИ исследование рынка", "анализ конкурентов онлайн", "MarketSense AI", "оценка рынка", "объём рынка TAM SAM SOM", "исследование рынка за 15 минут"]
      : ["AI market research", "competitor analysis tool", "MarketSense AI", "market sizing tool", "TAM SAM SOM analysis", "automated market research"],
  };
}

export default function MarketResearchLocalePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const data = solutionData.marketResearch[locale];
  const url = `${SITE_URL}${locale === "ru" ? "/ru" : ""}${solutionData.marketResearch.url}`;
  return (
    <>
      <JsonLd
        data={[
          softwareAppSchema({ ...data, url, isFree: solutionData.marketResearch.isFree }),
          breadcrumbSchema(breadcrumbs.solutionPage(locale, data.name)),
          faqSchema(pageFaqs.marketResearch[locale]),
          speakableSchema({ url, name: data.name, description: data.description, locale }),
        ]}
      />
      {locale === "ru" ? <MarketResearchPageRu /> : <MarketResearchPageEn />}
    </>
  );
}
