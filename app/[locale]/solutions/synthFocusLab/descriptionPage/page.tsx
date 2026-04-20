import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import {
  faqSchema, pageFaqs, breadcrumbSchema,
  howToSchema, howToSteps,
  productSchema, solutionData,
} from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import SynthFocusLabDescriptionPageRn from "./page.rn";
import SynthFocusLabDescriptionPageRu from "./page.ru";

const SITE_URL = "https://upgrowplan.com";
type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.synthFocusLabDescription;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function SynthFocusLabDescriptionLocalePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const faqTitle = locale === "ru" ? "Вопросы о Synth Focus Lab" : "Synth Focus Lab — FAQ";
  const crumbs = [
    { name: "Home", url: locale === "ru" ? `${SITE_URL}/ru` : SITE_URL },
    {
      name: locale === "ru" ? "Решения" : "Solutions",
      url: locale === "ru" ? `${SITE_URL}/ru/solutions` : `${SITE_URL}/solutions`,
    },
    { name: "Synth Focus Lab" },
  ];
  const solData = solutionData.synthFocusLab[locale];
  const solUrl = `${SITE_URL}${locale === "ru" ? "/ru" : ""}${solutionData.synthFocusLab.url}`;

  return (
    <>
      <JsonLd
        data={[
          faqSchema(pageFaqs.synthFocusLabDescription[locale]),
          breadcrumbSchema(crumbs),
          howToSchema(howToSteps.synthFocusLab[locale]),
          productSchema({ name: solData.name, description: solData.description, url: solUrl }),
        ]}
      />
      {locale === "ru" ? <SynthFocusLabDescriptionPageRu /> : <SynthFocusLabDescriptionPageRn />} 
      <FaqSection items={pageFaqs.synthFocusLabDescription[locale]} title={faqTitle} />
    </>
  );
}
