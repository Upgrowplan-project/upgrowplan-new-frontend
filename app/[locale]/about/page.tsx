import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { aboutPageSchema, breadcrumbSchema, breadcrumbs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import AboutPageEn from "../../about/page.en";
import AboutPageRu from "../../about/page.ru";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.about;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function AboutLocalePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  return (
    <>
      <JsonLd
        data={[
          aboutPageSchema(locale),
          breadcrumbSchema(breadcrumbs.about(locale)),
        ]}
      />
      {locale === "ru" ? <AboutPageRu /> : <AboutPageEn />}
    </>
  );
}
