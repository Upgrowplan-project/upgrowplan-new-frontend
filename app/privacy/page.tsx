import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { breadcrumbSchema, breadcrumbs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import EnPage from "./page.en";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: pageMeta.privacy.enPath,
  ...pageMeta.privacy,
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs.privacy("en"))} />
      <EnPage />
    </>
  );
}
