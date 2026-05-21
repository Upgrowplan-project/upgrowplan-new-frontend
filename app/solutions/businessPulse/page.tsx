import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { softwareAppSchema, breadcrumbSchema, breadcrumbs, solutionData, faqSchema, pageFaqs, howToSchema, howToSteps, productSchema, speakableSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import BusinessPulsePageEn from "../../[locale]/solutions/businessPulse/page.en";

const SITE_URL = "https://www.upgrowplan.com";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: pageMeta.businessPulse.enPath,
  ...pageMeta.businessPulse,
});

export default function BusinessPulseRoute() {
  const data = solutionData.businessPulse.en;
  const url = `${SITE_URL}${solutionData.businessPulse.url}`;
  return (
    <>
      <JsonLd
        data={[
          softwareAppSchema({ ...data, url, isFree: solutionData.businessPulse.isFree }),
          breadcrumbSchema(breadcrumbs.solutionPage("en", data.name)),
          faqSchema(pageFaqs.businessPulse.en),
          howToSchema(howToSteps.businessPulse.en),
          productSchema({ name: data.name, description: data.description, url }),
          speakableSchema({ url, name: data.name, description: data.description, locale: "en" }),
        ]}
      />
      <BusinessPulsePageEn />
      <FaqSection items={pageFaqs.businessPulse.en} title="Business Pulse — FAQ" />
    </>
  );
}
