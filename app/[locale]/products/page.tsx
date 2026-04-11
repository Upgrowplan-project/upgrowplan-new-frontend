import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { breadcrumbSchema, breadcrumbs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import ProductsPageEn from "../../products/page.en";
import ProductsPageRu from "../../products/page.ru";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.products;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function ProductsLocalePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs.products(locale))} />
      {locale === "ru" ? <ProductsPageRu /> : <ProductsPageEn />}
    </>
  );
}
