import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { softwareAppSchema, breadcrumbSchema, breadcrumbs, solutionData, speakableSchema, faqSchema, pageFaqs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import OpenAbroadPageEn from "../../../solutions/openAbroad/page.en";
import OpenAbroadPageRu from "../../../solutions/openAbroad/page.ru";

const SITE_URL = "https://www.upgrowplan.com";
type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.openAbroad;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  const isRu = locale === "ru";
  return {
    ...buildMetadata({ locale, path, ...meta }),
    keywords: isRu
      ? ["открыть бизнес за рубежом", "регистрация компании за границей", "Open Abroad ИИ", "сравнение юрисдикций", "налоги за рубежом", "международная экспансия"]
      : ["open business abroad", "international company registration", "Open Abroad AI", "jurisdiction comparison", "business expansion tool", "global market entry"],
  };
}

export default function OpenAbroadLocalePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const data = solutionData.openAbroad[locale];
  const url = `${SITE_URL}${locale === "ru" ? "/ru" : ""}${solutionData.openAbroad.url}`;
  const faqTitle = locale === "ru" ? "Вопросы об Open Abroad" : "Open Abroad FAQ";
  return (
    <>
      <JsonLd
        data={[
          softwareAppSchema({ ...data, url, isFree: solutionData.openAbroad.isFree }),
          breadcrumbSchema(breadcrumbs.solutionPage(locale, data.name)),
          faqSchema(pageFaqs.openAbroad[locale]),
          speakableSchema({ url, name: data.name, description: data.description, locale }),
        ]}
      />
      {locale === "ru" ? <OpenAbroadPageRu /> : <OpenAbroadPageEn />}
      <FaqSection items={pageFaqs.openAbroad[locale]} title={faqTitle} />
    </>
  );
}
