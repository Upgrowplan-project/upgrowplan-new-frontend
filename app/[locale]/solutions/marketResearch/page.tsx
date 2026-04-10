import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import MarketResearchPageEn from "../../../solutions/marketResearch/page.en";
import MarketResearchPageRu from "../../../solutions/marketResearch/page.ru";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.marketResearch;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function MarketResearchLocalePage({ params }: Params) {
  return params.locale === "ru" ? (
    <MarketResearchPageRu />
  ) : (
    <MarketResearchPageEn />
  );
}
