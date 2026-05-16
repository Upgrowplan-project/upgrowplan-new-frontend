import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { softwareAppSchema, breadcrumbSchema, breadcrumbs, solutionData, speakableSchema, faqSchema, pageFaqs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import SocialPlanMasterPageEn from "../../../solutions/socialPlanMaster/page.en";
import SocialPlanMasterPageRu from "../../../solutions/socialPlanMaster/page.ru";

const SITE_URL = "https://upgrowplan.com";
type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.socialPlanMaster;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function SocialPlanMasterLocalePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const data = solutionData.socialPlanMaster[locale];
  const url = `${SITE_URL}${locale === "ru" ? "/ru" : ""}${solutionData.socialPlanMaster.url}`;
  const faqTitle = locale === "ru" ? "Вопросы о Social Plan Master" : "Social Plan Master FAQ";
  return (
    <>
      <JsonLd
        data={[
          softwareAppSchema({ ...data, url, isFree: solutionData.socialPlanMaster.isFree }),
          breadcrumbSchema(breadcrumbs.solutionPage(locale, data.name)),
          faqSchema(pageFaqs.socialPlanMaster[locale]),
          speakableSchema({ url, name: data.name, description: data.description, locale }),
        ]}
      />
      {locale === "ru" ? <SocialPlanMasterPageRu /> : <SocialPlanMasterPageEn />}
      <FaqSection items={pageFaqs.socialPlanMaster[locale]} title={faqTitle} />
    </>
  );
}
