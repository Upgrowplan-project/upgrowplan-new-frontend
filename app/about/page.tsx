import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { aboutPageSchema, breadcrumbSchema, breadcrumbs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import Header from "@/components/Header";
import EnPage from "./page.en";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: pageMeta.about.enPath,
  ...pageMeta.about,
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          aboutPageSchema("en"),
          breadcrumbSchema(breadcrumbs.about("en")),
        ]}
      />
      <Header />
      <EnPage />
    </>
  );
}
