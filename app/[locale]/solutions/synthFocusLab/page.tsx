import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { softwareAppSchema, breadcrumbSchema, breadcrumbs, solutionData, faqSchema, pageFaqs, speakableSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import SynthFocusLabPageEn from "../../../solutions/synthFocusLab/page.en";
import SynthFocusLabPageRu from "../../../solutions/synthFocusLab/page.ru";

const SITE_URL = "https://upgrowplan.com";
type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.synthFocusLab;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function SynthFocusLabLocalePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const data = solutionData.synthFocusLab[locale];
  const url = `${SITE_URL}${locale === "ru" ? "/ru" : ""}${solutionData.synthFocusLab.url}`;
  return (
    <>
      <JsonLd
        data={[
          softwareAppSchema({ ...data, url, isFree: solutionData.synthFocusLab.isFree }),
          breadcrumbSchema(breadcrumbs.solutionPage(locale, data.name)),
          faqSchema(pageFaqs.synthFocusLab[locale]),
          speakableSchema({ url, name: data.name, description: data.description, locale }),
        ]}
      />
      {locale === "ru" ? <SynthFocusLabPageRu /> : <SynthFocusLabPageEn />}
    </>
  );
}
