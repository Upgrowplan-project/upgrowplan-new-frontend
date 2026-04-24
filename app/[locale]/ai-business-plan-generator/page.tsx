import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema, pageFaqs, howToSchema, howToSteps, softwareAppSchema, solutionData } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import PageRu from "../../ai-business-plan-generator/page.ru";
import PageEn from "../../ai-business-plan-generator/page.en";

const SITE_URL = "https://www.upgrowplan.com";
type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.aiBizPlanGenerator;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  const isRu = locale === "ru";
  return {
    ...buildMetadata({ locale, path, ...meta }),
    keywords: isRu
      ? ["ИИ генератор бизнес-планов", "создать бизнес-план онлайн", "бизнес-план ЮНИДО", "PlanMaster AI", "бизнес-план для инвестора", "ИИ бизнес-план", "генерация бизнес-плана"]
      : ["AI business plan generator", "generate business plan AI", "UNIDO business plan", "PlanMaster AI", "investor business plan AI", "business plan generator online"],
  };
}

export default function AiBizPlanGeneratorPage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const isRu = locale === "ru";
  const data = solutionData.planMaster[locale];
  const url = `${SITE_URL}${isRu ? "/ru" : ""}${solutionData.planMaster.url}`;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: isRu ? `${SITE_URL}/ru` : SITE_URL },
            { name: isRu ? "ИИ Генератор бизнес-планов" : "AI Business Plan Generator" },
          ]),
          faqSchema(pageFaqs.aiBizPlanGenerator[locale]),
          howToSchema(howToSteps.planMaster[locale]),
          softwareAppSchema({ name: data.name, description: data.description, url, keywords: data.keywords, isFree: solutionData.planMaster.isFree }),
        ]}
      />
      {isRu ? <PageRu /> : <PageEn />}
    </>
  );
}
