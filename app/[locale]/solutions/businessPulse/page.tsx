import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import BusinessPulsePageEn from "./page.en";
import BusinessPulsePageRu from "./page.ru";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.businessPulse;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function BusinessPulseLocalePage({ params }: Params) {
  return params.locale === "ru" ? <BusinessPulsePageRu /> : <BusinessPulsePageEn />;
}
