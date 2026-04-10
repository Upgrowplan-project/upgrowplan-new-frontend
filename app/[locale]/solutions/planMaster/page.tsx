import type { Metadata } from "next";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import PlanMasterPageEn from "./page.en";
import PlanMasterPageRu from "./page.ru";

type Params = { params: { locale: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === "ru" ? "ru" : "en";
  const meta = pageMeta.planMaster;
  const path = locale === "ru" ? meta.ruPath : meta.enPath;
  return buildMetadata({ locale, path, ...meta });
}

export default function PlanMasterLocalePage({ params }: Params) {
  return params.locale === "ru" ? <PlanMasterPageRu /> : <PlanMasterPageEn />;
}
