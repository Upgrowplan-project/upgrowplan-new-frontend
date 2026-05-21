import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { softwareAppSchema, breadcrumbSchema, breadcrumbs, solutionData } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import EnPage from "./page.en";

const SITE_URL = "https://www.upgrowplan.com";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: pageMeta.syntheticCustomerResearch.enPath,
  ...pageMeta.syntheticCustomerResearch,
});
metadata.robots = {
  index: false,
  follow: true,
};

export default function SynthFocusLabPage() {
  const data = solutionData.synthFocusLab.en;
  const url = `${SITE_URL}${solutionData.synthFocusLab.url}`;
  return (
    <>
      <JsonLd
        data={[
          softwareAppSchema({ ...data, url, isFree: solutionData.synthFocusLab.isFree }),
          breadcrumbSchema(breadcrumbs.solutionPage("en", data.name)),
        ]}
      />
      <EnPage />
    </>
  );
}
