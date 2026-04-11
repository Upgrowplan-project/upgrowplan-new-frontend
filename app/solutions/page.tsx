import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { itemListSchema, breadcrumbSchema, breadcrumbs, solutionData } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import EnPage from "../[locale]/solutions/page.en";

const SITE_URL = "https://upgrowplan.com";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: pageMeta.solutions.enPath,
  ...pageMeta.solutions,
});

export default function SolutionsPage() {
  const listItems = Object.entries(solutionData).map(([, val], i) => ({
    position: i + 1,
    name: val.en.name,
    description: val.en.description,
    url: `${SITE_URL}${val.url}`,
  }));

  return (
    <>
      <JsonLd
        data={[
          itemListSchema(listItems),
          breadcrumbSchema(breadcrumbs.solutions("en")),
        ]}
      />
      <EnPage />
    </>
  );
}
