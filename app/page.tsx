import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { organizationSchema, websiteSchema, speakableSchema, faqSchema, pageFaqs } from "@/lib/seo/jsonld";
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
      <JsonLd data={[
        organizationSchema(),
        websiteSchema(),
        speakableSchema({
          url: "https://www.upgrowplan.com",
          name: "Upgrowplan — AI Business Plan Generator with Market Validation, Synthetic Respondents & Financial Model",
          description: "AI business plan generator that validates before it generates: synthetic respondent testing, live market research from 50+ sources, UNIDO/EBRD investor-ready plan, Python financial model — Skeptic Agent verified, no hallucinations.",
          locale: "en",
        }),
        faqSchema(pageFaqs.home.en),
      ]} />
      <RootPageClient />
      <HomeEn />
    </>
  );
}
