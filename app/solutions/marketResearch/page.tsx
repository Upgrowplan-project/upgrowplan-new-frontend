import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { softwareAppSchema, breadcrumbSchema, breadcrumbs, solutionData } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import EnPage from "./page.en";

const SITE_URL = "https://upgrowplan.com";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: pageMeta.marketResearch.enPath,
  ...pageMeta.marketResearch,
});

export default function MarketResearchPage() {
  const data = solutionData.marketResearch.en;
  const url = `${SITE_URL}${solutionData.marketResearch.url}`;
  return (
    <>
      <JsonLd
        data={[
          softwareAppSchema({ ...data, url, isFree: solutionData.marketResearch.isFree }),
          breadcrumbSchema(breadcrumbs.solutionPage("en", data.name)),
        ]}
      />
      <EnPage />
    </>
  );
}
