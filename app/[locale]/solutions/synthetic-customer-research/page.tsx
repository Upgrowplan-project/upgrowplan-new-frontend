import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import {
  breadcrumbSchema,
  breadcrumbs,
  faqSchema,
  pageFaqs,
  howToSchema,
  howToSteps,
  softwareAppSchema,
  solutionData,
} from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import SyntheticCustomerResearchRu from "../../../solutions/synthetic-customer-research/page.ru";
import SyntheticCustomerResearchEn from "../../../solutions/synthetic-customer-research/page.en";

const SITE_URL = "https://www.upgrowplan.com";
type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.syntheticCustomerResearch;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  const isRu = locale === "ru";

  return {
    ...buildMetadata({ locale, path, ...meta }),
    keywords: isRu
      ? [
          "синтетические респонденты",
          "виртуальные фокус-группы",
          "ИИ исследование покупателей",
          "альтернатива фокус-группам",
          "тестирование бизнес-идеи",
          "Synth Focus Lab",
          "AI market research",
          "validate business idea",
        ]
      : [
          "synthetic respondents",
          "AI focus groups",
          "virtual buyers",
          "synthetic customer research",
          "focus group alternative",
          "validate business idea AI",
          "Synth Focus Lab",
          "AI market research tool",
        ],
  };
}

export default function SyntheticCustomerResearchPage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const isRu = locale === "ru";
  const synthData = solutionData.synthFocusLab[locale];
  const synthUrl = `${SITE_URL}${isRu ? "/ru" : ""}${solutionData.synthFocusLab.url}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(
            breadcrumbs.solutionPage(
              locale,
              isRu ? "Синтетические респонденты" : "Synthetic Customer Research"
            )
          ),
          faqSchema(pageFaqs.syntheticCustomerResearch[locale]),
          howToSchema(howToSteps.syntheticCustomerResearch[locale]),
          softwareAppSchema({
            name: isRu ? "Synth Focus Lab — Синтетические респонденты" : "Synth Focus Lab — Synthetic Respondents",
            description: isRu
              ? "Виртуальные фокус-группы с ИИ-синтетическими респондентами. Тестирование бизнес-идей, ценовой чувствительности и продуктовых концепций за 15 минут без рекрутинга."
              : "Virtual focus groups with AI synthetic respondents. Test business ideas, pricing sensitivity and product concepts in 15 minutes without recruiting.",
            url: synthUrl,
            applicationCategory: "BusinessApplication",
            keywords: isRu
              ? ["синтетические респонденты", "виртуальные фокус-группы", "ИИ-исследование", "тестирование идей"]
              : ["synthetic respondents", "virtual focus groups", "AI research", "idea validation"],
            isFree: solutionData.synthFocusLab.isFree,
          }),
        ]}
      />
      {isRu ? <SyntheticCustomerResearchRu /> : <SyntheticCustomerResearchEn />}
    </>
  );
}
