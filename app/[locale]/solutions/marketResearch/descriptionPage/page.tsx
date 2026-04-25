import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import {
  breadcrumbSchema,
  faqSchema,
  pageFaqs,
  softwareAppSchema,
  solutionData,
} from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import EnPage from "./page.en";
import RuPage from "./page.ru";

const SITE_URL = "https://www.upgrowplan.com";
type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.marketResearchDescription;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function MarketResearchDescriptionPage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const isRu = locale === "ru";
  const data = solutionData.marketResearch[locale];
  const url = `${SITE_URL}${isRu ? "/ru" : ""}${pageMeta.marketResearchDescription[isRu ? "ruPath" : "enPath"]}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: isRu ? "Главная" : "Home", url: isRu ? `${SITE_URL}/ru` : SITE_URL },
            { name: isRu ? "Решения" : "Solutions", url: `${SITE_URL}${isRu ? "/ru" : ""}/solutions` },
            { name: isRu ? "Как работает MarketSense" : "How MarketSense Works" },
          ]),
          faqSchema(pageFaqs.marketResearchDescription[locale]),
          softwareAppSchema({
            name: data.name,
            description: data.description,
            url,
            keywords: data.keywords,
            isFree: solutionData.marketResearch.isFree,
          }),
        ]}
      />
      {isRu ? <RuPage /> : <EnPage />}
    </>
  );
}
