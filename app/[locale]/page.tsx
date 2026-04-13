import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { organizationSchema, websiteSchema, faqSchema, pageFaqs } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import HomePageEn from "./page.en";
import HomePageRu from "./page.ru";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.home;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function HomePage({ params }: Params) {
  const locale = params.locale === "ru" ? "ru" : "en";
  const faqTitle = locale === "ru" ? "Часто задаваемые вопросы" : "Frequently Asked Questions";
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema(), faqSchema(pageFaqs.home[locale])]} />
      {locale === "ru" ? <HomePageRu /> : <HomePageEn />}
      <FaqSection items={pageFaqs.home[locale]} title={faqTitle} />
    </>
  );
}
