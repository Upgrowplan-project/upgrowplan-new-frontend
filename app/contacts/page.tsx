import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { contactPageSchema, breadcrumbSchema, breadcrumbs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import EnPage from "./page.en";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: pageMeta.contacts.enPath,
  ...pageMeta.contacts,
});

export default function ContactsPage() {
  return (
    <>
      <JsonLd
        data={[
          contactPageSchema("en"),
          breadcrumbSchema(breadcrumbs.contacts("en")),
        ]}
      />
      <EnPage />
    </>
  );
}
