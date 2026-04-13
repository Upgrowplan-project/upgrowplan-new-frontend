import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import {
  faqSchema, pageFaqs, breadcrumbSchema,
  howToSchema, howToSteps,
  productSchema, solutionData,
} from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import MarketResearchDescriptionPageEn from "./page.en";
import MarketResearchDescriptionPageRu from "./page.ru";

const SITE_URL = "https://upgrowplan.com";
type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.marketResearchDescription;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function MarketResearchDescriptionLocalePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const faqTitle = locale === "ru" ? "Вопросы об исследовании рынка" : "Market Research — FAQ";
  const crumbs = [
    { name: "Home", url: locale === "ru" ? `${SITE_URL}/ru` : SITE_URL },
    {
      name: locale === "ru" ? "Решения" : "Solutions",
      url: locale === "ru" ? `${SITE_URL}/ru/solutions` : `${SITE_URL}/solutions`,
    },
    { name: locale === "ru" ? "Исследование рынка" : "Market Research" },
  ];
  const solData = solutionData.marketResearch[locale];
  const solUrl = `${SITE_URL}${locale === "ru" ? "/ru" : ""}${solutionData.marketResearch.url}`;

  return (
    <>
      <JsonLd
        data={[
          faqSchema(pageFaqs.marketResearchDescription[locale]),
          breadcrumbSchema(crumbs),
          howToSchema(howToSteps.marketResearch[locale]),
          productSchema({ name: solData.name, description: solData.description, url: solUrl }),
        ]}
      />
      {locale === "ru" ? <MarketResearchDescriptionPageRu /> : <MarketResearchDescriptionPageEn />}
      <FaqSection items={pageFaqs.marketResearchDescription[locale]} title={faqTitle} />
    </>
  );
}
