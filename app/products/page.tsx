import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { breadcrumbSchema, breadcrumbs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import EnPage from "./page.en";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: pageMeta.products.enPath,
  ...pageMeta.products,
});

export default function ProductsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs.products("en"))} />
      <EnPage />
    </>
  );
}
