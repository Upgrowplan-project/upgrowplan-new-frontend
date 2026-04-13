import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { softwareAppSchema, breadcrumbSchema, breadcrumbs, solutionData, faqSchema, pageFaqs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import BusinessPulsePageEn from "./page.en";
import BusinessPulsePageRu from "./page.ru";

const SITE_URL = "https://upgrowplan.com";
type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.businessPulse;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function BusinessPulseLocalePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const data = solutionData.businessPulse[locale];
  const url = `${SITE_URL}${locale === "ru" ? "/ru" : ""}${solutionData.businessPulse.url}`;
  const faqTitle = locale === "ru" ? "Вопросы о Business Pulse" : "Business Pulse — FAQ";

  return (
    <>
      <JsonLd
        data={[
          softwareAppSchema({ ...data, url, isFree: solutionData.businessPulse.isFree }),
          breadcrumbSchema(breadcrumbs.solutionPage(locale, data.name)),
          faqSchema(pageFaqs.businessPulse[locale]),
        ]}
      />
      {locale === "ru" ? <BusinessPulsePageRu /> : <BusinessPulsePageEn />}
      <FaqSection items={pageFaqs.businessPulse[locale]} title={faqTitle} />
    </>
  );
}
