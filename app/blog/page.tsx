import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { blogSchema, breadcrumbSchema, breadcrumbs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import EnPage from "./page.en";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: pageMeta.blog.enPath,
  ...pageMeta.blog,
});

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={[
          blogSchema("en"),
          breadcrumbSchema(breadcrumbs.blog("en")),
        ]}
      />
      <EnPage />
    </>
  );
}
