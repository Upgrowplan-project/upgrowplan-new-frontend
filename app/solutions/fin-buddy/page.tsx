import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { softwareAppSchema, breadcrumbSchema, breadcrumbs, solutionData } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import EnPage from "./page.en";

const SITE_URL = "https://upgrowplan.com";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: pageMeta.finBuddy.enPath,
  ...pageMeta.finBuddy,
});

export default function FinBuddyPage() {
  const data = solutionData.finBuddy.en;
  const url = `${SITE_URL}${solutionData.finBuddy.url}`;
  return (
    <>
      <JsonLd
        data={[
          softwareAppSchema({ ...data, url, isFree: solutionData.finBuddy.isFree }),
          breadcrumbSchema(breadcrumbs.solutionPage("en", data.name)),
        ]}
      />
      <EnPage />
    </>
  );
}
