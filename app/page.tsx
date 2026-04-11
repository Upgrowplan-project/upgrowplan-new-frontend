import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { organizationSchema, websiteSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import HomeEn from "./[locale]/page.en";
import RootPageClient from "./RootPageClient";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: pageMeta.home.enPath,
  ...pageMeta.home,
});

export default function RootPage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <RootPageClient />
      <HomeEn />
    </>
  );
}
