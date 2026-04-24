import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema, pageFaqs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import PageRu from "../../why-upgrowplan/page.ru";
import PageEn from "../../why-upgrowplan/page.en";

const SITE_URL = "https://www.upgrowplan.com";
type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.whyUpgrowplan;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  const isRu = locale === "ru";
  return {
    ...buildMetadata({ locale, path, ...meta }),
    keywords: isRu
      ? ["upgrowplan vs chatgpt", "лучший ИИ для бизнес-плана", "альтернатива ChatGPT бизнес-план", "upgrowplan отзывы", "RAG бизнес-план", "ЮНИДО бизнес-план ИИ"]
      : ["upgrowplan vs chatgpt", "best AI business plan tool", "chatgpt alternative business plan", "upgrowplan vs upmetrics", "RAG business plan AI"],
  };
}

export default function WhyUpgrowplanPage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const isRu = locale === "ru";
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: isRu ? `${SITE_URL}/ru` : SITE_URL },
            { name: isRu ? "Почему Upgrowplan" : "Why Upgrowplan" },
          ]),
          faqSchema(pageFaqs.whyUpgrowplan[locale]),
        ]}
      />
      {isRu ? <PageRu /> : <PageEn />}
    </>
  );
}
