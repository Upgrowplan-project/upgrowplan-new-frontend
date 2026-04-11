import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import {
  itemListSchema,
  breadcrumbSchema,
  breadcrumbs,
  solutionData,
} from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import SolutionsPageEn from "./page.en";
import SolutionsPageRu from "./page.ru";

const SITE_URL = "https://upgrowplan.com";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.solutions;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function SolutionsLocalePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";

  const listItems = Object.entries(solutionData).map(([, val], i) => ({
    position: i + 1,
    name: val[locale].name,
    description: val[locale].description,
    url: `${SITE_URL}${locale === "ru" ? "/ru" : ""}${val.url}`,
  }));

  return (
    <>
      <JsonLd
        data={[
          itemListSchema(listItems),
          breadcrumbSchema(breadcrumbs.solutions(locale)),
        ]}
      />
      {locale === "ru" ? <SolutionsPageRu /> : <SolutionsPageEn />}
    </>
  );
}
