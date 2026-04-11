import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { softwareAppSchema, breadcrumbSchema, breadcrumbs, solutionData } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import EnPage from "./page.en";

const SITE_URL = "https://upgrowplan.com";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: pageMeta.openAbroad.enPath,
  ...pageMeta.openAbroad,
});

export default function OpenAbroadPage() {
  const data = solutionData.openAbroad.en;
  const url = `${SITE_URL}${solutionData.openAbroad.url}`;
  return (
    <>
      <JsonLd
        data={[
          softwareAppSchema({ ...data, url, isFree: solutionData.openAbroad.isFree }),
          breadcrumbSchema(breadcrumbs.solutionPage("en", data.name)),
        ]}
      />
      <EnPage />
    </>
  );
}
