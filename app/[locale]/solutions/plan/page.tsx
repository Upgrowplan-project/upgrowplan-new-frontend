import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { softwareAppSchema, breadcrumbSchema, breadcrumbs, solutionData, speakableSchema } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import PlanPageEn from "../../../solutions/plan/page.en";
import PlanPageRu from "../../../solutions/plan/page.ru";

const SITE_URL = "https://upgrowplan.com";
type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.plan;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function PlanLocalePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const data = solutionData.plan[locale];
  const url = `${SITE_URL}${locale === "ru" ? "/ru" : ""}${solutionData.plan.url}`;
  return (
    <>
      <JsonLd
        data={[
          softwareAppSchema({ ...data, url, isFree: solutionData.plan.isFree }),
          breadcrumbSchema(breadcrumbs.solutionPage(locale, data.name)),
          speakableSchema({ url, name: data.name, description: data.description, locale }),
        ]}
      />
      {locale === "ru" ? <PlanPageRu /> : <PlanPageEn />}
    </>
  );
}
