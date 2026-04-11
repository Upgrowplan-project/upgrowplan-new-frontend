import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { softwareAppSchema, breadcrumbSchema, breadcrumbs, solutionData } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import EnPage from "../../[locale]/solutions/planMaster/page.en";

const SITE_URL = "https://upgrowplan.com";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: pageMeta.planMaster.enPath,
  ...pageMeta.planMaster,
});

export default function PlanMasterPage() {
  const data = solutionData.planMaster.en;
  const url = `${SITE_URL}${solutionData.planMaster.url}`;
  return (
    <>
      <JsonLd
        data={[
          softwareAppSchema({ ...data, url, isFree: solutionData.planMaster.isFree }),
          breadcrumbSchema(breadcrumbs.solutionPage("en", data.name)),
        ]}
      />
      <EnPage />
    </>
  );
}
