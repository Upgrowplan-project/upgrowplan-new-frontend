import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import MarketResearchDescriptionPageEn from "./page.en";
import MarketResearchDescriptionPageRu from "./page.ru";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.marketResearchDescription;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function MarketResearchDescriptionLocalePage({ params }: Params) {
  return params.locale === "ru" ? (
    <MarketResearchDescriptionPageRu />
  ) : (
    <MarketResearchDescriptionPageEn />
  );
}
