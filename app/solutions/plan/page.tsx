import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { softwareAppSchema, breadcrumbSchema, breadcrumbs, solutionData } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import EnPage from "./page.en";

const SITE_URL = "https://upgrowplan.com";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: pageMeta.plan.enPath,
  ...pageMeta.plan,
});

export default function PlanPage() {
  const data = solutionData.plan.en;
  const url = `${SITE_URL}${solutionData.plan.url}`;
  return (
    <>
      <JsonLd
        data={[
          softwareAppSchema({ ...data, url, isFree: solutionData.plan.isFree }),
          breadcrumbSchema(breadcrumbs.solutionPage("en", data.name)),
        ]}
      />
      <EnPage />
    </>
  );
}
